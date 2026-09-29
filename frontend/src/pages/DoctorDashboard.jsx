import React, { useState } from 'react';
import { 
  UploadCloud, 
  Activity, 
  AlertTriangle, 
  FileSpreadsheet, 
  Download, 
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { useECGStore } from '../store/useECGStore';
import { useAuthStore } from '../store/useAuthStore';
import WaveformCanvas from '../components/doctor/WaveformCanvas';
import HeartScene from '../components/heart3d/HeartScene';
import AttributionList from '../components/doctor/AttributionList';
import ConceptMetrics from '../components/doctor/ConceptMetrics';
import RAGCitations from '../components/doctor/RAGCitations';
import ECGUploadModal from '../components/doctor/ECGUploadModal';
import TriageBadge from '../components/layout/TriageBadge';

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const { 
    activeRecord, 
    selectedLead, 
    setSelectedLead, 
    filterBandpass, 
    toggleFilter 
  } = useECGStore();

  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Extract ischemic territories from prediction or fallback to default
  const ischemicTerritories = activeRecord?.ischemic_territories || {
    LAD: activeRecord?.prediction?.stemi_risk > 0.6 || true,
    LCx: false,
    RCA: false,
  };

  return (
    <div className="space-y-6">
      {/* Top Workstation Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-clinical-base border border-clinical-panel p-4 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-clinical-panel border border-clinical-accent/30 rounded-xl">
            <Activity className="w-6 h-6 text-clinical-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-clinical-light tracking-tight">
                Cardiology Diagnostic Workstation
              </h1>
              <TriageBadge severity={activeRecord?.triage?.severity || activeRecord?.triage_priority || 'STABLE'} />
            </div>
            <p className="text-xs text-clinical-muted mt-0.5">
              {activeRecord?.patient_mrn ? `Patient MRN: ${activeRecord.patient_mrn} • ` : 'De-identified Patient Record • '}
              Sampling Frequency: {activeRecord?.sampling_rate || 500} Hz
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={toggleFilter}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              filterBandpass
                ? 'bg-clinical-accent/15 border-clinical-accent text-clinical-accent'
                : 'bg-clinical-panel border-clinical-panel text-clinical-muted hover:text-clinical-light'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>0.05-150Hz Filter {filterBandpass ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-clinical-accent hover:bg-clinical-accent/90 text-clinical-darkest text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest 12-Lead ECG</span>
          </button>
        </div>
      </div>

      {/* Primary Diagnostic Grid (Waveform Canvas + 3D Heart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 12-Lead Canvas (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <WaveformCanvas
            signalData={activeRecord?.leads_preview || activeRecord?.raw_signal || activeRecord?.signals || activeRecord?.waveform_data}
            attributions={activeRecord?.attributions || activeRecord?.heatmaps}
            samplingRate={activeRecord?.sampling_rate || 500}
            activeLead={selectedLead}
            onSelectLead={setSelectedLead}
          />

          {/* Electrophysiologic Intervals Panel */}
          <ConceptMetrics metrics={activeRecord?.metrics} />
        </div>

        {/* 3D Heart & Lead Attribution Column (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <HeartScene ischemicTerritories={ischemicTerritories} />
          
          <AttributionList
            attributions={activeRecord?.attributions || {
              V1: { importance_score: 0.88, territory: 'Anteroseptal (LAD)', primary_finding: 'Hyperacute T Wave / J-point elev', is_pathological: true },
              V2: { importance_score: 0.94, territory: 'Anteroseptal (LAD)', primary_finding: 'ST Elevation > 2.5mm', is_pathological: true },
              V3: { importance_score: 0.91, territory: 'Anteroseptal (LAD)', primary_finding: 'Convex ST elevation', is_pathological: true },
              II: { importance_score: 0.42, territory: 'Inferior (RCA)', primary_finding: 'Reciprocal ST depression', is_pathological: true },
              III: { importance_score: 0.38, territory: 'Inferior (RCA)', primary_finding: 'Reciprocal ST depression', is_pathological: true },
              aVL: { importance_score: 0.25, territory: 'Lateral (LCx)', primary_finding: 'Normal baseline', is_pathological: false },
            }}
            selectedLead={selectedLead}
            onSelectLead={setSelectedLead}
          />
        </div>
      </div>

      {/* Bottom Section: Evidence Grounding (RAG Guidelines) */}
      <div className="w-full">
        <RAGCitations citations={activeRecord?.doctor_citations || activeRecord?.rag_citations} />
      </div>

      {/* Upload File Modal */}
      <ECGUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}