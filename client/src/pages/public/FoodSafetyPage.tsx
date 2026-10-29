import React from 'react';
import { Navbar } from '../../components/layout/Navbar.js';
import { Footer } from '../../components/layout/Footer.js';
import {
  ShieldAlert,
  ShieldCheck,
  Thermometer,
  AlertTriangle,
  Scale,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const FoodSafetyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Official Safety & Legal Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-950 dark:text-white tracking-tight">
            Food Safety & Responsible AI Framework
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            FoodRescue AI operates as a coordination and intelligence platform. Our protocol prioritizes recipient health, strict regulatory compliance, and responsible artificial intelligence.
          </p>
        </div>

        {/* Responsible AI Disclaimer Banner */}
        <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3">
          <div className="flex items-center gap-2 font-bold text-base text-amber-800 dark:text-amber-300">
            <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
            <span>MANDATORY RESPONSIBLE AI DISCLOSURE</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            <strong>FoodRescue AI is not an official food inspection authority.</strong> Gemini AI models generate probabilistic spoilage estimations based on user-entered parameters, time calculations, and USDA/FDA food code heuristics.
          </p>
          <ul className="text-xs space-y-1.5 list-disc pl-5">
            <li>An AI classification of <strong>"LOW RISK"</strong> is never a guarantee that food is safe to consume.</li>
            <li>Physical visual, olfactory, packaging, and temperature inspection by trained personnel is mandatory upon pickup and receipt.</li>
            <li>Food that shows signs of spoilage, abnormal odor, blown packaging, or unmaintained temperature must <strong>NEVER</strong> be redistributed.</li>
          </ul>
        </div>

        {/* Temperature Danger Zone & TCS Protocol */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
          <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-red-500" />
            Temperature Control for Safety (TCS Food Rules)
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            Pathogenic bacteria multiply exponentially between <strong>4°C and 60°C (40°F – 140°F)</strong>, known as the Temperature Danger Zone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
              <span className="text-xs font-bold uppercase text-red-700 dark:text-red-400">Hot Food Redistribution</span>
              <p className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">Keep at or above 60°C (140°F)</p>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Must be transported in insulated thermal carriers. Maximum transit time without active heating: 2 hours.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
              <span className="text-xs font-bold uppercase text-blue-700 dark:text-blue-400">Cold Food Redistribution</span>
              <p className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">Keep at or below 4°C (40°F)</p>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Must be maintained under active refrigeration or ice packs. Never allow dairy or cooked items to warm above 4°C during transit.
              </p>
            </div>
          </div>
        </div>

        {/* Allergen Disclosure & Packaging Integrity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Major Allergen Disclosure
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Donors must explicitly declare the presence of major food allergens:
            </p>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Milk / Dairy', 'Eggs', 'Fish', 'Crustacean Shellfish', 'Tree Nuts', 'Peanuts', 'Wheat / Gluten', 'Soybeans', 'Sesame'].map(a => (
                <span key={a} className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 font-medium">
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Scale className="h-4 w-4 text-emerald-600" />
              Good Samaritan Legal Protections
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              In the United States and comparable jurisdictions (such as the Bill Emerson Good Samaritan Food Donation Act, 42 U.S. Code § 1791), food donors and recipient non-profits are legally shielded from civil and criminal liability when donating wholesome food in good faith.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

