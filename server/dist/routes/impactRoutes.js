"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const impactController_js_1 = require("../controllers/impactController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.get('/global', impactController_js_1.ImpactController.getGlobalImpact);
router.get('/donor', auth_js_1.authMiddleware, impactController_js_1.ImpactController.getDonorImpact);
router.get('/recipient', auth_js_1.authMiddleware, impactController_js_1.ImpactController.getRecipientImpact);
router.get('/donor/:id', impactController_js_1.ImpactController.getDonorImpact);
router.get('/recipient/:id', impactController_js_1.ImpactController.getRecipientImpact);
exports.default = router;
//# sourceMappingURL=impactRoutes.js.map