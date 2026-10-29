"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organizationController_js_1 = require("../controllers/organizationController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.get('/my', auth_js_1.authMiddleware, organizationController_js_1.OrganizationController.getMyOrganization);
router.post('/my', auth_js_1.authMiddleware, organizationController_js_1.OrganizationController.upsertMyOrganization);
router.get('/', organizationController_js_1.OrganizationController.getOrganizations);
router.put('/:id/verify', auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('admin'), organizationController_js_1.OrganizationController.verifyOrganization);
exports.default = router;
//# sourceMappingURL=organizationRoutes.js.map