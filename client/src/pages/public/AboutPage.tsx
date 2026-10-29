import React from 'react';
import { Navbar } from '../../components/layout/Navbar.js';
import { Footer } from '../../components/layout/Footer.js';
import { Leaf, Globe2, ShieldCheck, Heart, Sparkles, Database, CheckCircle2, Award } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
            <Globe2 className="h-3.5 w-3.5" />
            <span>Mission & Impact Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-950 dark:text-white tracking-tight">
            Engineering a Zero-Waste Surplus Food Supply Chain
          </h1>
          <p className="text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            FoodRescue AI transforms the traditional friction-filled donation system into an intelligent, auditable, and rapid redistribution engine.
          </p>
        </div>

        {/* The Problem & The Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
              The Food Waste Tragedy
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              Every day, restaurants, supermarkets, and catering establishments discard high-quality, nutritious meals because conventional coordination is too slow. Traditional manual phone calls and messaging cannot match perishable food within its critical 2-to-4 hour safety window.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-emerald-500/30">
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              The FoodRescue AI Solution
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
              By applying Gemini AI spoilage modeling, Haversine geospatial proximity routing, and atomic quantity reservation, FoodRescue AI matches excess food with nearby kitchens in seconds — with complete temperature and allergen safeguards.
            </p>
          </div>
        </div>

        {/* UN SDG Alignment */}
        <div className="p-8 rounded-3xl bg-emerald-950 text-white space-y-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Award className="h-4 w-4" />
            Global Sustainability Commitment
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Targeting United Nations Sustainable Development Goals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-emerald-900/50 border border-emerald-800">
              <span className="text-2xl font-black text-amber-400">SDG 12.3</span>
              <h4 className="text-base font-bold text-white mt-1">Responsible Consumption & Production</h4>
              <p className="text-xs text-emerald-200 mt-2 leading-relaxed">
                Halve per capita global food waste at the retail and consumer levels and reduce food losses along production and supply chains.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-900/50 border border-emerald-800">
              <span className="text-2xl font-black text-emerald-400">SDG 2</span>
              <h4 className="text-base font-bold text-white mt-1">Zero Hunger</h4>
              <p className="text-xs text-emerald-200 mt-2 leading-relaxed">
                End hunger, achieve food security and improved nutrition, and ensure all people have access to safe, nutritious food all year round.
              </p>
            </div>
          </div>
        </div>

        {/* Environmental Calculation Methodology */}
        <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-600" />
            Impact Metric Scientific Modeling
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
            All environmental and nutritional metrics displayed on FoodRescue AI are computed in real time using standardized conversion factors established by peer-reviewed research and international organizations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800">
              <span className="text-xs font-bold text-stone-500">Meal Calculation</span>
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">2.38 Meals / kg</p>
              <p className="text-[11px] text-stone-400 mt-1">UN FAO standard 420g edible portion reference</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800">
              <span className="text-xs font-bold text-stone-500">Emissions Avoidance</span>
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">2.50 kg CO₂e / kg</p>
              <p className="text-[11px] text-stone-400 mt-1">EPA Waste Reduction Model (WARM) anaerobic landfill factor</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800">
              <span className="text-xs font-bold text-stone-500">Water Conservation</span>
              <p className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">1,000 Liters / kg</p>
              <p className="text-[11px] text-stone-400 mt-1">Water Footprint Network composite agricultural virtual water index</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

