import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import {
  LayoutDashboard,
  PlusCircle,
  ListOrdered,
  FileCheck2,
  BarChart3,
  Building2,
  Utensils,
  History,
  ShieldCheck,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, organization } = useAuth();

  if (!user) return null;

  const getLinks = () => {
    switch (user.role) {
      case 'donor':
        return [
          { to: '/donor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/donor/listings/new', label: 'Create Listing', icon: PlusCircle, highlight: true },
          { to: '/donor/listings', label: 'My Listings', icon: ListOrdered },
          { to: '/donor/requests', label: 'Incoming Requests', icon: FileCheck2 },
          { to: '/donor/impact', label: 'My Impact', icon: BarChart3 },
          { to: '/donor/profile', label: 'Donor Profile', icon: Building2 },
        ];
      case 'recipient':
        return [
          { to: '/recipient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/recipient/available-food', label: 'Browse Food', icon: Utensils, highlight: true },
          { to: '/recipient/requests', label: 'My Requests', icon: FileCheck2 },
          { to: '/recipient/received-food', label: 'Received History', icon: History },
          { to: '/recipient/impact', label: 'Community Impact', icon: BarChart3 },
          { to: '/recipient/profile', label: 'Org Profile', icon: Building2 },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', label: 'Platform Overview', icon: LayoutDashboard },
          { to: '/admin/organizations', label: 'Verifications', icon: ShieldCheck, highlight: true },
          { to: '/admin/listings', label: 'Listing Moderation', icon: ListOrdered },
          { to: '/admin/users', label: 'User Accounts', icon: Users },
          { to: '/admin/reports', label: 'Reports & Analytics', icon: BarChart3 },
          { to: '/admin/settings', label: 'System Settings', icon: Settings },
        ];
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 p-4 min-h-[calc(100vh-4rem)]">
      {/* Organization / User summary badge */}
      <div className="mb-6 p-3.5 rounded-xl bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700/60">
        <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
          {user.role === 'donor' ? 'Food Donor' : user.role === 'recipient' ? 'Recipient Charity' : 'Platform Admin'}
        </p>
        <p className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate mt-0.5">
          {organization?.organization_name || user.full_name}
        </p>
        {organization && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            {organization.verification_status === 'verified' ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified Partner
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-3.5 w-3.5" />
                Verification Pending
              </span>
            )}
          </div>
        )}
      </div>

      {/* Navigation items */}
      <nav className="space-y-1">
        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to.endsWith('dashboard')}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : link.highlight
                    ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

