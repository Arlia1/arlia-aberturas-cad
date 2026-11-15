import React, { useState } from 'react';
import { Download, Copy, Check, Eye, Maximize2, ShieldCheck, Ruler } from 'lucide-react';

export default function CadBlueprintSvg({
  widthCm,
  heightCm,
  typology,
  series,
  glass,
  finish,
  qty = 1
}) {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Dimension scaling logic for SVG canvas (viewBox 440 x 360)
  const maxDim = Math.max(widthCm, heightCm, 100);
  const scale = 250 / maxDim;
  const drawW = Math.max(110, Math.round(widthCm * scale));
  const drawH = Math.max(100, Math.round(heightCm * scale));

  const startX = Math.round((440 - drawW) / 2);
  const startY = Math.round((360 - drawH) / 2) - 8;

  const leavesCount = typology?.leaves || 2;
  const finishColor = finish?.colorHex || '#1F242D';
  const finishStroke = finish?.strokeHex || '#4B5563';

  // Copy specs to clipboard
  const handleCopySpecs = () => {
    const text = [
      `DETALLE DE ABERTURA // ARLIA`,
      `• Modelo: ${typology?.name || 'Ventana'}`,
      `• Medidas: ${widthCm} cm ancho x ${heightCm} cm alto (${widthCm * 10} x ${heightCm * 10} mm)`,
      `• Línea de Perfiles: ${series?.name}`,
      `• Color del Marco: ${finish?.name}`,
      `• Vidrio: ${glass?.name}`,
      `• Cantidad: ${qty} unidad(es)`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Download SVG
  const handleDownloadSvg = () => {
    const svgElem = document.getElementById('arlia-cad-canvas');
    if (!svgElem) return;
    const svgData = new XMLSerializer().serializeToString(svgElem);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `arlia-${typology?.id || 'abertura'}-${widthCm}x${heightCm}cm.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#0B0E14] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl transition-all">
      {/* Top Bar */}
      <div className="px-4 py-3 bg-[#0F141E] border-b border-white/[0.06] flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="font-sans text-xs font-semibold text-zinc-200">
            Vista Previa de tu Abertura
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400 font-sans text-[11px]">
            {finish?.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopySpecs}
            title="Copiar datos de esta ventana"
            className="px-2.5 py-1 text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded text-xs transition-colors flex items-center gap-1 font-sans"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadSvg}
            title="Descargar plano en imagen vectorial"
            className="px-2.5 py-1 text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded text-xs transition-colors flex items-center gap-1 font-sans"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className={`relative p-4 sm:p-6 flex items-center justify-center bg-[#07090C] ${isZoomed ? 'min-h-[460px]' : 'min-h-[340px]'}`}>
        <svg
          id="arlia-cad-canvas"
          viewBox="0 0 440 360"
          className="w-full max-w-[500px] h-auto select-none transition-all duration-300"
        >
          <defs>
            {/* Subtle Drafting Grid */}
            <pattern id="cad-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#141B26" strokeWidth="0.6" />
            </pattern>

            {/* Clear glass reflection */}
            <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.18" />
              <stop offset="45%" stopColor="#0EA5E9" stopOpacity="0.08" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.10" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="440" height="360" fill="url(#cad-grid)" />

          {/* Symmetrical centerline if multi-leaf */}
          {leavesCount > 1 && (
            <line
              x1={startX + drawW / 2}
              y1={startY - 15}
              x2={startX + drawW / 2}
              y2={startY + drawH + 15}
              stroke="#3B82F6"
              strokeWidth="0.8"
              strokeDasharray="6 2 2 2"
              opacity="0.35"
            />
          )}

          {/* Outer Frame (Marco de Aluminio) */}
          <rect
            x={startX}
            y={startY}
            width={drawW}
            height={drawH}
            fill={finishColor}
            stroke={finishStroke}
            strokeWidth="4"
            rx="2"
          />

          {/* Inner Frame Edge */}
          <rect
            x={startX + 5}
            y={startY + 5}
            width={Math.max(10, drawW - 10)}
            height={Math.max(10, drawH - 10)}
            fill="none"
            stroke="#07090C"
            strokeWidth="1.5"
          />

          {/* Glass & Leaves Render */}
          {typology?.id === 'pano_fijo' ? (
            // Paño Fijo
            <g>
              <rect
                x={startX + 8}
                y={startY + 8}
                width={drawW - 16}
                height={drawH - 16}
                fill="url(#glassReflection)"
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeOpacity="0.6"
              />
              <line
                x1={startX + 25}
                y1={startY + drawH - 25}
                x2={startX + drawW - 25}
                y2={startY + 25}
                stroke="#38BDF8"
                strokeWidth="0.8"
                strokeDasharray="14 10"
                opacity="0.35"
              />
            </g>
          ) : typology?.id === 'oscilobatiente' ? (
            // Oscilobatiente
            <g>
              <rect
                x={startX + 8}
                y={startY + 8}
                width={drawW - 16}
                height={drawH - 16}
                fill="url(#glassReflection)"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              <line
                x1={startX + 14}
                y1={startY + 14}
                x2={startX + drawW - 14}
                y2={startY + drawH / 2}
                stroke="#C5A059"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                opacity="0.8"
              />
              <line
                x1={startX + 14}
                y1={startY + drawH - 14}
                x2={startX + drawW - 14}
                y2={startY + drawH / 2}
                stroke="#C5A059"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                opacity="0.8"
              />
              {/* Handle */}
              <rect
                x={startX + drawW - 18}
                y={startY + drawH / 2 - 12}
                width="4"
                height="24"
                fill="#F8FAFC"
                rx="1"
              />
            </g>
          ) : (
            // Corredizas y Puerta Balcón
            Array.from({ length: leavesCount }).map((_, idx) => {
              const leafW = (drawW - 8) / leavesCount;
              const lx = startX + 4 + idx * leafW;
              const isOdd = idx % 2 === 1;

              return (
                <g key={idx}>
                  <rect
                    x={lx + 2}
                    y={startY + 4}
                    width={leafW - 4}
                    height={drawH - 8}
                    fill={finishColor}
                    stroke={finishStroke}
                    strokeWidth="2.5"
                    rx="1"
                  />
                  <rect
                    x={lx + 6}
                    y={startY + 8}
                    width={Math.max(6, leafW - 12)}
                    height={drawH - 16}
                    fill="url(#glassReflection)"
                    stroke="#38BDF8"
                    strokeWidth="1"
                    strokeOpacity="0.6"
                  />
                  {/* Sliding Arrows */}
                  <line
                    x1={lx + 12}
                    y1={startY + drawH / 2}
                    x2={lx + leafW - 12}
                    y2={startY + drawH / 2}
                    stroke="#C5A059"
                    strokeWidth="1.2"
                    opacity="0.8"
                  />
                  {isOdd ? (
                    <polyline
                      points={`${lx + leafW - 18},${startY + drawH / 2 - 4} ${lx + leafW - 12},${startY + drawH / 2} ${lx + leafW - 18},${startY + drawH / 2 + 4}`}
                      fill="none"
                      stroke="#C5A059"
                      strokeWidth="1.2"
                    />
                  ) : (
                    <polyline
                      points={`${lx + 18},${startY + drawH / 2 - 4} ${lx + 12},${startY + drawH / 2} ${lx + 18},${startY + drawH / 2 + 4}`}
                      fill="none"
                      stroke="#C5A059"
                      strokeWidth="1.2"
                    />
                  )}

                  {/* Handle if door */}
                  {typology?.id === 'puerta_balcon' && (
                    <rect
                      x={isOdd ? lx + 10 : lx + leafW - 14}
                      y={startY + drawH / 2 - 25}
                      width="3.5"
                      height="50"
                      fill="#F3F4F6"
                      rx="1"
                      stroke="#111827"
                      strokeWidth="0.5"
                    />
                  )}
                </g>
              );
            })
          )}

          {/* Cota Inferior (Ancho) */}
          <g>
            <line
              x1={startX}
              y1={startY + drawH + 18}
              x2={startX + drawW}
              y2={startY + drawH + 18}
              stroke="#C5A059"
              strokeWidth="1.2"
            />
            <line
              x1={startX - 4}
              y1={startY + drawH + 22}
              x2={startX + 4}
              y2={startY + drawH + 14}
              stroke="#C5A059"
              strokeWidth="1.8"
            />
            <line
              x1={startX + drawW - 4}
              y1={startY + drawH + 22}
              x2={startX + drawW + 4}
              y2={startY + drawH + 14}
              stroke="#C5A059"
              strokeWidth="1.8"
            />
            <text
              x={startX + drawW / 2}
              y={startY + drawH + 34}
              textAnchor="middle"
              fill="#C5A059"
              fontSize="12"
              fontFamily="sans-serif"
              fontWeight="600"
            >
              Ancho: {widthCm} cm ({widthCm * 10} mm)
            </text>
          </g>

          {/* Cota Izquierda (Alto) */}
          <g>
            <line
              x1={startX - 18}
              y1={startY}
              x2={startX - 18}
              y2={startY + drawH}
              stroke="#C5A059"
              strokeWidth="1.2"
            />
            <line
              x1={startX - 22}
              y1={startY + 4}
              x2={startX - 14}
              y2={startY - 4}
              stroke="#C5A059"
              strokeWidth="1.8"
            />
            <line
              x1={startX - 22}
              y1={startY + drawH + 4}
              x2={startX - 14}
              y2={startY + drawH - 4}
              stroke="#C5A059"
              strokeWidth="1.8"
            />
            <text
              x={startX - 28}
              y={startY + drawH / 2}
              textAnchor="middle"
              fill="#C5A059"
              fontSize="12"
              fontFamily="sans-serif"
              fontWeight="600"
              transform={`rotate(-90, ${startX - 28}, ${startY + drawH / 2})`}
            >
              Alto: {heightCm} cm ({heightCm * 10} mm)
            </text>
          </g>
        </svg>

        {/* Zoom trigger */}
        <button
          type="button"
          onClick={() => setIsZoomed(!isZoomed)}
          title="Ampliar vista"
          className="absolute bottom-3 right-3 p-2 bg-black/60 backdrop-blur-md rounded-lg text-zinc-300 hover:text-white border border-white/[0.08]"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2.5 bg-[#0F141E] border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-sans">
        <div className="flex items-center gap-2">
          <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Medidas: <strong className="text-white">{widthCm} x {heightCm} cm</strong></span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Garantía de fábrica {series?.warrantyYears || 10} años</span>
        </div>
      </div>
    </div>
  );
}
