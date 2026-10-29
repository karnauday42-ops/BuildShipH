"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_js_1 = require("../controllers/adminController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authMiddleware, (0, auth_js_1.requireRole)('admin'));
router.get('/dashboard', adminController_js_1.AdminController.getDashboardStats);
router.get('/users', adminController_js_1.AdminController.getUsers);
router.put('/users/:id/toggle-status', adminController_js_1.AdminController.toggleUserStatus);
router.get('/reports', adminController_js_1.AdminController.getReports);
router.get('/settings', adminController_js_1.AdminController.getSettings);
router.post('/settings', adminController_js_1.AdminController.updateSettings);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map