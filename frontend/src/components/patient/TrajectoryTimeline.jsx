import React from 'react';
import { Calendar, Clock, Activity, ArrowRight, ChevronRight, FileCheck } from 'lucide-react';

export default function TrajectoryTimeline({ 
  records = [
    {
      id: 'REC-0927',
      date: 'Sept 27, 2026',
      time: '15:42 IST',
      testType: '12-Lead Diagnostic ECG',
      result: 'Anterior Wall Ischemia',
      status: 'Action Recommended',
      statusType: 'danger',
      heartRate: 78,
      leadPhysician: 'Dr. Sydney Sweeney',
    },
    {
      id: 'REC-0814',
      date: 'August 14, 2026',
      time: '09:15 IST',
      testType: 'Resting Holter Screening',
      result: 'Normal Sinus Rhythm',
      status: 'Stable Baseline',
      statusType: 'success',
      heartRate: 72,
      leadPhysician: 'Dr. Sydney Sweeney',
    },
    {
      id: 'REC-0503',
      date: 'May 03, 2026',
      time: '11:20 IST',
      testType: 'Routine Baseline ECG',
      result: 'Normal Cardiac Conduction',
      status: 'Stable Baseline',
      statusType: 'success',
      heartRate: 70,
      leadPhysician: 'Cardiology Triage',
    },
  ],
  onSelectRecord 
}) {
  return (
    <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ADBBDA]/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EDE8F5] border border-[#7091E6]/40">
            <Activity className="w-4 h-4 text-[#3D52A0]" />
          </div>
          <h2 className="text-xs font-black text-[#3D52A0] uppercase tracking-wider">
            Longitudinal Health Trajectory
          </h2>
        </div>
        <span className="text-[11px] font-mono text-[#8697C4]">
          {records.length} Historical Records
        </span>
      </div>

      {/* Timeline Items */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#ADBBDA]/60">
        {records.map((rec, index) => {
          const isDanger = rec.statusType === 'danger';

          return (
            <div key={rec.id || index} className="relative group">
              {/* Timeline Indicator Dot */}
              <div 
                className={`absolute -left-[19px] top-1.5 w-3 h-3 rounded-full border-2 border-white transition-all shadow-xs ${
                  isDanger ? 'bg-[#E04858] ring-4 ring-[#E04858]/20' : 'bg-[#7091E6]'
                }`}
              />

              {/* Record Content Box */}
              <div 
                onClick={() => onSelectRecord && onSelectRecord(rec)}
                className="p-3.5 bg-[#EDE8F5]/30 hover:bg-[#EDE8F5]/60 border border-[#ADBBDA]/50 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#8697C4] font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#7091E6]" />
                      {rec.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#7091E6]" />
                      {rec.time}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#3D52A0]">
                    {rec.testType}
                  </h3>

                  <div className="text-[11px] text-[#8697C4]">
                    Physician: <strong className="text-[#3D52A0]">{rec.leadPhysician}</strong>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#ADBBDA]/40">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      isDanger
                        ? 'bg-[#E04858]/10 text-[#E04858] border-[#E04858]/30'
                        : 'bg-[#2E9F6E]/10 text-[#2E9F6E] border-[#2E9F6E]/30'
                    }`}
                  >
                    {rec.status}
                  </span>

                  <span className="text-[11px] font-mono font-bold text-[#3D52A0]">
                    {rec.heartRate} <span className="text-[10px] text-[#8697C4]">BPM</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}