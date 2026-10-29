import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, HeartHandshake, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200 bg-stone-100/60 dark:border-stone-800 dark:bg-stone-950 text-stone-600 dark:text-stone-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <Leaf className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-stone-900 dark:text-stone-100 text-base">
                FoodRescue<span className="text-emerald-600 dark:text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
              Transforming surplus food into community relief through Gemini AI spoilage modeling, automated matching, and verified tracking.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <HeartHandshake className="h-4 w-4" />
              <span>Targeting UN SDG 12.3 & SDG 2</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Platform Features
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  About Platform
                </Link>
              </li>
              <li>
                <Link to="/food-safety" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Food Safety Guidelines
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Donor Portal
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
                  Charity & Kitchen Intake
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Food Safety Safeguards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Food Safety & Standards
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Good Samaritan Act Protected</span>
              </li>
              <li>
                <span className="text-stone-500">TCS Temperature Protocol (4°C - 60°C)</span>
              </li>
              <li>
                <span className="text-stone-500">Allergen Transparency Mandate</span>
              </li>
              <li>
                <span className="text-stone-500">Verified Charity Organizations Only</span>
              </li>
            </ul>
          </div>

          {/* Responsible AI Disclaimer */}
          <div className="p-4 rounded-xl bg-stone-200/50 dark:bg-stone-900/50 border border-stone-200/80 dark:border-stone-800 text-[11px] leading-relaxed">
            <span className="font-semibold text-stone-800 dark:text-stone-200 block mb-1">
              Responsible AI Statement
            </span>
            FoodRescue AI utilizes Google Gemini 2.5 Flash for advisory urgency and spoilage risk modeling. AI estimates are decision support tools and do NOT substitute for mandatory physical inspection and official local health department standards.
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} FoodRescue AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Production Grade v1.0.0</span>
            <span>PostgreSQL & Supabase Backed</span>
            <span>Powered by Google Gen AI SDK</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

