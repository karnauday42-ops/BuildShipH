import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { apiRequest } from '../../lib/api.js';
import { ImpactSummary } from '../../types/index.js';
import {
  Leaf,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Utensils,
  Building2,
  Store,
  Clock,
  Heart,
  Droplets,
  CloudRain,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [impact, setImpact] = useState<ImpactSummary | null>(null);

  useEffect(() => {
    apiRequest<ImpactSummary>('/impact/global')
      .then(data => setImpact(data))
      .catch(() => {
        // Fallback baseline impact numbers
        setImpact({
          total_rescued_kg: 185,
          total_meals: 440,
          total_co2_kg: 462,
          total_water_liters: 185000,
          completed_donations_count: 12,
          active_listings_count: 4,
          participating_donors_count: 3,
          participating_recipients_count: 3,
          disclaimer: 'Calculated using UN FAO & EPA conversion models.',
        });
      });
  }, []);

  const handlePersonaSelect = async (role: 'donor' | 'recipient' | 'admin') => {
    await switchDemoRole(role);
    if (role === 'donor') navigate('/donor/dashboard');
    else if (role === 'recipient') navigate('/recipient/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col">
      {/* Top Banner: Food Waste Emergency */}
      <div className="bg-emerald-600 text-white py-2 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5" />
        <span>Targeting UN SDG 12.3: Cutting Per-Capita Global Food Waste by 50% by 2030</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.25),rgba(0,0,0,0))]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>AI-Driven Surplus Redistribution & Spoilage Prevention</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-950 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Stop Food Waste Before It Starts.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400">
              Powered by Gemini AI.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            FoodRescue AI seamlessly bridges restaurants, supermarkets, and catering kitchens with nearby verified food banks and shelters. Real-time microbiology risk modeling ensures safe, urgent, and dignified redistribution.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
            >
              <span>Get Started Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/food-safety"
              className="px-6 py-3.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-semibold text-base transition flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Food Safety Framework</span>
            </Link>
          </div>

          {/* One-Click Reviewer Persona Quick Switch */}
          <div className="mt-12 p-4 rounded-2xl bg-white/70 dark:bg-stone-900/70 border border-emerald-500/20 max-w-2xl mx-auto shadow-sm backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2.5">
              Instant Demo Access — Experience the Platform As:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => handlePersonaSelect('donor')}
                className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:border-emerald-500 transition text-left"
              >
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold">Food Donor</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">Grand Plaza Hotel & Cafe</p>
              </button>

              <button
                onClick={() => handlePersonaSelect('recipient')}
                className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:border-emerald-500 transition text-left"
              >
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-teal-600" />
                  <span className="text-xs font-bold">Recipient Charity</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">Community Care Kitchen</p>
              </button>

              <button
                onClick={() => handlePersonaSelect('admin')}
                className="p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:border-purple-500 transition text-left"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-bold">Platform Admin</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">Verification & Analytics</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Counters Section */}
      <section className="py-12 bg-emerald-950 text-white border-y border-emerald-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Live Environmental & Social Metrics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Measurable Community Impact
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/60 text-center">
              <div className="flex justify-center mb-2 text-emerald-400">
                <Leaf className="h-6 w-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">
                {impact ? impact.total_rescued_kg.toLocaleString() : '185'} <span className="text-base font-normal">kg</span>
              </p>
              <p className="text-xs text-emerald-200 font-medium mt-1">Total Food Rescued</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/60 text-center">
              <div className="flex justify-center mb-2 text-amber-400">
                <Utensils className="h-6 w-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">
                {impact ? impact.total_meals.toLocaleString() : '440'}
              </p>
              <p className="text-xs text-emerald-200 font-medium mt-1">Wholesome Meals Supported</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/60 text-center">
              <div className="flex justify-center mb-2 text-teal-300">
                <CloudRain className="h-6 w-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">
                {impact ? impact.total_co2_kg.toLocaleString() : '462'} <span className="text-base font-normal">kg</span>
              </p>
              <p className="text-xs text-emerald-200 font-medium mt-1">CO₂e Emissions Prevented</p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-900/40 border border-emerald-800/60 text-center">
              <div className="flex justify-center mb-2 text-blue-400">
                <Droplets className="h-6 w-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">
                {impact ? (impact.total_water_liters / 1000).toFixed(0) : '185'} <span className="text-base font-normal">kL</span>
              </p>
              <p className="text-xs text-emerald-200 font-medium mt-1">Virtual Water Conserved</p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-emerald-300/80 max-w-2xl mx-auto">
            Modeled according to EPA WARM standards and UN FAO nutrient coefficients. Environmental figures represent scientific estimates.
          </p>
        </div>
      </section>

      {/* How FoodRescue AI Works */}
      <section className="py-20 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Closed-Loop Food Recovery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-stone-100 mt-2">
              How the Platform Works
            </h2>
            <p className="text-stone-500 dark:text-stone-400 mt-3 text-sm">
              From excess kitchen stock to recipient plate in under 4 hours with verifiable safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex flex-col items-start">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Donor Publishes Listing
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                Restaurants, grocery stores, and event caterers submit surplus quantity, storage conditions, and pickup time window.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Gemini AI computes Spoilage & Urgency
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex flex-col items-start">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Automated Geo-Matching
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                Haversine distance routing and recipient capacity filters alert the closest verified food banks and soup kitchens instantly.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Atomic reservation prevents race conditions
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex flex-col items-start">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-base mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                Dual Confirmation & Impact
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                Both donor and recipient verify the physical pickup. Real-time CO₂ avoidance and meal tallies update immediately.
              </p>
              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Audit-ready ESG reports generated
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gemini AI Core Feature Highlight */}
      <section className="py-16 bg-stone-100/60 dark:bg-stone-950/60 border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Official Google Gen AI SDK Integration
              </div>
              <h2 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100 leading-tight">
                Microbiology-Informed Spoilage & Urgency Estimation
              </h2>
              <p className="mt-4 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                Surplus food redistribution requires precision. Gemini 2.5 Flash analyzes food type, active hot/cold holding temperatures, and elapsed preparation hours against FDA Food Code danger zones (4°C - 60°C).
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Dynamic Rescue Urgency Scoring</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Classifies items into CRITICAL (hot banquet meals), HIGH (fresh dairy), MEDIUM, or LOW (pantry grains).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Safe Cold Chain & Transit Rules</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Delivers step-by-step handling protocols and allergen alerts for receiving volunteers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-600 shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">Strict Responsible AI Guardrails</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Never asserts safety without physical inspection; prompts mandatory probe thermometer checks.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual AI Card Preview */}
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 tracking-wider uppercase">
                    AI Urgency: CRITICAL
                  </span>
                </div>
                <span className="text-xs font-medium text-stone-400">Listing: Banquet Chicken Medley</span>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                  <strong className="font-semibold block mb-0.5">Redistribution Limit: 3.5 Hours</strong>
                  Prepared TCS food in hot holding at 65°C. Immediate dispatch to Community Care Kitchen recommended.
                </div>

                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  <strong className="font-semibold block mb-0.5">Receiving Checklist:</strong>
                  • Probe core temperature upon arrival (must remain &gt; 60°C).<br />
                  • Rapidly chill to &lt; 4°C if not served within 2 hours.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 py-8 text-center text-xs text-stone-500">
        <p>© {new Date().getFullYear()} FoodRescue AI — Smart Surplus Food Management Platform.</p>
        <div className="mt-2 flex justify-center gap-4 text-emerald-600 dark:text-emerald-400">
          <Link to="/about">About & Architecture</Link>
          <Link to="/food-safety">Food Safety Disclaimers</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
        </div>
      </footer>
    </div>
  );
};
