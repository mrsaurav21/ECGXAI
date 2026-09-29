import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Layers, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Zap, 
  Cpu, 
  BookOpen, 
  ChevronRight,
  BarChart3,
  Radio,
  Compass,
  Stethoscope,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function HomePage() {
  const { user } = useAuthStore();
  const [selectedLead, setSelectedLead] = useState('V2');

  const getPortalLink = () => {
    if (!user) return '/login';
    return user.role === 'doctor' ? '/doctor' : '/patient';
  };

  const leadData = {
    V1: { stDev: '+0.21 mV', risk: 88, attribution: '0.88', territory: 'Anteroseptal (LAD)', finding: 'Early J-Point Elevation & Hyperacute T', flag: 'CRITICAL' },
    V2: { stDev: '+0.28 mV', risk: 94, attribution: '0.94', territory: 'Anteroseptal (LAD)', finding: 'Convex ST Elevation > 2.5mm (Culprit)', flag: 'CRITICAL' },
    V3: { stDev: '+0.24 mV', risk: 91, attribution: '0.91', territory: 'Anterior Wall (LAD)', finding: 'Tombstone Morphological Distortion', flag: 'CRITICAL' },
    II: { stDev: '-0.14 mV', risk: 45, attribution: '0.45', territory: 'Inferior Wall (RCA)', finding: 'Reciprocal ST Depression Wave', flag: 'WARNING' },
    aVL: { stDev: '+0.04 mV', risk: 12, attribution: '0.12', territory: 'High Lateral (LCx)', finding: 'Stable Isoelectric Baseline', flag: 'STABLE' },
  };

  const current = leadData[selectedLead] || leadData.V2;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-6 pb-20 selection:bg-[#7091E6]/20 font-sans">
      
      {/* ========================================================
          1. HERO SECTION: SLEEK CLINICAL WORKSTATION
      ======================================================== */}
      <section className="relative pt-2">
        {/* Soft Ambient Aurora Glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-80 h-80 bg-[#7091E6]/20 blur-[100px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#ADBBDA]/30 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Hero Narrative (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE8F5] border border-[#ADBBDA]/60 text-[#7091E6] text-xs font-bold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7091E6] animate-pulse" />
              <Activity className="w-3.5 h-3.5" />
              <span>Next-Gen Interpretable Electrocardiography</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#1E2640] tracking-tight leading-[1.08]">
              Clinical AI with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3D52A0] via-[#7091E6] to-[#7091E6]">
                3D Spatial Clarity.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#8697C4] max-w-xl font-normal leading-relaxed">
              Bridge the gap between black-box deep learning and acute cardiology. ECGXAI maps lead-level voltage deviations directly to coronary arterial branches in 3D space, verified against Concept Bottlenecks and AHA/ESC guidelines.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={getPortalLink()}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#7091E6] hover:bg-[#5a7ddb] active:scale-[0.98] text-white text-xs font-bold shadow-md shadow-[#7091E6]/25 transition-all cursor-pointer"
              >
                <Cpu className="w-4 h-4" />
                <span>Enter Diagnostic Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-[#EDE8F5]/60 text-[#3D52A0] text-xs font-bold border border-[#ADBBDA]/70 transition-all shadow-xs cursor-pointer"
              >
                <FileText className="w-4 h-4 text-[#7091E6]" />
                <span>Architecture Whitepaper</span>
              </Link>
            </div>

            {/* Metrics Ribbon */}
            <div className="pt-6 grid grid-cols-4 gap-4 border-t border-[#ADBBDA]/50">
              <div className="flex items-start gap-2">
                <BarChart3 className="w-4 h-4 text-[#7091E6] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-black font-mono text-[#3D52A0]">99.4%</div>
                  <div className="text-[10px] uppercase font-bold text-[#8697C4] tracking-wider">STEMI ROC-AUC</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Heart className="w-4 h-4 text-[#E04858] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-black font-mono text-[#3D52A0]">17-Seg</div>
                  <div className="text-[10px] uppercase font-bold text-[#8697C4] tracking-wider">AHA 3D Anatomy</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-[#7091E6] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-black font-mono text-[#3D52A0]">&lt; 180ms</div>
                  <div className="text-[10px] uppercase font-bold text-[#8697C4] tracking-wider">Inference Speed</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E9F6E] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-lg font-black font-mono text-[#3D52A0]">Guideline</div>
                  <div className="text-[10px] uppercase font-bold text-[#8697C4] tracking-wider">AHA/ESC Aligned</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Glassmorphic Workstation Card (6 cols) */}
          <div className="lg:col-span-6">
            <div className="w-full rounded-3xl bg-white border border-[#ADBBDA]/80 shadow-xl overflow-hidden p-6 space-y-5">
              
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-[#ADBBDA]/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#EDE8F5] text-[#3D52A0] border border-[#7091E6]/30">
                    <Radio className="w-4 h-4 text-[#7091E6] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#3D52A0]">
                      Live Telemetry Workstation
                    </h3>
                    <span className="text-[11px] font-mono text-[#8697C4]">
                      MRN: 884920 • Sampling: 500 Hz • Lead {selectedLead}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-[#E04858]/10 text-[#E04858] border border-[#E04858]/30">
                  Critical STEMI
                </span>
              </div>

              {/* Oscilloscope Waveform Display */}
              <div className="relative rounded-2xl bg-gradient-to-b from-[#1E2640] to-[#121626] border border-[#3D52A0]/40 p-4 overflow-hidden shadow-inner">
                {/* Millivolt Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between mb-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-[#7091E6] text-white">
                      Lead {selectedLead}
                    </span>
                    <span className="text-[11px] font-mono text-[#ADBBDA]">
                      25 mm/s | 10 mm/mV
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#FF5C6E]">
                    ST Elevation: {current.stDev}
                  </span>
                </div>

                {/* Animated ECG Waveform */}
                <svg className="w-full h-24 overflow-visible" viewBox="0 0 600 90" fill="none">
                  {/* Saliency Ischemic Shading */}
                  <rect x="250" y="0" width="125" height="90" fill="#FF334B" fillOpacity="0.18" />
                  <line x1="250" y1="0" x2="250" y2="90" stroke="#FF334B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  <line x1="375" y1="0" x2="375" y2="90" stroke="#FF334B" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                  {/* Cardiac Electrical Curve */}
                  <path
                    d="M0 55 L70 55 Q85 48 95 55 L110 55 L116 63 L126 12 L136 70 L142 55 L160 55 Q180 46 200 55 L240 55 L246 63 L256 8 L268 68 L274 38 Q300 32 330 55 L390 55 L396 63 L406 10 L418 70 L424 38 Q450 32 480 55 L540 55 L546 63 L556 10 L568 70 L574 38 L600 55"
                    stroke="#7091E6"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Baseline isoelectric */}
                  <line x1="0" y1="55" x2="600" y2="55" stroke="#ffffff15" strokeWidth="1" strokeDasharray="3 3" />
                </svg>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#ADBBDA] pt-2 border-t border-white/10">
                  <span>Integrated Gradients Saliency: {current.attribution}</span>
                  <span className="text-[#FF5C6E] font-bold">Transmural Occlusion Triggered</span>
                </div>
              </div>

              {/* Interactive Lead Toggle Selector */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8697C4]">
                  Inspect Attributed Lead Vectors:
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(leadData).map((ld) => {
                    const isSelected = selectedLead === ld;
                    const item = leadData[ld];
                    return (
                      <button
                        key={ld}
                        onClick={() => setSelectedLead(ld)}
                        className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#7091E6] border-[#7091E6] text-white shadow-xs'
                            : 'bg-[#EDE8F5]/40 border-[#ADBBDA]/60 hover:border-[#7091E6]/60 text-[#3D52A0]'
                        }`}
                      >
                        <div className="font-mono text-xs font-black">Lead {ld}</div>
                        <div className={`text-[10px] font-bold font-mono mt-0.5 ${
                          isSelected ? 'text-white' : item.risk > 80 ? 'text-[#E04858]' : 'text-[#7091E6]'
                        }`}>
                          {item.risk}%
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Morphological Attribution Breakdown */}
              <div className="p-3.5 rounded-2xl bg-[#EDE8F5]/40 border border-[#ADBBDA]/60 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-bold text-[#8697C4]">Morphologic Attribution Finding</div>
                  <div className="font-bold text-[#3D52A0]">{current.finding}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-[#8697C4]">Target Territory</div>
                  <div className="font-bold text-[#E04858] font-mono">{current.territory}</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          2. LOWER QUAD FEATURES STRIP
      ======================================================== */}
      <section className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-3xl bg-white border border-[#ADBBDA]/70 shadow-xs hover:border-[#7091E6] transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-[#EDE8F5] text-[#3D52A0]">
                  <Compass className="w-5 h-5 text-[#7091E6]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#8697C4] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-sm font-black text-[#3D52A0]">3D Spatial Projection</h3>
              <p className="text-xs text-[#8697C4] leading-relaxed">
                Map ECG changes directly to coronary arteries and AHA 17-segment territories.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#ADBBDA]/70 shadow-xs hover:border-[#7091E6] transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-[#EDE8F5] text-[#3D52A0]">
                  <Cpu className="w-5 h-5 text-[#7091E6]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#8697C4] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-sm font-black text-[#3D52A0]">Interpretable AI</h3>
              <p className="text-xs text-[#8697C4] leading-relaxed">
                Concept Bottlenecks enforce verified clinical rules before final inference.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#ADBBDA]/70 shadow-xs hover:border-[#7091E6] transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-[#EDE8F5] text-[#3D52A0]">
                  <ShieldCheck className="w-5 h-5 text-[#2E9F6E]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#8697C4] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-sm font-black text-[#3D52A0]">Clinical Validation</h3>
              <p className="text-xs text-[#8697C4] leading-relaxed">
                Validated against AHA, ACC, and ESC 4th Universal Definition of MI guidelines.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#ADBBDA]/70 shadow-xs hover:border-[#7091E6] transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-[#EDE8F5] text-[#3D52A0]">
                  <BookOpen className="w-5 h-5 text-[#7091E6]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[#8697C4] group-hover:translate-x-1 transition-transform" />
              </div>
              <h3 className="text-sm font-black text-[#3D52A0]">Research Ready</h3>
              <p className="text-xs text-[#8697C4] leading-relaxed">
                Trained on over 21,800 records from PTB-XL with reproducible checkpoints.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. PIPELINE ARCHITECTURE (STAGE 01 - STAGE 04)
      ======================================================== */}
      <section className="bg-white border border-[#ADBBDA]/70 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE8F5] text-[#7091E6] text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            <span>End-to-End Clinical Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#3D52A0] tracking-tight">
            From Raw 12-Lead Voltage to Verified Bedside Decisions
          </h2>
          <p className="text-xs text-[#8697C4] leading-relaxed">
            Eliminating black-box uncertainty through a multi-stage interpretable framework that combines high-resolution signal processing, neural attribution, and concept-grounded clinical decision boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="p-5 bg-[#EDE8F5]/30 border border-[#ADBBDA]/50 rounded-2xl space-y-3">
            <span className="font-mono text-xs font-black text-[#7091E6] px-2 py-0.5 rounded-md bg-white border border-[#ADBBDA]/40">
              STAGE 01
            </span>
            <h4 className="text-sm font-bold text-[#3D52A0]">12-Lead Ingestion</h4>
            <p className="text-xs text-[#8697C4] leading-relaxed">
              Diagnostic 500 Hz signals filtered through 0.05–150 Hz bandpass and baseline wander removal.
            </p>
          </div>

          <div className="p-5 bg-[#EDE8F5]/30 border border-[#ADBBDA]/50 rounded-2xl space-y-3">
            <span className="font-mono text-xs font-black text-[#7091E6] px-2 py-0.5 rounded-md bg-white border border-[#ADBBDA]/40">
              STAGE 02
            </span>
            <h4 className="text-sm font-bold text-[#3D52A0]">Attribution Heatmaps</h4>
            <p className="text-xs text-[#8697C4] leading-relaxed">
              Integrated Gradients isolate morphological anomalies (ST elevations, hyperacute T-waves).
            </p>
          </div>

          <div className="p-5 bg-[#EDE8F5]/30 border border-[#ADBBDA]/50 rounded-2xl space-y-3">
            <span className="font-mono text-xs font-black text-[#7091E6] px-2 py-0.5 rounded-md bg-white border border-[#ADBBDA]/40">
              STAGE 03
            </span>
            <h4 className="text-sm font-bold text-[#3D52A0]">Concept Bottlenecks</h4>
            <p className="text-xs text-[#8697C4] leading-relaxed">
              Predictions pass through electrophysiologic rules: Bazett QTc duration, PR interval, and reciprocal ST depression.
            </p>
          </div>

          <div className="p-5 bg-[#EDE8F5]/30 border border-[#ADBBDA]/50 rounded-2xl space-y-3">
            <span className="font-mono text-xs font-black text-[#7091E6] px-2 py-0.5 rounded-md bg-white border border-[#ADBBDA]/40">
              STAGE 04
            </span>
            <h4 className="text-sm font-bold text-[#3D52A0]">Guidelines RAG Grounding</h4>
            <p className="text-xs text-[#8697C4] leading-relaxed">
              Attributions map to AHA 17-segment territories and cross-reference indexed ESC/AHA guidelines.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. 17-SEGMENT AHA TERRITORIAL MODEL MAPPING
      ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE8F5] text-[#7091E6] text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>Standardized Spatial Alignment</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#3D52A0] tracking-tight">
            Anatomical 17-Segment AHA Left-Ventricular Alignment
          </h2>
          <p className="text-xs text-[#8697C4] leading-relaxed">
            Rather than reporting abstract probability scores, ECGXAI projects lead correlations directly to culprit coronary branches—empowering interventional cardiologists to identify lesion locations before catheterization.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 bg-white border border-[#ADBBDA]/70 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E04858]" />
                <span className="text-[#3D52A0] font-bold">Left Anterior Descending (LAD)</span>
              </div>
              <span className="text-[#E04858] font-bold">Anteroseptal (V1–V4)</span>
            </div>

            <div className="p-3.5 bg-white border border-[#ADBBDA]/70 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7091E6]" />
                <span className="text-[#3D52A0] font-bold">Left Circumflex (LCx)</span>
              </div>
              <span className="text-[#7091E6] font-bold">High Lateral (I, aVL, V5, V6)</span>
            </div>

            <div className="p-3.5 bg-white border border-[#ADBBDA]/70 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3D52A0]" />
                <span className="text-[#3D52A0] font-bold">Right Coronary Artery (RCA)</span>
              </div>
              <span className="text-[#3D52A0] font-bold">Inferior Wall (II, III, aVF)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#EDE8F5]/40 border border-[#ADBBDA] rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-sm font-black text-[#3D52A0] uppercase tracking-wider">
            Clinical Diagnostic Metrics
          </h3>
          <p className="text-xs text-[#8697C4] leading-relaxed">
            Evaluated on the PTB-XL multi-center benchmark dataset comprising over 21,800 clinical 12-lead ECG recordings:
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-[#ADBBDA]/50 shadow-xs">
              <div className="text-2xl font-black font-mono text-[#3D52A0]">0.994</div>
              <div className="text-[10px] font-bold text-[#8697C4] uppercase tracking-wider mt-0.5">STEMI ROC-AUC</div>
              <div className="text-[11px] text-[#2E9F6E] mt-1 font-semibold">98.2% Sensitivity</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#ADBBDA]/50 shadow-xs">
              <div className="text-2xl font-black font-mono text-[#7091E6]">0.978</div>
              <div className="text-[10px] font-bold text-[#8697C4] uppercase tracking-wider mt-0.5">NSTEMI ROC-AUC</div>
              <div className="text-[11px] text-[#2E9F6E] mt-1 font-semibold">96.5% Specificity</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#ADBBDA]/50 shadow-xs">
              <div className="text-2xl font-black font-mono text-[#3D52A0]">&lt; 180 ms</div>
              <div className="text-[10px] font-bold text-[#8697C4] uppercase tracking-wider mt-0.5">Inference Latency</div>
              <div className="text-[11px] text-[#8697C4] mt-1">Real-time GPU batch 1</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#ADBBDA]/50 shadow-xs">
              <div className="text-2xl font-black font-mono text-[#7091E6]">FAISS</div>
              <div className="text-[10px] font-bold text-[#8697C4] uppercase tracking-wider mt-0.5">Guideline Vector DB</div>
              <div className="text-[11px] text-[#8697C4] mt-1">AHA / ESC / ACC Indexed</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. ROLE-SPECIFIC WORKSTATION CALLOUTS
      ======================================================== */}
      <section className="bg-white border border-[#ADBBDA]/70 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#ADBBDA]/40 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7091E6]">
              Clinical Workspaces
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#3D52A0] tracking-tight mt-1">
              Purpose-Built Interfaces for Clinicians and Patients
            </h2>
          </div>
          <p className="text-xs text-[#8697C4] max-w-md">
            Delivering deep electrophysiologic metrics and Integrated Gradients rankings for cardiologists, paired with empathetic plain-language translations for patients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Doctor Console Card */}
          <div className="p-6 rounded-2xl bg-[#EDE8F5]/30 border border-[#ADBBDA]/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#3D52A0] text-white">
                  Physician Console
                </span>
                <Stethoscope className="w-5 h-5 text-[#3D52A0]" />
              </div>
              <h3 className="text-base font-bold text-[#3D52A0]">Cardiology Diagnostic Workstation</h3>
              <p className="text-xs text-[#8697C4] leading-relaxed">
                Calibrated 12-lead digital rhythm canvas (25 mm/s, 10 mm/mV), Bazett's QTc formulas, ST elevation deviation metrics, and RAG literature citations.
              </p>
            </div>

            <Link
              to="/doctor"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#7091E6] hover:text-[#3D52A0] transition-colors pt-2 cursor-pointer"
            >
              <span>Launch Doctor Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Patient Console Card */}
          <div className="p-6 rounded-2xl bg-[#EDE8F5]/30 border border-[#ADBBDA]/60 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#7091E6] text-white">
                  Patient Portal
                </span>
                <Heart className="w-5 h-5 text-[#E04858]" />
              </div>
              <h3 className="text-base font-bold text-[#3D52A0]">Patient Cardiac Wellness Portal</h3>
              <p className="text-xs text-[#8697C4] leading-relaxed">
                Plain-language diagnostic summaries, actionable follow-up instructions, longitudinal telemetry timelines, and exportable PDF summaries.
              </p>
            </div>

            <Link
              to="/patient"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#7091E6] hover:text-[#3D52A0] transition-colors pt-2 cursor-pointer"
            >
              <span>View Patient Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}