import React from 'react';
import { SpoilageRisk } from '../../types/index.js';

interface SpoilageBadgeProps {
  risk: SpoilageRisk;
  className?: string;
}

export const SpoilageBadge: React.FC<SpoilageBadgeProps> = ({ risk, className = '' }) => {
  const configs: Record<SpoilageRisk, { label: string; bg: string; text: string }> = {
    LOW: {
      label: 'Low Spoilage Risk',
      bg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300',
      text: 'text-emerald-700',
    },
    MODERATE: {
      label: 'Moderate Risk',
      bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300',
      text: 'text-amber-700',
    },
    HIGH: {
      label: 'High Spoilage Risk',
      bg: 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300',
      text: 'text-red-700',
    },
    UNKNOWN: {
      label: 'Unknown Risk',
      bg: 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300',
      text: 'text-stone-600',
    },
  };

  const config = configs[risk] || configs.UNKNOWN;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${className}`}>
      {config.label}
    </span>
  );
};

