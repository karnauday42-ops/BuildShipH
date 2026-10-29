import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { apiRequest } from '../../lib/api.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { Building2, User, Mail, Phone, MapPin, Save, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { OrgType } from '../../types/index.js';

export const RecipientProfilePage: React.FC = () => {
  const { user, organization, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [orgName, setOrgName] = useState(organization?.organization_name || '');
  const [orgType, setOrgType] = useState<OrgType>(organization?.organization_type || 'food_bank');
  const [regNumber, setRegNumber] = useState(organization?.registration_number || '');
  const [capacity, setCapacity] = useState<number>(organization?.capacity_kg || 500);
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
            organization_type: orgType,
            registration_number: regNumber,
            capacity_kg: Number(capacity),
            address,
            latitude: organization.latitude,
            longitude: organization.longitude,
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
            Recipient Organization Profile
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your charity credentials, non-profit registration numbers, and cold storage capacity.
          </p>
        </div>

        {/* Verification Status Banner */}
        <div className="p-4 rounded-2xl border bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${organization?.verification_status === 'verified' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'}`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Verification Status
              </span>
              <p className="text-sm font-bold text-stone-900 dark:text-stone-100 capitalize">
                {organization?.verification_status || 'Pending Review'}
              </p>
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
              organization?.verification_status === 'verified'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
            }`}
          >
            {organization?.verification_status || 'Pending'}
          </span>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Organization profile successfully updated!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Organization Details */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Charity & Program Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Organization Name *
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
                  Organization Type *
                </label>
                <select
                  value={orgType}
                  onChange={e => setOrgType(e.target.value as OrgType)}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="food_bank">Food Bank / Large Pantry</option>
                  <option value="community_kitchen">Community Soup Kitchen</option>
                  <option value="shelter">Emergency Homeless Shelter</option>
                  <option value="ngo">Charitable NGO</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  NGO Registration / Tax-Exempt ID
                </label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={e => setRegNumber(e.target.value)}
                  placeholder="e.g. NGO-501C3-991"
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Daily Intake Capacity (kg)
                </label>
                <input
                  type="number"
                  min="10"
                  value={capacity}
                  onChange={e => setCapacity(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                Facility Receiving Address
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
              <span>{loading ? 'Saving Changes...' : 'Save Organization Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

