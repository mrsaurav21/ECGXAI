import React from 'react';
import { Activity, Heart, CheckCircle2, Download } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Import dedicated patient components
import DownloadReportBtn from '../components/patient/DownloadReportBtn';
import PlainGuidance from '../components/patient/PlainGuidance';
import TrajectoryTimeline from '../components/patient/TrajectoryTimeline';

export default function PatientDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Card & Action Bar */}
      <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8697C4]">
            Patient Cardiac Wellness Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#3D52A0] tracking-tight mt-1">
            Hello, {user?.full_name || 'Saurav Singh'}
          </h1>
          <p className="text-xs text-[#8697C4] mt-1.5 max-w-xl leading-relaxed">
            Your latest 12-lead ECG telemetry study was analyzed by AI and verified by Dr. Sydney Sweeney on September 27, 2026.
          </p>
        </div>

        {/* Download Certified Clinical Summary PDF Button */}
        <div className="self-start md:self-auto">
          <DownloadReportBtn patientName={user?.full_name || 'Saurav Singh'} />
        </div>
      </div>

      {/* Main Health Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Spans 2 columns): Diagnostics & History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Plain-Language Interpretation Component */}
          <PlainGuidance />

          {/* Longitudinal Health Trajectory Timeline Component */}
          <TrajectoryTimeline />

        </div>

        {/* Right Column: Vital Readings & Care Team */}
        <div className="space-y-6">
          <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#3D52A0] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7091E6]" />
              <span>Vital Readings</span>
            </h2>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/40">
                <div className="text-[10px] uppercase font-bold text-[#8697C4]">Resting Heart Rate</div>
                <div className="text-2xl font-black font-mono text-[#3D52A0] mt-0.5">
                  78 <span className="text-xs font-semibold text-[#8697C4]">BPM</span>
                </div>
              </div>

              <div className="p-3.5 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/40">
                <div className="text-[10px] uppercase font-bold text-[#8697C4]">Rhythm Pattern</div>
                <div className="text-xs font-bold text-[#3D52A0] mt-1">Regular Sinus Rhythm</div>
              </div>

              <div className="p-3.5 bg-[#EDE8F5]/40 rounded-2xl border border-[#ADBBDA]/40">
                <div className="text-[10px] uppercase font-bold text-[#8697C4]">Verified By</div>
                <div className="text-xs font-bold text-[#7091E6] mt-1">Dr. Sydney Sweeney, MD</div>
                <div className="text-[10px] text-[#8697C4]">TIMSCDR Cardiology Network</div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}