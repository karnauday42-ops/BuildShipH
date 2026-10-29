import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware, requireRole('admin'));

router.get('/dashboard', AdminController.getDashboardStats);
router.get('/users', AdminController.getUsers);
router.put('/users/:id/toggle-status', AdminController.toggleUserStatus);
router.get('/reports', AdminController.getReports);
router.get('/settings', AdminController.getSettings);
router.post('/settings', AdminController.updateSettings);

export default router;

