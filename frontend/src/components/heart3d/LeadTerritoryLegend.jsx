import React from 'react';

const TERRITORY_INFO = {
  LAD: {
    fullName: 'Left Anterior Descending',
    leads: 'V1, V2, V3, V4',
    wall: 'Anteroseptal Wall',
  },
  LCx: {
    fullName: 'Left Circumflex Artery',
    leads: 'I, aVL, V5, V6',
    wall: 'High & Low Lateral Wall',
  },
  RCA: {
    fullName: 'Right Coronary Artery',
    leads: 'II, III, aVF',
    wall: 'Inferior & RV Wall',
  },
};

export default function LeadTerritoryLegend({ 
  ischemicTerritories = {}, 
  hoveredTerritory, 
  onSelectTerritory 
}) {
  return (
    <div className="bg-white border-t border-[#ADBBDA]/60 p-3.5">
      {/* Territory Badges */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(TERRITORY_INFO).map(([key, info]) => {
          const isIschemic = Boolean(ischemicTerritories[key]);
          const isHovered = hoveredTerritory === key;

          return (
            <button
              key={key}
              onClick={() => onSelectTerritory && onSelectTerritory(key)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isHovered
                  ? 'border-[#7091E6] bg-[#7091E6]/15 shadow-xs'
                  : isIschemic
                  ? 'border-[#E04858]/60 bg-[#E04858]/10'
                  : 'border-[#ADBBDA]/70 bg-[#EDE8F5]/30 hover:bg-[#EDE8F5]/60'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#3D52A0]">{key}</span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isIschemic ? 'bg-[#E04858] ring-4 ring-[#E04858]/20 animate-pulse' : 'bg-[#ADBBDA]'
                  }`}
                />
              </div>
              <div className="text-[10px] text-[#8697C4] truncate font-mono font-medium mt-1">
                Leads: {info.leads}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Territory Detail Callout */}
      {hoveredTerritory && TERRITORY_INFO[hoveredTerritory] && (
        <div className="mt-2.5 p-2.5 bg-[#EDE8F5]/80 rounded-xl border border-[#7091E6]/40 text-xs flex items-center justify-between animate-in fade-in duration-150">
          <div>
            <span className="font-bold text-[#3D52A0] mr-1">
              {TERRITORY_INFO[hoveredTerritory].fullName}:
            </span>
            <span className="text-[#3D52A0]/80">
              {TERRITORY_INFO[hoveredTerritory].wall}
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#8697C4] font-semibold">
            {TERRITORY_INFO[hoveredTerritory].leads}
          </span>
        </div>
      )}
    </div>
  );
}