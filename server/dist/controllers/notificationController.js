"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const store_js_1 = require("../db/store.js");
class NotificationController {
    static async getNotifications(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const notifs = Array.from(store_js_1.db.notifications.values())
            .filter(n => n.user_id === req.user.id)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const unreadCount = notifs.filter(n => !n.is_read).length;
        res.json({ notifications: notifs, unread_count: unreadCount });
    }
    static async markAsRead(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const id = String(req.params.id);
        const notif = store_js_1.db.notifications.get(id);
        if (!notif || notif.user_id !== req.user.id) {
            res.status(404).json({ error: 'Notification not found' });
            return;
        }
        notif.is_read = true;
        res.json({ notification: notif });
    }
    static async markAllAsRead(req, res) {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        Array.from(store_js_1.db.notifications.values())
            .filter(n => n.user_id === req.user.id)
            .forEach(n => {
            n.is_read = true;
        });
        res.json({ message: 'All notifications marked as read' });
    }
}
exports.NotificationController = NotificationController;
//# sourceMappingURL=notificationController.js.map