import React from 'react';
import { Layers, ArrowUpRight, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';

/**
 * Lead-level & Morphologic Attribution Breakdown
 * Displays neural model feature attributions (Grad-CAM / Integrated Gradients)
 * and correlates them with rule-based electrophysiologic criteria.
 */
export default function AttributionList({
  attributions = {},
  selectedLead = 'II',
  onSelectLead,
}) {
  // Normalize attributions whether passed as an object or an array from backend
  let normalizedAttributions = attributions;

  if (Array.isArray(attributions)) {
    normalizedAttributions = {};
    attributions.forEach((item) => {
      if (item.concept && item.concept.startsWith('st_dev_')) {
        const leadName = item.concept.replace('st_dev_', '');
        const score = Math.abs(item.attribution || item.weight || item.value || 0.1);
        normalizedAttributions[leadName] = {
          importance_score: score > 1 ? 1 : score,
          territory: 'Coronary Territory',
          primary_finding: `ST Deviation: ${item.value?.toFixed(2) || 0} mV`,
          is_pathological: Math.abs(item.value || 0) > 0.1,
        };
      }
    });
  }

  // Sort leads by highest absolute contribution score
  const leadEntries = Object.entries(normalizedAttributions).sort(
    ([, a], [, b]) => (b.importance_score || 0) - (a.importance_score || 0)
  );

  return (
    <div className="bg-clinical-base border border-clinical-panel rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-clinical-panel/40 border-b border-clinical-panel flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-clinical-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-clinical-light">
            XAI Lead Importance Ranking
          </span>
        </div>
        <span className="text-[11px] font-mono text-clinical-muted">
          Attribution: Integrated Gradients
        </span>
      </div>

      {/* Lead Ranking List */}
      <div className="p-3 divide-y divide-clinical-panel/50 overflow-y-auto max-h-[380px]">
        {leadEntries.length === 0 ? (
          <div className="p-6 text-center text-xs text-clinical-muted">
            No attribution data available. Upload an ECG signal to generate importance maps.
          </div>
        ) : (
          leadEntries.map(([leadName, data]) => {
            const isSelected = selectedLead === leadName;
            const score = data.importance_score ?? 0;
            const percentage = Math.round(score * 100);

            return (
              <div
                key={leadName}
                onClick={() => onSelectLead && onSelectLead(leadName)}
                className={`py-2.5 px-3 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-clinical-panel border border-clinical-accent/40 shadow-sm'
                    : 'hover:bg-clinical-panel/40 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-clinical-accent">
                      Lead {leadName}
                    </span>
                    <span className="text-[11px] text-clinical-muted">
                      {data.territory || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-clinical-light">
                      {percentage}%
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-clinical-muted" />
                  </div>
                </div>

                {/* Contribution Progress Bar */}
                <div className="w-full bg-clinical-darkest rounded-full h-1.5 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentage > 60
                        ? 'bg-clinical-danger'
                        : percentage > 30
                        ? 'bg-clinical-accent'
                        : 'bg-slate-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>

                {/* Clinical Concept Correlation */}
                {data.primary_finding && (
                  <div className="flex items-center gap-1.5 text-[11px] text-clinical-muted">
                    {data.is_pathological ? (
                      <AlertTriangle className="w-3 h-3 text-clinical-danger flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-clinical-success flex-shrink-0" />
                    )}
                    <span className="truncate">{data.primary_finding}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Insight */}
      <div className="p-3 bg-clinical-panel/20 border-t border-clinical-panel text-[11px] text-clinical-muted flex items-center justify-between">
        <span>Click a lead to isolate on Rhythm Strip</span>
        <Activity className="w-3.5 h-3.5 text-clinical-accent" />
      </div>
    </div>
  );
}