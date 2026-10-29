import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { ImpactSummary } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { MetricCard } from '../../components/ui/MetricCard.js';
import {
  Leaf,
  Utensils,
  Flame,
  Droplets,
  Trees,
  Car,
  FileCheck2,
  Download,
  ShieldCheck,
} from 'lucide-react';

export const DonorImpactPage: React.FC = () => {
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<ImpactSummary>('/impact/donor')
      .then(res => setImpact(res))
      .catch(err => console.error('Failed to load donor impact:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalKg = impact?.total_rescued_kg || 0;
  const treeEquiv = Math.round(totalKg * 0.04 * 10) / 10;
  const carMilesEquiv = Math.round(totalKg * 6.2);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Donor Environmental & Social Impact
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Auditable corporate sustainability (ESG) reporting for surplus food diverted from landfills.
          </p>
        </div>

        {/* Primary Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Food Rescued"
            value={`${totalKg} kg`}
            subtitle="Diverted from waste stream"
            icon={Leaf}
            colorScheme="emerald"
          />
          <MetricCard
            title="Nutritious Meals"
            value={impact?.total_meals.toLocaleString() || '0'}
            subtitle="Served to families in need"
            icon={Utensils}
            colorScheme="amber"
          />
          <MetricCard
            title="CO₂e Avoided"
            value={`${impact?.total_co2_kg || 0} kg`}
            subtitle="Landfill greenhouse gases"
            icon={Flame}
            colorScheme="purple"
          />
          <MetricCard
            title="Virtual Water Saved"
            value={`${((impact?.total_water_liters || 0) / 1000).toFixed(0)} kL`}
            subtitle="Agricultural conservation"
            icon={Droplets}
            colorScheme="blue"
          />
        </div>

        {/* Equivalency & Offset Highlights */}
        <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            Tangible Ecological Equivalencies
          </div>
          <h2 className="text-xl font-bold">Your Kitchen's Contribution to the Planet</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-900/50 border border-emerald-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-600/30 text-emerald-300">
                <Trees className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black">{treeEquiv}</p>
                <p className="text-xs text-emerald-200">Tree seedlings grown for 10 years carbon absorption equivalent</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900/50 border border-emerald-800 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-teal-600/30 text-teal-300">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-black">{carMilesEquiv} miles</p>
                <p className="text-xs text-emerald-200">Gasoline vehicle passenger miles eliminated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Rescues History */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              Verified Rescue Records ({impact?.recent_records?.length || 0})
            </h3>
          </div>

          {!impact?.recent_records || impact.recent_records.length === 0 ? (
            <p className="text-xs text-stone-400 py-6 text-center">
              No completed donations recorded yet. When handovers are confirmed, permanent impact logs will appear here.
            </p>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {impact.recent_records.map(r => (
                <div key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100">
                      Rescued {r.quantity_rescued_kg} kg of food
                    </span>
                    <p className="text-stone-500 mt-0.5">
                      Completed {new Date(r.created_at).toLocaleDateString()} • Verified Dual Handover
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
                    <span className="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800">
                      {r.meals_provided} Meals
                    </span>
                    <span className="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800">
                      {r.co2_saved_kg} kg CO₂
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

