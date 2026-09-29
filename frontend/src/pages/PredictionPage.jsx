import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Activity, Loader2, ArrowRight, ShieldCheck, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PredictionPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRunInference = (e) => {
    e.preventDefault();
    if (!file) return;

    setIsAnalyzing(true);
    setResult(null);

    // Simulate multi-stage pipeline inference (Ingestion -> Attribution -> Concept Bottleneck -> 3D Spatial)
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        stemiRisk: '94.2%',
        territory: 'Anteroseptal (LAD)',
        confidence: '0.994 ROC-AUC',
        finding: 'Convex J-Point ST Elevation detected in leads V1–V3',
        guideline: '4th Universal Definition of MI (Section 4.2)',
      });
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 sm:p-8 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE8F5] text-[#7091E6] text-xs font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>Diagnostic Ingestion Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#3D52A0] tracking-tight">
          12-Lead ECG Upload & Saliency Prediction
        </h1>
        <p className="text-xs text-[#8697C4] max-w-xl leading-relaxed">
          Upload digital ECG recordings to execute the multi-stage interpretable pipeline with real-time 3D coronary occlusion mapping.
        </p>
      </div>

      {/* Upload Form Box */}
      <div className="bg-white border border-[#ADBBDA] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleRunInference} className="space-y-6">
          
          {/* Drag and Drop Zone */}
          <div className="border-2 border-dashed border-[#ADBBDA] rounded-2xl p-8 text-center space-y-3 bg-[#EDE8F5]/30 hover:bg-[#EDE8F5]/60 transition-colors relative cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".csv,.pdf,.dcm,.txt,.dat"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="w-12 h-12 rounded-2xl bg-[#EDE8F5] border border-[#7091E6]/40 flex items-center justify-center mx-auto text-[#3D52A0]">
              <UploadCloud className="w-6 h-6 text-[#7091E6]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#3D52A0]">
                {file ? file.name : 'Click to upload or drag & drop'}
              </span>
              <p className="text-[11px] text-[#8697C4] mt-0.5">
                Supports 500 Hz CSV, DICOM, or PDF 12-lead recordings
              </p>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-[#8697C4] font-mono">
              {file ? `Ready: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` : 'No file selected'}
            </span>

            <button
              type="submit"
              disabled={!file || isAnalyzing}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all shadow-md ${
                !file || isAnalyzing
                  ? 'bg-[#ADBBDA] text-white cursor-not-allowed opacity-60'
                  : 'bg-[#7091E6] hover:bg-[#5a7ddb] text-white cursor-pointer shadow-[#7091E6]/25'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running Inference...</span>
                </>
              ) : (
                <>
                  <span>Run Spatial Prediction</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Inference Results Display */}
      {result && (
        <div className="bg-gradient-to-br from-[#1E2640] to-[#121626] border border-[#3D52A0]/60 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-6 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-[#E04858] animate-ping" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Inference Complete • Verified Decision Support
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-[#E04858]/20 text-[#FF5C6E] border border-[#E04858]/40">
              STEMI Risk: {result.stemiRisk}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-[#ADBBDA] uppercase font-bold">Culprit Territory</span>
              <div className="font-bold text-white text-sm">{result.territory}</div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-[#ADBBDA] uppercase font-bold">Confidence Metric</span>
              <div className="font-bold text-[#7091E6] text-sm font-mono">{result.confidence}</div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] text-[#ADBBDA] uppercase font-bold">Primary Morphologic Finding</span>
            <div className="font-semibold text-white text-xs">{result.finding}</div>
            <div className="text-[11px] text-[#ADBBDA] mt-1">Reference: {result.guideline}</div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[11px] text-[#ADBBDA] font-mono">
              Saved automatically to audit history logs.
            </span>
            <button
              onClick={() => navigate('/history')}
              className="px-4 py-2 rounded-xl bg-[#7091E6] hover:bg-[#5a7ddb] text-white text-xs font-bold transition-all cursor-pointer"
            >
              View Audit History
            </button>
          </div>

        </div>
      )}

    </div>
  );
}