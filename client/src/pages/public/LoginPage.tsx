import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { Leaf, Lock, Mail, Store, Utensils, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { UserRole } from '../../types/index.js';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setError(null);
    setLoading(true);
    try {
      await switchDemoRole(role);
      if (role === 'donor') navigate('/donor/dashboard');
      else if (role === 'recipient') navigate('/recipient/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Quick demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Leaf className="h-6 w-6" />
          </div>
        </Link>
        <h2 className="mt-4 text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
          Welcome to FoodRescue AI
        </h2>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          Sign in to manage surplus food donations and community rescue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Quick Demo Login Cards */}
        <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-500/30 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-2 text-center">
            ⚡ One-Click Reviewer Demo Login
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('donor')}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition text-center"
            >
              <Store className="h-4 w-4 text-emerald-600 mx-auto" />
              <span className="text-xs font-bold block mt-1">Donor</span>
              <span className="text-[10px] text-stone-400 block">Restaurant</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('recipient')}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition text-center"
            >
              <Utensils className="h-4 w-4 text-teal-600 mx-auto" />
              <span className="text-xs font-bold block mt-1">Recipient</span>
              <span className="text-[10px] text-stone-400 block">Food Bank</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition text-center"
            >
              <ShieldCheck className="h-4 w-4 text-purple-600 mx-auto" />
              <span className="text-xs font-bold block mt-1">Admin</span>
              <span className="text-[10px] text-stone-400 block">Platform</span>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="bg-white dark:bg-stone-900 py-8 px-6 shadow-md rounded-2xl border border-stone-200 dark:border-stone-800 sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Email Address
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="donor.hotel@foodrescue.ai"
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 pl-10 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2.5 pl-10 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
                />
                <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

