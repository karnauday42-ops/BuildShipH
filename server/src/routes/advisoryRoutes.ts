import { Router } from 'express';
import { AdvisoryController } from '../controllers/advisoryController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/preview', authMiddleware, AdvisoryController.previewAdvisory);
router.get('/listing/:listingId', AdvisoryController.getListingAdvisory);

export default router;

