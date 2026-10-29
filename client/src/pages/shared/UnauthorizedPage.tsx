import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'donor') return '/donor/dashboard';
    if (user.role === 'recipient') return '/recipient/dashboard';
    return '/admin/dashboard';
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-black text-stone-900 dark:text-stone-100">
          Access Restricted (403)
        </h1>

        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
          You do not possess the required permission level to access this resource. Your current active role is <strong className="text-stone-900 dark:text-stone-100 uppercase">{user?.role || 'Guest'}</strong>.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            to={getDashboardLink()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Home className="h-4 w-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

