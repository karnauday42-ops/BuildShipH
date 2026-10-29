import { Router } from 'express';
import { ImpactController } from '../controllers/impactController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/global', ImpactController.getGlobalImpact);
router.get('/donor', authMiddleware, ImpactController.getDonorImpact);
router.get('/recipient', authMiddleware, ImpactController.getRecipientImpact);
router.get('/donor/:id', ImpactController.getDonorImpact);
router.get('/recipient/:id', ImpactController.getRecipientImpact);

export default router;

