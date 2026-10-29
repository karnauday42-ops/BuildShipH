import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { Settings, Sun, Moon, Bell, Shield, KeyRound, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [urgentAlerts, setUrgentAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Account Preferences & Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Customize notification frequencies, visual themes, and security options.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Appearance */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Appearance & Theme
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100">Dark / Light Interface</p>
                <p className="text-xs text-stone-500">Currently set to {theme} mode.</p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-xs font-semibold flex items-center gap-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span>Switch to Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4 text-stone-700" />
                    <span>Switch to Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Alerts & Notification Channels
            </h2>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Immediate Critical Urgency Push Alerts
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Receive high-priority alerts when banquet food or dairy nears its deadline within 5 km.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={urgentAlerts}
                  onChange={e => setUrgentAlerts(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-stone-100 dark:border-stone-800">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Email Digest of Daily Rescues
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Receive end-of-day reports with meal and carbon avoidance summaries.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

