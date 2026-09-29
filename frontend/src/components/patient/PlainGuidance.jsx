import React from 'react';
import { ShieldCheck, Heart, AlertCircle, CheckCircle2, PhoneCall, Info } from 'lucide-react';

export default function PlainGuidance({ 
  guidance = null,
  severity = 'warning' // 'normal' | 'warning' | 'critical'
}) {
  const defaultGuidance = {
    headline: 'Front Wall Blood Flow Changes Detected',
    summary:
      'Your latest heart trace (ECG) shows indications of reduced blood flow (known medically as ischemia) in the front wall of your heart. Dr. Sydney Sweeney has reviewed this test and recommends scheduling a clinical check-up to assess your heart health and medications.',
    actionSteps: [
      {
        title: 'Attend Follow-up Appointment',
        description: 'Keep your upcoming consultation with Dr. Sydney Sweeney to evaluate preventative therapy.',
        priority: 'high',
      },
      {
        title: 'Maintain Moderate Pacing',
        description: 'Avoid strenuous high-intensity lifting or vigorous cardio workouts until cleared by cardiology.',
        priority: 'medium',
      },
      {
        title: 'Take Prescribed Medications Reliably',
        description: 'Continue your daily prescriptions as directed. Do not pause any medication without physician guidance.',
        priority: 'high',
      }
    ],
    emergencySigns:
      'If you develop sudden chest tightness, crushing pressure radiating to your jaw or left arm, or severe breathlessness, contact local emergency services immediately.'
  };

  const data = guidance || defaultGuidance;

  return (
    <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#ADBBDA]/40 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#EDE8F5] border border-[#7091E6]/40">
            <Heart className="w-5 h-5 text-[#E04858]" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#3D52A0] uppercase tracking-wider">
              Plain-Language Interpretation
            </h2>
            <span className="text-[11px] text-[#8697C4]">Simplified Clinical Summary</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#E04858]/10 text-[#E04858] border border-[#E04858]/30">
          Action Recommended
        </span>
      </div>

      {/* Narrative Explanation Box */}
      <div className="p-4 bg-gradient-to-br from-[#EDE8F5]/80 to-[#EDE8F5]/30 rounded-2xl border border-[#ADBBDA]/60 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#3D52A0]">
          <ShieldCheck className="w-4 h-4 text-[#7091E6]" />
          <span>{data.headline}</span>
        </div>
        <p className="text-xs text-[#3D52A0]/90 leading-relaxed font-normal">
          {data.summary}
        </p>
      </div>

      {/* Actionable Steps List */}
      <div className="space-y-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#8697C4] flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#7091E6]" />
          <span>Recommended Next Steps</span>
        </h3>

        <div className="space-y-2.5">
          {data.actionSteps.map((step, idx) => (
            <div 
              key={idx}
              className="flex items-start gap-3 p-3 bg-white border border-[#ADBBDA]/60 rounded-xl hover:border-[#7091E6]/60 transition-all text-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-[#2E9F6E] flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#3D52A0] block">{step.title}</span>
                <span className="text-[11px] text-[#8697C4] leading-relaxed mt-0.5 block font-medium">
                  {step.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Warning Strip */}
      <div className="p-3.5 bg-[#E04858]/10 border border-[#E04858]/25 rounded-2xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#E04858] flex-shrink-0 mt-0.5" />
        <div className="text-[11px] text-[#3D52A0]">
          <strong className="text-[#E04858] font-bold">When to seek emergency help: </strong>
          {data.emergencySigns}
        </div>
      </div>
    </div>
  );
}