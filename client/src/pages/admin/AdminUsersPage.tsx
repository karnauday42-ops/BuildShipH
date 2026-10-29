import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { Profile } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { Users, Shield, UserCheck, UserX, Mail, Phone } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    apiRequest<{ users: any[] }>('/admin/users')
      .then(res => setUsers(res.users))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await apiRequest(`/admin/users/${id}/toggle-status`, { method: 'PUT' });
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update user status');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            User Account Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Audit registered food donors, charities, and administrators. Manage account activation status.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-stone-500">Loading user accounts...</div>
        ) : (
          <div className="space-y-3">
            {users.map(u => (
              <div
                key={u.id}
                className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${u.full_name}`}
                    alt={u.full_name}
                    className="h-10 w-10 rounded-full border border-stone-200 dark:border-stone-700 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                        {u.full_name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.role === 'donor'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : u.role === 'recipient'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500">
                      {u.email} • {u.organization?.organization_name || 'Individual Profile'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.is_active
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                    }`}
                  >
                    {u.is_active ? 'Active' : 'Suspended'}
                  </span>

                  {u.role !== 'admin' && (
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        u.is_active
                          ? 'border border-red-300 text-red-600 hover:bg-red-50'
                          : 'border border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {u.is_active ? 'Suspend Account' : 'Reactivate'}
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

