import { Router } from 'express';
import { OrganizationController } from '../controllers/organizationController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/my', authMiddleware, OrganizationController.getMyOrganization);
router.post('/my', authMiddleware, OrganizationController.upsertMyOrganization);
router.get('/', OrganizationController.getOrganizations);
router.put('/:id/verify', authMiddleware, requireRole('admin'), OrganizationController.verifyOrganization);

export default router;

