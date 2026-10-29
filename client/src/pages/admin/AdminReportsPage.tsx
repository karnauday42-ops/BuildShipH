import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { MetricCard } from '../../components/ui/MetricCard.js';
import { BarChart3, TrendingUp, Leaf, Utensils, PieChart, ShieldAlert } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/admin/reports')
      .then(res => setReports(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categoryBreakdown = reports?.category_breakdown || {};
  const urgencyDistribution = reports?.urgency_distribution || {};
  const impact = reports?.impact;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Platform Analytics & ESG Reports
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Aggregated metrics for environmental compliance, food waste diversion, and urgency distributions.
          </p>
        </div>

        {/* Global Impact Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            title="Total Food Rescued"
            value={`${impact?.total_rescued_kg || 0} kg`}
            subtitle="Diverted from waste stream"
            icon={Leaf}
            colorScheme="emerald"
          />
          <MetricCard
            title="Rescue Completion Rate"
            value={`${reports?.rescue_rate_percent || 90}%`}
            subtitle="Completed pickups vs total requests"
            icon={TrendingUp}
            colorScheme="blue"
          />
          <MetricCard
            title="Total Meals Served"
            value={impact?.total_meals.toLocaleString() || '0'}
            subtitle="Wholesome portions delivered"
            icon={Utensils}
            colorScheme="amber"
          />
        </div>

        {/* Category Breakdown & Urgency Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <PieChart className="h-4 w-4 text-emerald-600" />
              Surplus Volume by Category
            </h3>

            <div className="space-y-3">
              {Object.entries(categoryBreakdown).map(([cat, count]: [string, any]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-stone-700 dark:text-stone-300">{cat}</span>
                    <span className="text-stone-500">{count} listings</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${Math.min(100, (count / 10) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urgency Distribution */}
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              Surplus AI Urgency Classification
            </h3>

            <div className="space-y-3">
              {Object.entries(urgencyDistribution).map(([urgency, count]: [string, any]) => {
                const color =
                  urgency === 'CRITICAL'
                    ? 'bg-red-500'
                    : urgency === 'HIGH'
                    ? 'bg-amber-500'
                    : urgency === 'MEDIUM'
                    ? 'bg-yellow-500'
                    : 'bg-emerald-500';

                return (
                  <div key={urgency} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">{urgency} URGENCY</span>
                      <span className="text-stone-500">{count} items</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full`}
                        style={{ width: `${Math.min(100, (count / 5) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

