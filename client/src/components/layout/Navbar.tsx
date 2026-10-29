import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { apiRequest } from '../../lib/api.js';
import {
  Leaf,
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  UtensilsCrossed,
  Store,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { UserRole } from '../../types/index.js';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll notifications count if user logged in
  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await apiRequest<{ unread_count: number }>('/notifications');
        setUnreadCount(res.unread_count || 0);
      } catch {
        // ignore
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleDemoSwitch = async (role: UserRole) => {
    await switchDemoRole(role);
    if (role === 'donor') navigate('/donor/dashboard');
    else if (role === 'recipient') navigate('/recipient/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/90 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-stone-900 dark:text-stone-100">
                FoodRescue<span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                SMART SURPLUS
              </span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 -mt-1 hidden sm:block">
              Zero-Waste Redistribution Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/about"
            className={`transition hover:text-emerald-600 dark:hover:text-emerald-400 ${
              location.pathname === '/about' ? 'text-emerald-600 font-semibold' : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Mission & Impact
          </Link>
          <Link
            to="/food-safety"
            className={`transition hover:text-emerald-600 dark:hover:text-emerald-400 ${
              location.pathname === '/food-safety' ? 'text-emerald-600 font-semibold' : 'text-stone-600 dark:text-stone-300'
            }`}
          >
            Food Safety & AI
          </Link>

          {/* Role-based Dashboard link */}
          {user && (
            <Link
              to={
                user.role === 'donor'
                  ? '/donor/dashboard'
                  : user.role === 'recipient'
                  ? '/recipient/dashboard'
                  : '/admin/dashboard'
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </nav>

        {/* Right Section: Persona Switcher, Notifications, Theme, User Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Persona Switcher Pill */}
          <div className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-medium border border-stone-200 dark:border-stone-700">
            <span className="px-2 text-[11px] text-stone-400 uppercase tracking-wider font-semibold">
              Demo:
            </span>
            <button
              onClick={() => handleDemoSwitch('donor')}
              className={`px-2.5 py-1 rounded-lg transition ${
                user?.role === 'donor'
                  ? 'bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
              title="Test as Food Donor (Restaurant/Store)"
            >
              Donor
            </button>
            <button
              onClick={() => handleDemoSwitch('recipient')}
              className={`px-2.5 py-1 rounded-lg transition ${
                user?.role === 'recipient'
                  ? 'bg-white dark:bg-stone-700 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
              title="Test as Recipient NGO / Kitchen"
            >
              Recipient
            </button>
            <button
              onClick={() => handleDemoSwitch('admin')}
              className={`px-2.5 py-1 rounded-lg transition ${
                user?.role === 'admin'
                  ? 'bg-white dark:bg-stone-700 text-purple-600 dark:text-purple-400 font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
              title="Test as Platform Administrator"
            >
              Admin
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Notifications Icon (if logged in) */}
          {user && (
            <Link
              to="/notifications"
              className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Authentication Actions */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`}
                  alt={user.full_name}
                  className="h-8 w-8 rounded-full border border-emerald-500/30 object-cover"
                />
                <div className="text-left leading-none hidden xl:block">
                  <p className="text-xs font-bold text-stone-900 dark:text-stone-100">{user.full_name}</p>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                title="Log Out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-900 space-y-3">
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Mission & Impact
          </Link>
          <Link
            to="/food-safety"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Food Safety & AI
          </Link>

          {user && (
            <Link
              to={
                user.role === 'donor'
                  ? '/donor/dashboard'
                  : user.role === 'recipient'
                  ? '/recipient/dashboard'
                  : '/admin/dashboard'
              }
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-emerald-600 dark:text-emerald-400"
            >
              Active Dashboard ({user.role.toUpperCase()})
            </Link>
          )}

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
            <p className="text-xs font-semibold text-stone-400 mb-2 uppercase">Switch Demo Account</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleDemoSwitch('donor');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              >
                Donor
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch('recipient');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              >
                Recipient
              </button>
              <button
                onClick={() => {
                  handleDemoSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

