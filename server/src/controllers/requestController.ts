import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { CreateRequestSchema } from '../schemas/index.js';
import { DonationRequest } from '../types/index.js';

export class RequestController {
  static async createRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const parseResult = CreateRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
      return;
    }

    const { listing_id, requested_quantity, pickup_notes } = parseResult.data;
    const listing = db.listings.get(listing_id);

    if (!listing) {
      res.status(404).json({ error: 'Food listing not found' });
      return;
    }

    if (listing.status !== 'available' && listing.status !== 'partially_reserved') {
      res.status(400).json({ error: `Listing is not available for requests (current status: ${listing.status})` });
      return;
    }

    if (requested_quantity > listing.remaining_quantity) {
      res.status(400).json({
        error: `Requested quantity (${requested_quantity}) exceeds available quantity (${listing.remaining_quantity})`,
      });
      return;
    }

    const recipientOrg = Array.from(db.organizations.values()).find(
      o => o.owner_id === req.user!.id
    );

    const request: DonationRequest = {
      id: uuidv4(),
      listing_id,
      recipient_id: req.user.id,
      organization_id: recipientOrg?.id || null,
      requested_quantity,
      status: 'pending',
      pickup_notes: pickup_notes || null,
      rejection_reason: null,
      collection_confirmed_by_recipient: false,
      handover_confirmed_by_donor: false,
      collected_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      listing,
      recipient: req.user,
      organization: recipientOrg,
    };

    db.requests.set(request.id, request);

    // Notify donor
    db.createNotification({
      user_id: listing.donor_id,
      title: 'New Food Donation Request! 📥',
      message: `${recipientOrg?.organization_name || req.user.full_name} has requested ${requested_quantity} ${listing.quantity_unit} of "${listing.food_name}".`,
      type: 'request_received',
      link_url: '/donor/requests',
    });

    res.status(201).json({
      message: 'Donation request submitted successfully',
      request,
    });
  }

  static async getDonorRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Find all listings owned by donor
    const donorListingIds = new Set(
      Array.from(db.listings.values())
        .filter(l => l.donor_id === req.user!.id)
        .map(l => l.id)
    );

    const requests = Array.from(db.requests.values())
      .filter(r => donorListingIds.has(r.listing_id))
      .map(r => ({
        ...r,
        listing: db.listings.get(r.listing_id),
        recipient: db.profiles.get(r.recipient_id),
        organization: r.organization_id ? db.organizations.get(r.organization_id) : null,
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ requests });
  }

  static async getRecipientRequests(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const requests = Array.from(db.requests.values())
      .filter(r => r.recipient_id === req.user!.id)
      .map(r => ({
        ...r,
        listing: db.listings.get(r.listing_id),
        recipient: db.profiles.get(r.recipient_id),
        organization: r.organization_id ? db.organizations.get(r.organization_id) : null,
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    res.json({ requests });
  }

  static async approveRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const id = String(req.params.id);
    const result = db.reserveFoodQuantity(id, req.user.id);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    const updatedRequest = db.requests.get(id);
    const updatedListing = updatedRequest ? db.listings.get(updatedRequest.listing_id) : null;

    res.json({
      message: 'Request approved and food quantity reserved atomically',
      request: updatedRequest,
      listing: updatedListing,
    });
  }

  static async rejectRequest(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const id = String(req.params.id);
    const { reason } = req.body;

    const request = db.requests.get(id);
    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const listing = db.listings.get(request.listing_id);
    if (!listing || listing.donor_id !== req.user.id) {
      res.status(403).json({ error: 'Unauthorized to reject this request' });
      return;
    }

    request.status = 'rejected';
    request.rejection_reason = reason || 'Donor is unable to fulfill this request at this time.';
    request.updated_at = new Date().toISOString();

    db.createNotification({
      user_id: request.recipient_id,
      title: 'Donation Request Status Update',
      message: `Your request for "${listing.food_name}" could not be accepted. Note: ${request.rejection_reason}`,
      type: 'request_rejected',
      link_url: '/recipient/requests',
    });

    res.json({ message: 'Request rejected', request });
  }

  static async confirmPickup(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const id = String(req.params.id);
    const isDonor = req.user.role === 'donor';

    const result = db.confirmPickup(id, req.user.id, isDonor);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    const request = db.requests.get(id);

    res.json({
      message: result.completed
        ? 'Dual confirmation complete! Donation marked complete and environmental impact recorded.'
        : 'Your pickup confirmation was recorded. Waiting for the other party.',
      request,
      completed: result.completed,
      impact: result.impact,
    });
  }
}
