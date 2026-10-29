import { Response } from 'express';
import { db } from '../db/store.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export class NotificationController {
  static async getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const notifs = Array.from(db.notifications.values())
      .filter(n => n.user_id === req.user!.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const unreadCount = notifs.filter(n => !n.is_read).length;

    res.json({ notifications: notifs, unread_count: unreadCount });
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const id = String(req.params.id);
    const notif = db.notifications.get(id);

    if (!notif || notif.user_id !== req.user.id) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    notif.is_read = true;
    res.json({ notification: notif });
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    Array.from(db.notifications.values())
      .filter(n => n.user_id === req.user!.id)
      .forEach(n => {
        n.is_read = true;
      });

    res.json({ message: 'All notifications marked as read' });
  }
}
