import { Router } from 'express';
import { ListingController } from '../controllers/listingController.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = Router();

// Public / Authenticated search and discovery
router.get('/', ListingController.getListings);
router.get('/:id', ListingController.getListingById);

// Donor actions
router.post('/', authMiddleware, requireRole('donor', 'admin'), ListingController.createListing);
router.put('/:id', authMiddleware, requireRole('donor', 'admin'), ListingController.updateListing);
router.delete('/:id', authMiddleware, requireRole('donor', 'admin'), ListingController.cancelListing);

export default router;

