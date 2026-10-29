"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requestController_js_1 = require("../controllers/requestController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.post('/', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('recipient', 'admin'), requestController_js_1.RequestController.createRequest);
router.get('/donor', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('donor', 'admin'), requestController_js_1.RequestController.getDonorRequests);
router.get('/recipient', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('recipient', 'admin'), requestController_js_1.RequestController.getRecipientRequests);
router.post('/:id/approve', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('donor', 'admin'), requestController_js_1.RequestController.approveRequest);
router.post('/:id/reject', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('donor', 'admin'), requestController_js_1.RequestController.rejectRequest);
router.post('/:id/confirm-pickup', auth_js_1.authMiddleware, requestController_js_1.RequestController.confirmPickup);
exports.default = router;
//# sourceMappingURL=requestRoutes.js.map