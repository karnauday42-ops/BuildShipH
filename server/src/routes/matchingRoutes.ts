import { Router } from 'express';
import { MatchingController } from '../controllers/matchingController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/listing/:id', authMiddleware, MatchingController.getListingMatches);
router.get('/nearby', authMiddleware, MatchingController.getNearbySurplusForRecipient);

export default router;

