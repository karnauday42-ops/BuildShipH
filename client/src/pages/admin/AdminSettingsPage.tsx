import React, { useEffect, useState } from 'react';
import { apiRequest } from '../../lib/api.js';
import { DashboardLayout } from '../../components/layout/DashboardLayout.js';
import { Settings, Save, CheckCircle2, ShieldAlert } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [kgToMeals, setKgToMeals] = useState<number>(2.38);
  const [kgToCo2, setKgToCo2] = useState<number>(2.50);
  const [kgToWater, setKgToWater] = useState<number>(1000.0);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiRequest<{ settings: any }>('/admin/settings')
      .then(res => {
        setSettings(res.settings);
        const factors = res.settings?.impact_factors;
        if (factors) {
          setKgToMeals(factors.kg_to_meals);
          setKgToCo2(factors.kg_to_co2);
          setKgToWater(factors.kg_to_water_liters);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);

    try {
      await apiRequest('/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          key: 'impact_factors',
          value: {
            kg_to_meals: Number(kgToMeals),
            kg_to_co2: Number(kgToCo2),
            kg_to_water_liters: Number(kgToWater),
          },
        }),
      });
      setSaved(true);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Platform System Settings
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Configure global impact conversion factors, USDA/FDA food code thresholds, and safety policies.
          </p>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Environmental conversion factors updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Environmental Impact Conversion Factors
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Meals Factor (meals / kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={kgToMeals}
                  onChange={e => setKgToMeals(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Default: 2.38 (FAO standard)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  CO₂ Factor (kg CO₂e / kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={kgToCo2}
                  onChange={e => setKgToCo2(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Default: 2.50 (EPA WARM)</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Virtual Water (liters / kg)
                </label>
                <input
                  type="number"
                  step="1"
                  required
                  value={kgToWater}
                  onChange={e => setKgToWater(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 px-3.5 py-2 text-sm text-stone-900 dark:text-stone-100 focus:border-emerald-500 focus:outline-none"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Default: 1,000 Liters</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

