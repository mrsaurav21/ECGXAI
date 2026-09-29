import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import { Activity, Loader2 } from 'lucide-react';
import HeartGeometry from './HeartGeometry';
import LeadTerritoryLegend from './LeadTerritoryLegend';

function ModelLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 p-3 bg-white/90 backdrop-blur-md rounded-xl border border-[#ADBBDA]/70 shadow-sm">
        <Loader2 className="w-5 h-5 animate-spin text-[#7091E6]" />
        <span className="text-[11px] font-mono font-bold text-[#3D52A0] tracking-wide whitespace-nowrap">
          Loading 3D Anatomy...
        </span>
      </div>
    </Html>
  );
}

export default function HeartScene({ 
  ischemicTerritories = { LAD: true, RCA: false, LCx: false } 
}) {
  const [hoveredTerritory, setHoveredTerritory] = useState(null);

  return (
    <div className="bg-white border border-[#ADBBDA] rounded-2xl overflow-hidden shadow-sm flex flex-col h-full min-h-[460px]">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-[#EDE8F5]/50 border-b border-[#ADBBDA]/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white border border-[#ADBBDA]/70 shadow-xs">
            <Activity className="w-4 h-4 text-[#3D52A0]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3D52A0]">
            3D Myocardial Ischemia Localization
          </span>
        </div>
        <span className="text-[11px] font-mono font-semibold text-[#8697C4]">
          Drag to orbit • Scroll to zoom
        </span>
      </div>

      {/* 3D Stage with Soft Radial Lavender Pedestal */}
      <div className="relative flex-1 bg-gradient-to-b from-[#F5F3FA] via-[#EDE8F5] to-[#E2DCED] cursor-grab active:cursor-grabbing min-h-[290px]">
        <Canvas camera={{ position: [0, 0.5, 3.8], fov: 42 }}>
          {/* Studio Key Lights */}
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 8, 5]} intensity={1.6} color="#FFFFFF" />
          <directionalLight position={[-4, 4, -3]} intensity={0.9} color="#ADBBDA" />
          
          {/* Subtle warm ischemic pathology rim fill */}
          <pointLight position={[0, -2, 2]} intensity={0.8} color="#E04858" />

          <Suspense fallback={<ModelLoader />}>
            <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.2}>
              <HeartGeometry
                ischemicTerritories={ischemicTerritories}
                hoveredTerritory={hoveredTerritory}
                setHoveredTerritory={setHoveredTerritory}
              />
            </Float>
          </Suspense>

          <OrbitControls 
            enableZoom={true} 
            minDistance={1.8} 
            maxDistance={5.5} 
            enablePan={false} 
          />
        </Canvas>
      </div>

      {/* HUD & Lead Territory Legend Component */}
      <LeadTerritoryLegend
        ischemicTerritories={ischemicTerritories}
        hoveredTerritory={hoveredTerritory}
        onSelectTerritory={(terr) => setHoveredTerritory(terr === hoveredTerritory ? null : terr)}
      />
    </div>
  );
}