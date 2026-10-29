import React from 'react';
import { AIAdvisory } from '../../types/index.js';
import { UrgencyBadge } from './UrgencyBadge.js';
import { SpoilageBadge } from './SpoilageBadge.js';
import { Sparkles, Clock, Thermometer, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AIAdvisoryCardProps {
  advisory: AIAdvisory;
  compact?: boolean;
}

export const AIAdvisoryCard: React.FC<AIAdvisoryCardProps> = ({ advisory, compact = false }) => {
  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 via-white to-stone-50/30 p-5 dark:from-emerald-950/20 dark:via-stone-900 dark:to-stone-950 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/60 pb-3.5 dark:border-stone-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              Gemini AI Food Advisory
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                Official Model
              </span>
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Confidence: <span className="font-semibold">{advisory.confidence_level}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <UrgencyBadge urgency={advisory.urgency_level} />
          <SpoilageBadge risk={advisory.spoilage_risk} />
        </div>
      </div>

      {/* Recommended Timeframe & Explanation */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Rescue Window</span>
            <p className="text-base font-bold text-stone-900 dark:text-stone-100">
              {advisory.recommended_timeframe_hours} Hours
            </p>
            <p className="text-[11px] text-stone-400">Optimal redistribution limit</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/60 flex items-start gap-3 md:col-span-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Thermometer className="h-4 w-4" />
          </div>
          <div>
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">Storage Guidance</span>
            <p className="text-xs font-medium text-stone-800 dark:text-stone-200 mt-0.5">
              {advisory.storage_recommendations}
            </p>
          </div>
        </div>
      </div>

      {/* Handling Instructions */}
      {!compact && (
        <div className="mt-4 space-y-3">
          <div className="p-3.5 rounded-xl bg-white/80 dark:bg-stone-800/80 border border-stone-200/70 dark:border-stone-700/60">
            <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Safe Redistribution & Handling Guidance
            </span>
            <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
              {advisory.handling_recommendations}
            </p>
          </div>

          {/* Safety Warnings */}
          {advisory.safety_warnings && advisory.safety_warnings.length > 0 && (
            <div className="p-3.5 rounded-xl bg-red-500/5 dark:bg-red-950/20 border border-red-500/20">
              <span className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 shrink-0" />
                Critical Food Safety Guardrails
              </span>
              <ul className="mt-1.5 space-y-1">
                {advisory.safety_warnings.map((w, idx) => (
                  <li key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explanation rationale */}
          {advisory.explanation && (
            <p className="text-xs italic text-stone-500 dark:text-stone-400">
              "{advisory.explanation}"
            </p>
          )}
        </div>
      )}

      {/* Mandatory Responsible AI Notice */}
      <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex items-start gap-2">
        <ShieldAlert className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
          <strong className="font-semibold text-stone-600 dark:text-stone-300">Responsible AI Notice:</strong> This advisory provides heuristic estimation and does not replace official food safety inspection. Never consume or distribute food exhibiting off-odors, discoloration, or damaged packaging.
        </p>
      </div>
    </div>
  );
};

