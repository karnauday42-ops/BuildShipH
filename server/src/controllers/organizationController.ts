import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { CreateOrganizationSchema } from '../schemas/index.js';
import { Organization } from '../types/index.js';

export class OrganizationController {
  static async getMyOrganization(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const org = Array.from(db.organizations.values()).find(o => o.owner_id === req.user!.id);
    if (!org) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    res.json({ organization: org });
  }

  static async getOrganizations(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { status, type } = req.query;
    let list = Array.from(db.organizations.values());

    if (status) {
      list = list.filter(o => o.verification_status === status);
    }
    if (type) {
      list = list.filter(o => o.organization_type === type);
    }

    res.json({ organizations: list });
  }

  static async upsertMyOrganization(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const parseResult = CreateOrganizationSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
      return;
    }

    const data = parseResult.data;
    let org = Array.from(db.organizations.values()).find(o => o.owner_id === req.user!.id);

    if (org) {
      Object.assign(org, data, { updated_at: new Date().toISOString() });
    } else {
      org = {
        id: uuidv4(),
        owner_id: req.user.id,
        ...data,
        verification_status: req.user.role === 'recipient' ? 'pending' : 'verified',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.organizations.set(org.id, org);
    }

    res.json({ organization: org });
  }

  static async verifyOrganization(req: AuthenticatedRequest, res: Response): Promise<void> {
    const id = String(req.params.id);
    const { status } = req.body; // 'verified' | 'rejected' | 'suspended'

    if (!['verified', 'rejected', 'suspended'].includes(status)) {
      res.status(400).json({ error: 'Invalid verification status' });
      return;
    }

    const org = db.organizations.get(id);
    if (!org) {
      res.status(404).json({ error: 'Organization not found' });
      return;
    }

    org.verification_status = status;
    org.updated_at = new Date().toISOString();

    // Notify organization owner
    db.createNotification({
      user_id: org.owner_id,
      title: 'Organization Verification Update 📋',
      message: `Your organization "${org.organization_name}" verification status is now: ${status.toUpperCase()}.`,
      type: 'verification_update',
      link_url: '/recipient/profile',
    });

    res.json({ message: `Organization marked as ${status}`, organization: org });
  }
}
