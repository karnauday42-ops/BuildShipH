import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { AIAdvisoryInputSchema } from '../schemas/index.js';
import { GeminiService } from '../services/geminiService.js';
import { db } from '../db/store.js';

export class AdvisoryController {
  static async previewAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
    const parseResult = AIAdvisoryInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
      return;
    }

    const input = parseResult.data;
    try {
      const advisory = await GeminiService.generateAdvisory(input);
      res.json({ advisory });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate AI advisory', message: err.message });
    }
  }

  static async getListingAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { listingId } = req.params;
    const advisory = Array.from(db.advisories.values()).find(a => a.listing_id === listingId);

    if (!advisory) {
      res.status(404).json({ error: 'Advisory not found for this listing' });
      return;
    }

    res.json({ advisory });
  }
}

