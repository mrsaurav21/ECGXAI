import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function TriageBadge({ severity = 'STABLE' }) {
  const config = {
    CRITICAL: {
      bg: 'bg-clinical-danger/15 border-clinical-danger text-clinical-danger',
      icon: AlertCircle,
      label: 'CRITICAL PRIORITY',
    },
    WARNING: {
      bg: 'bg-clinical-warning/15 border-clinical-warning text-clinical-warning',
      icon: AlertTriangle,
      label: 'CLINICAL ATTENTION',
    },
    STABLE: {
      bg: 'bg-clinical-success/15 border-clinical-success text-clinical-success',
      icon: CheckCircle2,
      label: 'STABLE BASELINE',
    },
  }[severity] || {
    bg: 'bg-clinical-panel border-clinical-accent text-clinical-accent',
    icon: CheckCircle2,
    label: severity,
  };

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold tracking-wide ${config.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </div>
  );
}