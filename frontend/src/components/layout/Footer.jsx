import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Mail, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#ADBBDA]/60 pt-12 pb-8 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Description (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="p-2 bg-[#EDE8F5] border border-[#7091E6]/40 rounded-xl">
                <Activity className="w-5 h-5 text-[#3D52A0]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#3D52A0]">
                ECG<span className="text-[#7091E6]">-XAI</span>
              </span>
            </Link>

            <p className="text-xs text-[#8697C4] max-w-sm leading-relaxed">
              An explainable deep learning decision-support framework bridging black-box neural networks and acute cardiology through 3D coronary occlusion mapping and RAG literature grounding.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#2E9F6E] font-medium bg-[#2E9F6E]/10 border border-[#2E9F6E]/30 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>AHA / ESC 4th Universal Definition Aligned</span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D52A0]">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#8697C4]">
              <li>
                <Link to="/" className="hover:text-[#3D52A0] transition-colors">Home Workstation</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#3D52A0] transition-colors">Architecture Whitepaper</Link>
              </li>
              <li>
                <Link to="/predict" className="hover:text-[#3D52A0] transition-colors">ECG Ingestion & Prediction</Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-[#3D52A0] transition-colors">Audit History Logs</Link>
              </li>
            </ul>
          </div>

          {/* Clinical Disclaimers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D52A0]">
              Regulatory Notice
            </h4>
            <p className="text-[11px] text-[#8697C4] leading-relaxed">
              ECGXAI is engineered strictly as an assistive clinical decision-support tool. It does not replace the professional diagnostic evaluation of a licensed cardiologist.
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Socials */}
        <div className="border-t border-[#ADBBDA]/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8697C4]">
          <div>
            © {new Date().getFullYear()} ECGXAI Clinical Intelligence Framework. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#3D52A0] transition-colors flex items-center gap-1">
              <span>Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <span className="text-[#ADBBDA]">•</span>
            <span className="font-mono text-[11px]">v2.4-STABLE</span>
          </div>
        </div>

      </div>
    </footer>
  );
}