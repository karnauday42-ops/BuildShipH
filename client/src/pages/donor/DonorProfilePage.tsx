import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { apiRequest } from '../../lib/api.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { Building2, User, Mail, Phone, MapPin, Save, CheckCircle2 } from 'lucide-react';

export const DonorProfilePage: React.FC = () => {
  const { user, organization, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [orgName, setOrgName] = useState(organization?.organization_name || '');
  const [address, setAddress] = useState(organization?.address || '');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      await apiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ full_name: fullName, phone }),
      });

      if (organization) {
        await apiRequest('/organizations/my', {
          method: 'POST',
          body: JSON.stringify({
            organization_name: orgName,
            organization_type: organization.organization_type,
            address,
            latitude: organization.latitude,
            longitude: organization.longitude,
            capacity_kg: organization.capacity_kg,
          }),
        });
      }

      await refreshUser();
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Donor Business Profile
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your donor account information, kitchen contacts, and physical pickup locations.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Personal Account Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Full Name
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                  />
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Contact Phone
                </label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                  />
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Email Address (Login Identity)
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-800/50 px-3.5 py-2 pl-9 text-xs sm:text-sm text-stone-500 cursor-not-allowed"
                />
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Business Facility & Pickup Logistics
            </h2>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Business / Restaurant Name
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  required
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Physical Pickup Address
              </label>
              <div className="relative mt-1">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 pl-9 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

