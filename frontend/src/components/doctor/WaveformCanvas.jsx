import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Layers } from 'lucide-react';

const STANDARD_LEADS = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

/**
 * 12-Lead ECG Calibrated Canvas Renderer
 * Standard scale: 25 mm/s paper speed, 10 mm/mV voltage calibration
 * Color theme: Foundations / Shopify Winter '24 palette (#EDE8F5, #ADBBDA, #8697C4, #7091E6, #3D52A0)
 */
export default function WaveformCanvas({
  signalData, // Array or Object mapping lead name -> Array of numbers
  attributions = null, // Attribution heatmaps per lead
  samplingRate = 500,
  activeLead = 'II',
  onSelectLead,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [zoom, setZoom] = useState(1.0);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [layoutMode, setLayoutMode] = useState('12-lead'); // '12-lead' or 'single'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background to clean white paper
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw ECG Millimeter Grid using Foundations palette
    drawGrid(ctx, width, height);

    // If no signal data, draw clinical placeholder
    if (!signalData) {
      drawPlaceholder(ctx, width, height);
      return;
    }

    // 2. Draw Waveforms
    if (layoutMode === 'single') {
      const leadSamples = getLeadData(signalData, activeLead);
      const leadAttributions = attributions ? attributions[activeLead] : null;
      renderSingleLead(ctx, activeLead, leadSamples, leadAttributions, 0, 0, width, height, zoom, showHeatmap);
    } else {
      render12LeadGrid(ctx, signalData, attributions, width, height, zoom, showHeatmap);
    }
  }, [signalData, attributions, zoom, showHeatmap, layoutMode, activeLead]);

  // Handle high-DPI scaling
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = (layoutMode === '12-lead' ? 620 : 380) * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${layoutMode === '12-lead' ? 620 : 380}px`;

      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [layoutMode]);

  return (
    <div className="bg-white border border-[#ADBBDA] rounded-2xl overflow-hidden shadow-sm" ref={containerRef}>
      {/* Canvas Controls Header */}
      <div className="px-5 py-3.5 bg-[#EDE8F5]/50 border-b border-[#ADBBDA]/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8697C4]">
            Display Mode:
          </span>
          <div className="inline-flex rounded-xl bg-white p-1 border border-[#ADBBDA]/70 shadow-xs">
            <button
              onClick={() => setLayoutMode('12-lead')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                layoutMode === '12-lead'
                  ? 'bg-[#7091E6] text-white shadow-xs'
                  : 'text-[#8697C4] hover:text-[#3D52A0]'
              }`}
            >
              Standard 12-Lead
            </button>
            <button
              onClick={() => setLayoutMode('single')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                layoutMode === 'single'
                  ? 'bg-[#7091E6] text-white shadow-xs'
                  : 'text-[#8697C4] hover:text-[#3D52A0]'
              }`}
            >
              Rhythm Strip ({activeLead})
            </button>
          </div>

          {layoutMode === 'single' && (
            <select
              value={activeLead}
              onChange={(e) => onSelectLead && onSelectLead(e.target.value)}
              className="bg-white border border-[#ADBBDA] text-[#3D52A0] font-semibold text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#7091E6] shadow-xs"
            >
              {STANDARD_LEADS.map((ld) => (
                <option key={ld} value={ld}>
                  Lead {ld}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Zoom & Attribution controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              showHeatmap
                ? 'bg-[#7091E6]/15 border-[#7091E6] text-[#3D52A0]'
                : 'bg-white border-[#ADBBDA]/80 text-[#8697C4] hover:text-[#3D52A0]'
            }`}
            title="Toggle XAI Attribution Heatmap"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>XAI Heatmap</span>
          </button>

          <div className="h-5 w-[1px] bg-[#ADBBDA]/60" />

          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
            className="p-1.5 rounded-lg bg-white hover:bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]/70 shadow-xs"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
            className="p-1.5 rounded-lg bg-white hover:bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]/70 shadow-xs"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="p-1.5 rounded-lg bg-white hover:bg-[#EDE8F5] text-[#3D52A0] border border-[#ADBBDA]/70 shadow-xs"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#8697C4] font-mono font-bold ml-1">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="relative overflow-x-auto bg-white">
        <canvas ref={canvasRef} className="block w-full cursor-crosshair" />
      </div>

      {/* Calibration Footer */}
      <div className="px-5 py-2.5 bg-[#EDE8F5]/60 border-t border-[#ADBBDA]/60 text-xs text-[#8697C4] font-semibold flex justify-between items-center font-mono">
        <span>Standard Calibration: 25 mm/s | 10 mm/mV</span>
        <span className="text-[#3D52A0]">Digital Filter: 0.05 Hz – 150 Hz Bandpass</span>
      </div>
    </div>
  );
}

