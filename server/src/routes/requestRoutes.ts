import { Router } from 'express';
import { RequestController } from '../controllers/requestController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.post('/', authMiddleware, requireRole('recipient', 'admin'), RequestController.createRequest);
router.get('/donor', authMiddleware, requireRole('donor', 'admin'), RequestController.getDonorRequests);
router.get('/recipient', authMiddleware, requireRole('recipient', 'admin'), RequestController.getRecipientRequests);
router.post('/:id/approve', authMiddleware, requireRole('donor', 'admin'), RequestController.approveRequest);
router.post('/:id/reject', authMiddleware, requireRole('donor', 'admin'), RequestController.rejectRequest);
router.post('/:id/confirm-pickup', authMiddleware, RequestController.confirmPickup);

export default router;

