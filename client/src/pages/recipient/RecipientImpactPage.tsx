import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { ImpactSummary } from '../../types/index.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { MetricCard } from '../../components/ui/MetricCard.js';
import {
  Utensils,
  Leaf,
  Flame,
  Droplets,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';

export const RecipientImpactPage: React.FC = () => {
  const [impact, setImpact] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<ImpactSummary>('/impact/recipient')
      .then(res => setImpact(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Recipient Community Impact
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Nutritional and hunger relief metrics delivered to your local community programs.
          </p>
        </div>

        {/* Primary Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Meals Distributed"
            value={impact?.total_meals.toLocaleString() || '0'}
            subtitle="Wholesome portions provided"
            icon={Utensils}
            colorScheme="emerald"
          />
          <MetricCard
            title="Food Rescued"
            value={`${impact?.total_rescued_kg || 0} kg`}
            subtitle="Nutritious food diverted"
            icon={Leaf}
            colorScheme="amber"
          />
          <MetricCard
            title="Carbon Footprint Avoided"
            value={`${impact?.total_co2_kg || 0} kg`}
            subtitle="CO₂e emissions prevented"
            icon={Flame}
            colorScheme="purple"
          />
          <MetricCard
            title="Active Donor Partners"
            value={impact?.participating_donors_count || 0}
            subtitle="Local food establishments"
            icon={HeartHandshake}
            colorScheme="blue"
          />
        </div>

        {/* Impact Context Banner */}
        <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Hunger Relief Commitment
          </span>
          <h3 className="text-xl font-bold">Every Kilogram Rescued Serves a Family</h3>
          <p className="text-xs text-emerald-200 leading-relaxed max-w-2xl">
            Through safe redistribution, your organization transforms excess hotel buffets and grocery surplus into essential nutrition for shelter residents, at-risk youth, and vulnerable community members.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

