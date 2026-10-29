"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const advisoryController_js_1 = require("../controllers/advisoryController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.post('/preview', auth_js_1.authMiddleware, advisoryController_js_1.AdvisoryController.previewAdvisory);
router.get('/listing/:listingId', advisoryController_js_1.AdvisoryController.getListingAdvisory);
exports.default = router;
//# sourceMappingURL=advisoryRoutes.js.map