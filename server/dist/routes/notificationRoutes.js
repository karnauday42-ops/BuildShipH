"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_js_1 = require("../controllers/notificationController.js");
const auth_js_1 = require("../middleware/auth.js");
const router = (0, express_1.Router)();
router.use(auth_js_1.authMiddleware);
router.get('/', notificationController_js_1.NotificationController.getNotifications);
router.put('/:id/read', notificationController_js_1.NotificationController.markAsRead);
router.put('/read-all', notificationController_js_1.NotificationController.markAllAsRead);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map