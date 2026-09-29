import React, { useState } from 'react';
import { Download, FileText, Check, Loader2 } from 'lucide-react';

export default function DownloadReportBtn({ 
  recordId = 'REC-2026-0927-01', 
  patientName = 'Patient',
  className = '' 
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloading(true);

    // Simulate compilation of telemetry & clinical charts before triggering window.print
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      window.print();

      setTimeout(() => setDownloaded(false), 3000);
    }, 700);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#7091E6] hover:bg-[#5a7ddb] active:scale-[0.98] text-white text-xs font-bold shadow-xs transition-all disabled:opacity-60 cursor-pointer ${className}`}
      title="Download Certified Clinical Summary (PDF)"
    >
      {downloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>Generating PDF...</span>
        </>
      ) : downloaded ? (
        <>
          <Check className="w-4 h-4 text-[#EDE8F5]" />
          <span>Ready / Printed</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-[#EDE8F5]" />
          <span>Download Summary PDF</span>
        </>
      )}
    </button>
  );
}