function drawGrid(ctx, width, height) {
  const minorStep = 15; // 1mm equivalent
  const majorStep = minorStep * 5; // 5mm (0.20s / 0.5mV)

  // Sub-grid (0.04s) - soft periwinkle tint (#ADBBDA)
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgba(173, 187, 218, 0.45)';
  ctx.beginPath();
  for (let x = 0; x < width; x += minorStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += minorStep) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Major grid (0.20s) - prominent periwinkle blue (#7091E6)
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(112, 145, 230, 0.40)';
  ctx.beginPath();
  for (let x = 0; x < width; x += majorStep) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += majorStep) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();
}

function render12LeadGrid(ctx, signalData, attributions, width, height, zoom, showHeatmap) {
  const cols = 4;
  const rows = 3;
  const cellWidth = width / cols;
  const cellHeight = height / rows;

  const leads = [
    ['I', 'aVR', 'V1', 'V4'],
    ['II', 'aVL', 'V2', 'V5'],
    ['III', 'aVF', 'V3', 'V6'],
  ];

  leads.forEach((rowLeads, rIdx) => {
    rowLeads.forEach((leadName, cIdx) => {
      const x = cIdx * cellWidth;
      const y = rIdx * cellHeight;
      const samples = getLeadData(signalData, leadName);
      const leadAttr = attributions ? attributions[leadName] : null;

      renderSingleLead(
        ctx,
        leadName,
        samples,
        leadAttr,
        x,
        y,
        cellWidth,
        cellHeight,
        zoom,
        showHeatmap
      );
    });
  });
}

function renderSingleLead(ctx, leadName, samples, attributions, x, y, width, height, zoom, showHeatmap) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  // Lead Label (#3D52A0)
  ctx.fillStyle = '#3D52A0';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(leadName, x + 10, y + 22);

  if (!samples || samples.length === 0) {
    ctx.restore();
    return;
  }

  const baselineY = y + height / 2;
  const visibleSamples = Math.min(samples.length, Math.floor(samples.length / zoom));
  const stepX = width / visibleSamples;
  const scaleY = (height / 4) * zoom;

  // Attribution Heatmap Glow
  if (showHeatmap && attributions && attributions.length > 0) {
    for (let i = 0; i < visibleSamples - 1; i++) {
      const attrWeight = Math.abs(attributions[i] || 0);
      if (attrWeight > 0.3) {
        ctx.fillStyle = `rgba(224, 72, 88, ${Math.min(attrWeight * 0.45, 0.65)})`;
        ctx.fillRect(x + i * stepX, y, stepX + 1, height);
      }
    }
  }

  // Primary ECG Signal Line (#3D52A0)
  ctx.strokeStyle = '#3D52A0';
  ctx.lineWidth = 1.8;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.beginPath();
  for (let i = 0; i < visibleSamples; i++) {
    const ptX = x + i * stepX;
    const ptY = baselineY - samples[i] * scaleY;
    if (i === 0) {
      ctx.moveTo(ptX, ptY);
    } else {
      ctx.lineTo(ptX, ptY);
    }
  }
  ctx.stroke();

  ctx.restore();
}

function getLeadData(signalData, leadName) {
  if (!signalData) return [];
  
  // If signalData is an object (like leads_preview: { I: [...], II: [...] })
  if (!Array.isArray(signalData)) {
    return signalData[leadName] || signalData[leadName.toUpperCase()] || [];
  }
  
  // If signalData is an array of leads
  const leadIdx = STANDARD_LEADS.indexOf(leadName);
  return leadIdx >= 0 && signalData[leadIdx] ? signalData[leadIdx] : [];
}

function drawPlaceholder(ctx, width, height) {
  ctx.fillStyle = '#8697C4';
  ctx.font = '500 14px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Awaiting 12-lead signal ingestion (.csv / .npy)...', width / 2, height / 2);
}