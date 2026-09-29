import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Activity, 
  Sliders 
} from 'lucide-react';
import { analyzeEcgFile } from '../../api/ecg';
import { useECGStore } from '../../store/useECGStore';

export default function ECGUploadModal({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [patientMrn, setPatientMrn] = useState('');
  const [samplingRate, setSamplingRate] = useState(500);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const setActiveRecord = useECGStore((state) => state.setActiveRecord);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (uploadedFile) => {
    const validExtensions = ['.csv', '.npy'];
    const fileName = uploadedFile.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setError('Unsupported file type. Please upload a 12-lead signal array (.csv or .npy).');
      setFile(null);
      return;
    }

    setError('');
    setFile(uploadedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please attach an ECG signal file before proceeding.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await analyzeEcgFile({
        file,
        patientMrn: patientMrn.trim() || undefined,
        samplingRate: Number(samplingRate),
        doctorNotes: doctorNotes.trim(),
      });

      // Update active record in Zustand store
      setActiveRecord(response);
      onClose();
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Clinical inference failed. Verify array dimensions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-clinical-darkest/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-lg w-full bg-clinical-base border border-clinical-panel rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-clinical-panel flex items-center justify-between bg-clinical-panel/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-clinical-panel border border-clinical-accent/30 rounded-lg">
              <Activity className="w-5 h-5 text-clinical-accent" />
            </div>
            <div>
              <h2 className="text-base font-bold text-clinical-light">Ingest 12-Lead ECG</h2>
              <p className="text-xs text-clinical-muted">Clinical signal processing & XAI attribution engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-clinical-muted hover:text-clinical-light hover:bg-clinical-panel transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-clinical-danger/15 border border-clinical-danger/30 rounded-lg flex items-center gap-2.5 text-clinical-danger text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-clinical-accent bg-clinical-accent/10'
                : file
                ? 'border-clinical-accent/60 bg-clinical-panel/40'
                : 'border-clinical-panel hover:border-clinical-accent/50 bg-clinical-panel/20'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.npy"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex flex-col items-center">
                <FileText className="w-10 h-10 text-clinical-accent mb-2" />
                <span className="text-sm font-semibold text-clinical-light truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-clinical-muted mt-1 font-mono">
                  {(file.size / 1024).toFixed(1)} KB • Ready for inference
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-10 h-10 text-clinical-muted mb-2 group-hover:text-clinical-accent transition-colors" />
                <span className="text-sm font-medium text-clinical-light">
                  Click to browse or drag & drop signal file
                </span>
                <span className="text-xs text-clinical-muted mt-1">
                  Supports raw NumPy arrays (.npy) and standard CSVs (.csv)
                </span>
              </div>
            )}
          </div>

          {/* Metadata Parameters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
                Patient MRN (Optional)
              </label>
              <input
                type="text"
                value={patientMrn}
                onChange={(e) => setPatientMrn(e.target.value)}
                placeholder="MRN-90214"
                className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2 px-3 text-xs text-clinical-light placeholder-clinical-muted/50 focus:outline-none focus:border-clinical-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Sampling Rate</span>
                <span className="font-mono text-clinical-accent">{samplingRate} Hz</span>
              </label>
              <select
                value={samplingRate}
                onChange={(e) => setSamplingRate(e.target.value)}
                className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2 px-3 text-xs text-clinical-light focus:outline-none focus:border-clinical-accent"
              >
                <option value={250}>250 Hz (Standard Telemetry)</option>
                <option value={500}>500 Hz (Diagnostic 12-Lead)</option>
                <option value={1000}>1000 Hz (High Resolution)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-clinical-muted uppercase tracking-wider mb-1.5">
              Physician Diagnostic Notes
            </label>
            <textarea
              rows={2}
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="e.g., Patient presented with acute retrosternal chest pain radiating to the jaw..."
              className="w-full bg-clinical-panel/60 border border-clinical-panel rounded-lg py-2 px-3 text-xs text-clinical-light placeholder-clinical-muted/50 focus:outline-none focus:border-clinical-accent resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-clinical-panel">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-clinical-muted hover:text-clinical-light transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !file}
              className="py-2 px-4 bg-clinical-accent hover:bg-clinical-accent/90 disabled:opacity-60 text-clinical-darkest font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  <span>Analyze & Localize</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}