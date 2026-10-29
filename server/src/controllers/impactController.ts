import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { ImpactCalculator } from '../services/impactCalculator.js';

export class ImpactController {
  static async getGlobalImpact(req: AuthenticatedRequest, res: Response): Promise<void> {
    const summary = ImpactCalculator.getGlobalImpact();
    res.json(summary);
  }

  static async getDonorImpact(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const donorId = req.params.id ? String(req.params.id) : req.user.id;
    const summary = ImpactCalculator.getDonorImpact(donorId);
    const records = Array.from(db.impactRecords.values()).filter(r => r.donor_id === donorId);
    res.json({ ...summary, recent_records: records });
  }

  static async getRecipientImpact(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    const recipientId = req.params.id ? String(req.params.id) : req.user.id;
    const summary = ImpactCalculator.getRecipientImpact(recipientId);
    const records = Array.from(db.impactRecords.values()).filter(r => r.recipient_id === recipientId);
    res.json({ ...summary, recent_records: records });
  }
}
