"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const listingController_js_1 = require("../controllers/listingController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
// Public / Authenticated search and discovery
router.get('/', listingController_js_1.ListingController.getListings);
router.get('/:id', listingController_js_1.ListingController.getListingById);
// Donor actions
router.post('/', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('donor', 'admin'), listingController_js_1.ListingController.createListing);
router.put('/:id', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('donor', 'admin'), listingController_js_1.ListingController.updateListing);
router.delete('/:id', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('donor', 'admin'), listingController_js_1.ListingController.cancelListing);
exports.default = router;
//# sourceMappingURL=listingRoutes.js.map