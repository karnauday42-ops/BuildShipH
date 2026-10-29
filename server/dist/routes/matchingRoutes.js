"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const matchingController_js_1 = require("../controllers/matchingController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.get('/listing/:id', auth_js_1.authMiddleware, matchingController_js_1.MatchingController.getListingMatches);
router.get('/nearby', auth_js_1.authMiddleware, matchingController_js_1.MatchingController.getNearbySurplusForRecipient);
exports.default = router;
//# sourceMappingURL=matchingRoutes.js.map