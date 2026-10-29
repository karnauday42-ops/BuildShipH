import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { Notification } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { Bell, CheckCircle2, Clock, Check, ExternalLink } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    apiRequest<{ notifications: Notification[] }>('/notifications')
      .then(res => setNotifications(res.notifications))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiRequest('/notifications/read-all', { method: 'PUT' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Activity & Notifications
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Surplus alerts, donation intake requests, pickup reminders, and verification notices.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-300 transition"
          >
            Mark All as Read
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-6">
            <Bell className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No Notifications</h3>
            <p className="text-xs text-stone-500 mt-1">You are up to date on all platform events.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  n.is_read
                    ? 'bg-white/70 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800'
                    : 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {!n.is_read && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                      {n.title}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {n.message}
                  </p>

                  <p className="text-[11px] text-stone-400 pt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {n.link_url && (
                    <Link
                      to={n.link_url}
                      className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}

                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 text-xs"
                      title="Mark read"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

