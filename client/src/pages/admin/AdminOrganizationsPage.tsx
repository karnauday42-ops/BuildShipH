import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { Organization } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
  Clock,
} from 'lucide-react';

export const AdminOrganizationsPage: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchOrgs = () => {
    setLoading(true);
    const query = filter !== 'all' ? `?status=${filter}` : '';
    apiRequest<{ organizations: Organization[] }>(`/organizations${query}`)
      .then(res => setOrganizations(res.organizations))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrgs();
  }, [filter]);

  const handleUpdateStatus = async (id: string, status: 'verified' | 'rejected' | 'suspended') => {
    setActionLoading(id);
    try {
      await apiRequest(`/organizations/${id}/verify`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      fetchOrgs();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200/80 dark:border-stone-800 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
              Organization Verification
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
              Authenticate recipient non-profits, shelters, and soup kitchens before granting surplus pickup access.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800">
            {['all', 'pending', 'verified', 'rejected', 'suspended'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  filter === s
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Loading organizations...</div>
        ) : organizations.length === 0 ? (
          <div className="py-16 text-center border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl p-6">
            <Building2 className="h-10 w-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700 dark:text-stone-300">No Organizations Found</h3>
            <p className="text-xs text-stone-500 mt-1">No organizations currently match the selected status filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {organizations.map(org => (
              <div
                key={org.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        org.verification_status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : org.verification_status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}
                    >
                      {org.verification_status}
                    </span>
                    <span className="text-xs text-stone-400 capitalize">
                      {org.organization_type.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {org.organization_name}
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    Registration No: <span className="font-semibold text-stone-800 dark:text-stone-200">{org.registration_number || 'Unprovided'}</span> • Daily Capacity: {org.capacity_kg} kg
                  </p>

                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    {org.address}
                  </p>
                </div>

                {/* Verification Control Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
                  {org.verification_status !== 'verified' && (
                    <button
                      onClick={() => handleUpdateStatus(org.id, 'verified')}
                      disabled={actionLoading === org.id}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Approve Verification</span>
                    </button>
                  )}

                  {org.verification_status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(org.id, 'rejected')}
                      disabled={actionLoading === org.id}
                      className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
                    >
                      Decline
                    </button>
                  )}

                  {org.verification_status === 'verified' && (
                    <button
                      onClick={() => handleUpdateStatus(org.id, 'suspended')}
                      disabled={actionLoading === org.id}
                      className="px-3.5 py-2 rounded-xl border border-red-300 dark:border-red-900 text-red-600 font-semibold text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                    >
                      Suspend
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

