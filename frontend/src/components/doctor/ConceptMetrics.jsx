import React from 'react';
import { Activity, Clock, Zap, Heart, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Electrophysiologic Concept Metrics & Diagnostic Intervals
 * Displays quantitative measurements with clinical normal reference ranges.
 */
export default function ConceptMetrics({ metrics = null }) {
  const defaultMetrics = {
    heart_rate: metrics?.heart_rate ?? 78, // bpm
    pr_interval: metrics?.pr_interval ?? 162, // ms (normal 120-200)
    qrs_duration: metrics?.qrs_duration ?? 94, // ms (normal 80-120)
    qt_interval: metrics?.qt_interval ?? 390, // ms
    qtc_interval: metrics?.qtc_interval ?? 432, // ms (normal < 450 men, < 460 women)
    st_elevation_max: metrics?.st_elevation_max ?? 0.28, // mV (> 0.1mV is clinically significant)
    axis_qrs: metrics?.axis_qrs ?? 45, // degrees (normal -30 to +90)
    rhythm: metrics?.rhythm ?? 'Sinus Rhythm',
  };

  const metricCards = [
    {
      id: 'hr',
      label: 'Heart Rate',
      value: `${defaultMetrics.heart_rate}`,
      unit: 'BPM',
      icon: Heart,
      status: defaultMetrics.heart_rate >= 60 && defaultMetrics.heart_rate <= 100 ? 'normal' : 'abnormal',
      range: '60 – 100 BPM',
    },
    {
      id: 'pr',
      label: 'PR Interval',
      value: `${defaultMetrics.pr_interval}`,
      unit: 'ms',
      icon: Clock,
      status: defaultMetrics.pr_interval >= 120 && defaultMetrics.pr_interval <= 200 ? 'normal' : 'abnormal',
      range: '120 – 200 ms',
    },
    {
      id: 'qrs',
      label: 'QRS Duration',
      value: `${defaultMetrics.qrs_duration}`,
      unit: 'ms',
      icon: Zap,
      status: defaultMetrics.qrs_duration >= 80 && defaultMetrics.qrs_duration <= 120 ? 'normal' : 'abnormal',
      range: '80 – 120 ms',
    },
    {
      id: 'qtc',
      label: 'QTc (Bazett)',
      value: `${defaultMetrics.qtc_interval}`,
      unit: 'ms',
      icon: Clock,
      status: defaultMetrics.qtc_interval <= 450 ? 'normal' : 'abnormal',
      range: '< 450 ms',
    },
    {
      id: 'st',
      label: 'Max ST Deviation',
      value: `${defaultMetrics.st_elevation_max > 0 ? '+' : ''}${defaultMetrics.st_elevation_max}`,
      unit: 'mV',
      icon: Activity,
      status: Math.abs(defaultMetrics.st_elevation_max) < 0.1 ? 'normal' : 'critical',
      range: '< 0.10 mV',
    },
    {
      id: 'axis',
      label: 'Frontal QRS Axis',
      value: `${defaultMetrics.axis_qrs}°`,
      unit: '',
      icon: Zap,
      status: defaultMetrics.axis_qrs >= -30 && defaultMetrics.axis_qrs <= 90 ? 'normal' : 'abnormal',
      range: '-30° to +90°',
    },
  ];

  return (
    <div className="bg-clinical-base border border-clinical-panel rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-clinical-panel/40 border-b border-clinical-panel flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-clinical-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-clinical-light">
            Electrophysiologic Intervals & Metrics
          </span>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-clinical-panel border border-clinical-accent/30 text-clinical-accent">
          {defaultMetrics.rhythm}
        </span>
      </div>

      {/* Grid of Concept Metrics */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metricCards.map((card) => {
          const Icon = card.icon;
          const isCritical = card.status === 'critical';
          const isAbnormal = card.status === 'abnormal';

          return (
            <div
              key={card.id}
              className={`p-3 rounded-lg border transition-all ${
                isCritical
                  ? 'bg-clinical-danger/10 border-clinical-danger/50 text-clinical-danger'
                  : isAbnormal
                  ? 'bg-clinical-warning/10 border-clinical-warning/40 text-clinical-warning'
                  : 'bg-clinical-panel/40 border-clinical-panel text-clinical-light'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-clinical-muted mb-1">
                <span>{card.label}</span>
                {isCritical ? (
                  <AlertCircle className="w-3.5 h-3.5 text-clinical-danger" />
                ) : isAbnormal ? (
                  <AlertCircle className="w-3.5 h-3.5 text-clinical-warning" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-clinical-success" />
                )}
              </div>

              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold font-mono tracking-tight text-clinical-light">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-xs font-mono text-clinical-muted">{card.unit}</span>
                )}
              </div>

              <div className="text-[10px] text-clinical-muted font-mono mt-1.5 pt-1.5 border-t border-clinical-panel/50">
                Ref: {card.range}
              </div>
            </div>
          );
        })}
      </div>

      {/* Clinical Reference Footer */}
      <div className="px-4 py-2.5 bg-clinical-panel/20 border-t border-clinical-panel text-[11px] text-clinical-muted flex items-center justify-between">
        <span>Bazett's formula applied for QTc calibration</span>
        <span className="font-mono text-clinical-accent">1 mm = 0.04s / 0.1mV</span>
      </div>
    </div>
  );
}