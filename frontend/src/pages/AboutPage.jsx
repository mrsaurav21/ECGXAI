import React from 'react';
import { FileText, ShieldCheck, Cpu, Network, Compass, Activity, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 font-sans">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#ADBBDA] rounded-3xl p-8 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EDE8F5] text-[#7091E6] text-xs font-bold border border-[#ADBBDA]/60">
          <FileText className="w-3.5 h-3.5" />
          <span>Technical Whitepaper & Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-[#3D52A0] tracking-tight">
          About ECGXAI Clinical Intelligence
        </h1>

        <p className="text-sm text-[#8697C4] leading-relaxed max-w-2xl">
          ECGXAI is an interpretable deep learning framework designed to eliminate black-box uncertainty in automated electrocardiography, mapping 12-lead voltage deviations directly to 3D coronary vascular trees.
        </p>
      </div>

      {/* Core Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#ADBBDA] rounded-3xl p-7 shadow-xs space-y-3">
          <div className="p-3 bg-[#EDE8F5] rounded-2xl w-fit text-[#3D52A0] border border-[#7091E6]/30">
            <Cpu className="w-5 h-5 text-[#7091E6]" />
          </div>
          <h3 className="text-base font-bold text-[#3D52A0]">The Interpretable AI Imperative</h3>
          <p className="text-xs text-[#8697C4] leading-relaxed">
            Standard convolutional models output risk scores without clinical rationale. ECGXAI enforces Concept Bottleneck layers and Integrated Gradients so cardiologists can audit the exact electrophysiologic rules driving every prediction.
          </p>
        </div>

        <div className="bg-white border border-[#ADBBDA] rounded-3xl p-7 shadow-xs space-y-3">
          <div className="p-3 bg-[#EDE8F5] rounded-2xl w-fit text-[#3D52A0] border border-[#7091E6]/30">
            <Compass className="w-5 h-5 text-[#2E9F6E]" />
          </div>
          <h3 className="text-base font-bold text-[#3D52A0]">AHA 17-Segment Alignment</h3>
          <p className="text-xs text-[#8697C4] leading-relaxed">
            Attributions from standard leads (V1–V6, I, II, III, aVR, aVL, aVF) project directly onto standardized left-ventricular myocardial segments aligned with the 4th Universal Definition of Myocardial Infarction.
          </p>
        </div>
      </div>

      {/* Pipeline Architecture breakdown */}
      <div className="bg-white border border-[#ADBBDA] rounded-3xl p-8 shadow-xs space-y-6">
        <h2 className="text-lg font-black text-[#3D52A0]">Multi-Stage Pipeline Specification</h2>
        
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-[#EDE8F5]/30 rounded-2xl border border-[#ADBBDA]/60 space-y-1">
            <div className="font-bold text-[#3D52A0] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7091E6]" />
              Stage 1: Signal Ingestion & Conditioning
            </div>
            <p className="text-[#8697C4] pl-4 leading-relaxed">
              Accepts 500 Hz digital ECG recordings, executing 0.05–150 Hz Butterworth bandpass filtering and adaptive polynomial baseline wander suppression.
            </p>
          </div>

          <div className="p-4 bg-[#EDE8F5]/30 rounded-2xl border border-[#ADBBDA]/60 space-y-1">
            <div className="font-bold text-[#3D52A0] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7091E6]" />
              Stage 2: Neural Attribution (Integrated Gradients)
            </div>
            <p className="text-[#8697C4] pl-4 leading-relaxed">
              Computes path integrals of gradients from an isoelectric baseline to isolate precise J-point elevation vectors and hyperacute T-wave morphologies.
            </p>
          </div>

          <div className="p-4 bg-[#EDE8F5]/30 rounded-2xl border border-[#ADBBDA]/60 space-y-1">
            <div className="font-bold text-[#3D52A0] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#7091E6]" />
              Stage 3: Concept Bottleneck & RAG Verification
            </div>
            <p className="text-[#8697C4] pl-4 leading-relaxed">
              Constrains hidden activations through clinical rules (Bazett QTc intervals, reciprocal depressions) and queries FAISS vector databases indexed with ESC/AHA guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#3D52A0] to-[#7091E6] rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-black">Ready to test the diagnostic engine?</h3>
          <p className="text-xs text-[#EDE8F5] opacity-90">Upload a 12-lead ECG recording to generate your first spatial saliency report.</p>
        </div>
        <Link
          to="/predict"
          className="px-6 py-3.5 rounded-2xl bg-white text-[#3D52A0] hover:bg-[#EDE8F5] text-xs font-bold shadow-md transition-all flex items-center gap-2 flex-shrink-0"
        >
          <span>Launch Predictor</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}