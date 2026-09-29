import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  AlertCircle, 
  FileText, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  UserCheck, 
  PhoneCall, 
  TrendingUp, 
  ArrowUpRight,
  Clock
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const [downloading, setDownloading] = useState(false);

  const handlePrint = () => {
    setDownloading(true);
    setTimeout(() => {
      window.print();
      setDownloading(false);
    }, 250);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Patient Hero / Banner Card */}
      <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE8F5] text-[#3D52A0] text-[11px] font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-[#7091E6] animate-pulse" />
              Active Telemetry Sync
            </span>
            <span className="text-[11px] font-mono text-[#8697C4]">
              MRN: {user?.patient_profile?.mrn || 'MRN-884920'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3D52A0] tracking-tight">
            Welcome, {user?.full_name || 'Patient'}
          </h1>
          <p className="text-xs text-[#8697C4] mt-1.5 max-w-xl leading-relaxed">
            Your 12-lead ECG telemetry study was analyzed by AI attribution models and reviewed by attending cardiologist Dr. Sydney Sweeney on September 27, 2026.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handlePrint}
            disabled={downloading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7091E6] hover:bg-[#5e82dc] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Preparing Report...' : 'Download Summary PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Diagnostics & Clinical Action Items (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Diagnostic Translation Card */}
          <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#ADBBDA]/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#E04858]/10 border border-[#E04858]/20">
                  <Heart className="w-5 h-5 text-[#E04858]" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-[#3D52A0] uppercase tracking-wider">
                    Diagnostic Translation
                  </h2>
                  <p className="text-[11px] text-[#8697C4]">12-Lead Myocardial Perfusion Review</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#E04858]/10 text-[#E04858] border border-[#E04858]/30">
                Action Recommended
              </span>
            </div>

            {/* Plain English Translation Highlight */}
            <div className="p-5 bg-gradient-to-br from-[#EDE8F5]/60 to-[#EDE8F5]/30 rounded-2xl border border-[#ADBBDA]/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#3D52A0]">
                <ShieldCheck className="w-4 h-4 text-[#7091E6]" />
                <span>What this means for you:</span>
              </div>
              <p className="text-xs text-[#3D52A0]/90 leading-relaxed">
                Your heart trace shows potential signs of reduced blood flow (known as <strong>ischemia</strong>) across the front wall of your heart (LAD territory). Dr. Sweeney’s team has received this report and flagged it for non-emergent follow-up care and medication adjustment.
              </p>
            </div>

            {/* Care Protocol Next Steps */}
            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8697C4]">
                Next Steps Recommended by Your Care Team
              </span>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3.5 bg-[#EDE8F5]/25 border border-[#ADBBDA]/50 rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 text-[#2E9F6E] flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-[#3D52A0] block">Schedule Follow-up Consultation</span>
                    <span className="text-[#8697C4] text-[11px]">
                      Book a routine clinic visit with Dr. Sydney Sweeney to evaluate current medication and blood pressure metrics.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#EDE8F5]/25 border border-[#ADBBDA]/50 rounded-2xl">
                  <CheckCircle2 className="w-4 h-4 text-[#2E9F6E] flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-[#3D52A0] block">Pacing & Moderate Exertion</span>
                    <span className="text-[#8697C4] text-[11px]">
                      Avoid strenuous endurance activities or heavy lifting until a scheduled stress echocardiogram is performed.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 bg-[#EDE8F5]/25 border border-[#ADBBDA]/50 rounded-2xl">
                  <AlertCircle className="w-4 h-4 text-[#E04858] flex-shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-[#3D52A0] block">Emergency Warning Signs</span>
                    <span className="text-[#8697C4] text-[11px]">
                      If you experience sudden pressure in the chest, pain radiating down your arm, or severe shortness of breath, dial emergency services immediately.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Trend Timeline */}
          <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#7091E6]" />
                <span>Longitudinal Health Records</span>
              </h3>
              <span className="text-[11px] font-mono text-[#8697C4]">3 Studies on File</span>
            </div>

            <div className="divide-y divide-[#ADBBDA]/40 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#3D52A0]">12-Lead ECG Analysis (Latest)</div>
                  <div className="text-[11px] text-[#8697C4]">Sept 27, 2026 • 15:42 IST</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E04858]/10 text-[#E04858] border border-[#E04858]/30">
                  LAD Territory Ischemia
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#3D52A0]">Resting Holter Telemetry</div>
                  <div className="text-[11px] text-[#8697C4]">August 14, 2026 • 09:15 IST</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2E9F6E]/10 text-[#2E9F6E] border border-[#2E9F6E]/30">
                  Normal Sinus Rhythm
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#3D52A0]">Baseline Screening ECG</div>
                  <div className="text-[11px] text-[#8697C4]">May 03, 2026 • 11:20 IST</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2E9F6E]/10 text-[#2E9F6E] border border-[#2E9F6E]/30">
                  Normal Baseline
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Vitals & Care Team (1 col) */}
        <div className="space-y-6">
          
          {/* Key Vitals */}
          <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7091E6]" />
              <span>Current Vitals</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/40">
                <div className="text-[10px] uppercase font-bold text-[#8697C4]">Resting Heart Rate</div>
                <div className="text-2xl font-black font-mono text-[#3D52A0] mt-0.5">
                  78 <span className="text-xs font-semibold text-[#8697C4]">BPM</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/40">
                <div className="text-[10px] uppercase font-bold text-[#8697C4]">Heart Rhythm Pattern</div>
                <div className="text-xs font-bold text-[#3D52A0] mt-1">Normal Sinus Rhythm (NSR)</div>
              </div>

              <div className="p-3.5 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/40">
                <div className="text-[10px] uppercase font-bold text-[#8697C4]">Blood Pressure Estimate</div>
                <div className="text-xs font-bold text-[#3D52A0] mt-1">122 / 82 mmHg</div>
              </div>
            </div>
          </div>

          {/* Attending Care Team Card */}
          <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#7091E6]" />
              <span>Attending Cardiologist</span>
            </h3>

            <div className="p-4 bg-[#EDE8F5]/50 rounded-2xl border border-[#ADBBDA]/60 space-y-3">
              <div>
                <div className="text-sm font-black text-[#3D52A0]">Dr. Sydney Sweeney, MD</div>
                <div className="text-[11px] text-[#7091E6] font-semibold">Interventional Cardiology & XAI Diagnostics</div>
                <div className="text-[10px] text-[#8697C4] mt-0.5">TIMSCDR Advanced Heart Institute</div>
              </div>

              <div className="pt-2 border-t border-[#ADBBDA]/40 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#8697C4]">License / NPI</span>
                <span className="font-mono font-bold text-[#3D52A0]">MED-IND-884920</span>
              </div>
            </div>

            <button 
              onClick={() => alert("Clinic hotline: +91 (022) 2884-0000")}
              className="w-full py-2.5 px-3 bg-[#EDE8F5] hover:bg-[#ADBBDA]/30 border border-[#ADBBDA]/70 rounded-xl text-xs font-bold text-[#3D52A0] transition-all flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#7091E6]" />
              <span>Contact Care Team</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}