import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { calculateDistanceKm, MatchingEngine } from '../services/matchingEngine.js';

export class MatchingController {
  static async getListingMatches(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = String(req.params.id);
    const listing = db.listings.get(id);

    if (!listing) {
      res.status(404).json({ error: 'Listing not found' });
      return;
    }

    try {
      const matches = await MatchingEngine.findRecipientsForListing(listing);
      res.json({ listing_id: id, matches });
    } catch (err: any) {
      res.status(500).json({ error: 'Matching engine failed', message: err.message });
    }
  }

  static async getNearbySurplusForRecipient(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // Find recipient organization coordinates
    const org = Array.from(db.organizations.values()).find(o => o.owner_id === req.user!.id);
    const userLat = org?.latitude || 37.7749;
    const userLon = org?.longitude || -122.4194;

    const available = Array.from(db.listings.values()).filter(
      l => l.status === 'available' || l.status === 'partially_reserved'
    );

    const matches = available.map(listing => {
      const dist = calculateDistanceKm(
        userLat,
        userLon,
        listing.pickup_latitude,
        listing.pickup_longitude
      );

      const urgency = listing.advisory?.urgency_level || 'MEDIUM';
      let score = 60;
      if (dist <= 3) score += 30;
      else if (dist <= 8) score += 20;
      else if (dist <= 15) score += 10;

      if (urgency === 'CRITICAL') score += 10;

      return {
        listing: {
          ...listing,
          advisory: listing.advisory || Array.from(db.advisories.values()).find(a => a.listing_id === listing.id),
        },
        distance_km: dist,
        match_score: Math.min(100, score),
      };
    });

    matches.sort((a, b) => b.match_score - a.match_score);

    res.json({ matches });
  }
}
