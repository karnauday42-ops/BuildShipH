import React from 'react';
import { UrgencyLevel } from '../../types/index.js';
import { AlertTriangle, Clock, Zap, ShieldCheck } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
  className?: string;
  showIcon?: boolean;
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({
  urgency,
  className = '',
  showIcon = true,
}) => {
  const configs: Record<
    UrgencyLevel,
    { label: string; bg: string; text: string; border: string; icon: any; pulse: boolean }
  > = {
    CRITICAL: {
      label: 'CRITICAL RESCUE',
      bg: 'bg-red-500/10 dark:bg-red-950/40',
      text: 'text-red-700 dark:text-red-400',
      border: 'border-red-500/30',
      icon: Zap,
      pulse: true,
    },
    HIGH: {
      label: 'HIGH URGENCY',
      bg: 'bg-amber-500/10 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-500/30',
      icon: AlertTriangle,
      pulse: false,
    },
    MEDIUM: {
      label: 'MEDIUM URGENCY',
      bg: 'bg-yellow-500/10 dark:bg-yellow-950/40',
      text: 'text-yellow-800 dark:text-yellow-400',
      border: 'border-yellow-500/30',
      icon: Clock,
      pulse: false,
    },
    LOW: {
      label: 'STANDARD RESCUE',
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-500/30',
      icon: ShieldCheck,
      pulse: false,
    },
  };

  const config = configs[urgency] || configs.MEDIUM;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {config.label}
    </span>
  );
};

