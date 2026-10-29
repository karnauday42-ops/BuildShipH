import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../lib/api.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { MetricCard } from '../../components/ui/MetricCard.js';
import {
  Users,
  ShieldCheck,
  Package,
  TrendingUp,
  AlertTriangle,
  Building2,
  FileCheck2,
  Leaf,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/admin/dashboard')
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats;
  const impact = data?.impact;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Platform Administration Center
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Real-time platform governance, charity verification, listing moderation, and environmental impact reporting.
          </p>
        </div>

        {/* Pending Verifications Alert */}
        {stats?.pending_verifications > 0 && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">
                  {stats.pending_verifications} Organization(s) Awaiting Non-Profit Verification
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  Review charity registration documentation to grant full surplus intake privileges.
                </p>
              </div>
            </div>
            <Link
              to="/admin/organizations"
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition shrink-0"
            >
              Review Queue →
            </Link>
          </div>
        )}

        {/* Global Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Platform Users"
            value={stats?.total_users || 0}
            subtitle={`${stats?.donors_count || 0} Donors • ${stats?.recipients_count || 0} Charities`}
            icon={Users}
            colorScheme="blue"
          />
          <MetricCard
            title="Pending Verifications"
            value={stats?.pending_verifications || 0}
            subtitle="NGO / Charity Queue"
            icon={ShieldCheck}
            colorScheme="amber"
          />
          <MetricCard
            title="Total Surplus Rescued"
            value={`${impact?.total_rescued_kg || 0} kg`}
            subtitle={`${impact?.total_meals || 0} meals generated`}
            icon={Leaf}
            colorScheme="emerald"
          />
          <MetricCard
            title="GHG Emissions Diverted"
            value={`${impact?.total_co2_kg || 0} kg`}
            subtitle="CO₂e prevented from landfills"
            icon={Flame}
            colorScheme="purple"
          />
        </div>

        {/* Quick Admin Actions & Operations */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/admin/organizations"
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 transition space-y-2 block"
          >
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Verify Organizations
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Authenticate 501(c)(3) tax exempt and municipal registration documents.
            </p>
          </Link>

          <Link
            to="/admin/listings"
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 transition space-y-2 block"
          >
            <Package className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Listing Moderation
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Inspect AI spoilage models, food safety disclosures, and delist violations.
            </p>
          </Link>

          <Link
            to="/admin/reports"
            className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 transition space-y-2 block"
          >
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Analytics & ESG Reports
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Export comprehensive UN SDG 12.3 and carbon footprint reports.
            </p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

