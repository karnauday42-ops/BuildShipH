"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_js_1 = require("../controllers/authController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.post('/register', authController_js_1.AuthController.register);
router.post('/login', authController_js_1.AuthController.login);
router.post('/switch-demo-role', authController_js_1.AuthController.switchDemoRole);
router.get('/me', auth_js_1.authMiddleware, authController_js_1.AuthController.getMe);
router.put('/profile', auth_js_1.authMiddleware, authController_js_1.AuthController.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map