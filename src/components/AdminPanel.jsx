import React, { useState } from 'react';
import { Settings, RefreshCw, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { resetCatalogToDefault } from '../utils/storage';

export default function AdminPanel({
  seriesList,
  setSeriesList,
  glassList,
  setGlassList,
  finishesList,
  setFinishesList,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('series');
  const [savedNotice, setSavedNotice] = useState(false);
  const [newSeriesName, setNewSeriesName] = useState('');
  const [newSeriesPrice, setNewSeriesPrice] = useState(60000);

  const triggerSaveNotice = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

  const handleSeriesPriceChange = (id, newPrice) => {
    const updated = seriesList.map(s => s.id === id ? { ...s, pricePerMl: Number(newPrice) } : s);
    setSeriesList(updated);
    triggerSaveNotice();
  };

  const handleGlassPriceChange = (id, newPrice) => {
    const updated = glassList.map(g => g.id === id ? { ...g, pricePerM2: Number(newPrice) } : g);
    setGlassList(updated);
    triggerSaveNotice();
  };

  const handleFinishSurchargeChange = (id, newPct) => {
    const updated = finishesList.map(f => f.id === id ? { ...f, surchargePct: Number(newPct) } : f);
    setFinishesList(updated);
    triggerSaveNotice();
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Desea restaurar todos los precios a los valores estándar de fábrica?')) {
      const def = resetCatalogToDefault();
      setSeriesList(def.series);
      setGlassList(def.glasses);
      setFinishesList(def.finishes);
      triggerSaveNotice();
    }
  };

  const handleAddSeries = (e) => {
    e.preventDefault();
    if (!newSeriesName.trim()) return;
    const newId = 'custom_' + Date.now();
    const item = {
      id: newId,
      name: newSeriesName.trim(),
      subtitle: 'Línea de Carpintería Personalizada',
      description: 'Línea creada manualmente en el panel de costos.',
      pricePerMl: Number(newSeriesPrice),
      maxHeightCm: 260,
      maxWidthCm: 320,
      baseDb: 35,
      frameDepthMm: 50,
      thermalBridge: false,
      warrantyYears: 10
    };
    setSeriesList([...seriesList, item]);
    setNewSeriesName('');
    triggerSaveNotice();
  };

  return (
    <div className="bg-[#0B0E14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#C5A059] block">
            ADMINISTRACIÓN // PRECIOS Y COSTOS DE TALLER
          </span>
          <h2 className="font-serif text-2xl font-bold text-white mt-1">
            Modificación de Precios del Cotizador
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Los precios se guardan en el navegador y se actualizan al instante en el cotizador.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Restaurar Precios de Fábrica</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#C5A059] hover:bg-[#b38f4a] text-black font-bold text-xs rounded-lg transition-colors font-sans"
          >
            Volver al Cotizador
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg flex items-center gap-2 text-xs font-sans text-emerald-400 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Precios guardados y aplicados correctamente.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/[0.08] overflow-x-auto gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('series')}
          className={`px-4 py-2 text-xs font-sans border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'series'
              ? 'border-[#C5A059] text-[#C5A059] font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Líneas de Aluminio ({seriesList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('glass')}
          className={`px-4 py-2 text-xs font-sans border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'glass'
              ? 'border-[#C5A059] text-[#C5A059] font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Tipos de Vidrio ({glassList.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('finishes')}
          className={`px-4 py-2 text-xs font-sans border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'finishes'
              ? 'border-[#C5A059] text-[#C5A059] font-bold'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          Colores y Recargos ({finishesList.length})
        </button>
      </div>

      {/* Series */}
      {activeTab === 'series' && (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 text-[11px] uppercase">
                  <th className="py-3 px-3">Línea de Aluminio</th>
                  <th className="py-3 px-3">Altura Máxima</th>
                  <th className="py-3 px-3 text-right">Precio por metro ($/ml)</th>
                  <th className="py-3 px-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {seriesList.map(s => (
                  <tr key={s.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <div className="font-medium text-white">{s.name}</div>
                      <div className="text-[11px] text-zinc-500">{s.subtitle}</div>
                    </td>
                    <td className="py-3 px-3 text-zinc-300 font-mono">
                      {s.maxHeightCm} cm
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-zinc-500">$</span>
                        <input
                          type="number"
                          value={s.pricePerMl}
                          onChange={e => handleSeriesPriceChange(s.id, e.target.value)}
                          className="w-32 bg-zinc-900 border border-zinc-700 focus:border-[#C5A059] rounded px-2.5 py-1 text-right text-[#C5A059] font-bold outline-none font-mono"
                        />
                        <span className="text-zinc-500 text-[10px]">ARS</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {seriesList.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSeriesList(seriesList.filter(item => item.id !== s.id));
                            triggerSaveNotice();
                          }}
                          className="text-zinc-500 hover:text-red-400 p-1"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form onSubmit={handleAddSeries} className="bg-[#10141D] border border-white/[0.06] p-4 rounded-xl flex flex-wrap items-center gap-3 text-xs">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#C5A059]" /> Nueva Línea:
            </span>
            <input
              type="text"
              placeholder="Ej: Aberturas Premium HA 62"
              value={newSeriesName}
              onChange={e => setNewSeriesName(e.target.value)}
              className="flex-1 min-w-[200px] bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-white rounded outline-none focus:border-[#C5A059]"
            />
            <div className="flex items-center gap-1 font-mono">
              <span className="text-zinc-500">$</span>
              <input
                type="number"
                placeholder="Precio"
                value={newSeriesPrice}
                onChange={e => setNewSeriesPrice(e.target.value)}
                className="w-28 bg-zinc-900 border border-zinc-700 px-3 py-1.5 text-white rounded outline-none focus:border-[#C5A059] text-right"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#C5A059] hover:bg-[#b38f4a] text-black font-semibold rounded"
            >
              Agregar
            </button>
          </form>
        </div>
      )}

      {/* Glasses */}
      {activeTab === 'glass' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 text-[11px] uppercase">
                  <th className="py-3 px-3">Tipo de Vidrio</th>
                  <th className="py-3 px-3">Aislación</th>
                  <th className="py-3 px-3 text-right">Precio por metro cuadrado ($/m²)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {glassList.map(g => (
                  <tr key={g.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <div className="font-medium text-white">{g.name}</div>
                      <div className="text-[11px] text-zinc-500">{g.subtitle}</div>
                    </td>
                    <td className="py-3 px-3 text-sky-400 font-semibold">
                      {g.insulationLevel || 'Aislante'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5 font-mono">
                        <span className="text-zinc-500">$</span>
                        <input
                          type="number"
                          value={g.pricePerM2}
                          onChange={e => handleGlassPriceChange(g.id, e.target.value)}
                          className="w-32 bg-zinc-900 border border-zinc-700 focus:border-[#C5A059] rounded px-2.5 py-1 text-right text-[#C5A059] font-bold outline-none"
                        />
                        <span className="text-zinc-500 text-[10px]">ARS</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Finishes */}
      {activeTab === 'finishes' && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-white/[0.08] text-zinc-400 text-[11px] uppercase">
                  <th className="py-3 px-3">Color / Acabado</th>
                  <th className="py-3 px-3">Muestra</th>
                  <th className="py-3 px-3 text-right">Recargo (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {finishesList.map(f => (
                  <tr key={f.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3">
                      <div className="font-medium text-white">{f.name}</div>
                      <div className="text-[11px] text-zinc-500">{f.tag}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 inline-block"
                          style={{ backgroundColor: f.colorHex }}
                        />
                        <span className="text-[11px] text-zinc-400">{f.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5 font-mono">
                        <input
                          type="number"
                          value={f.surchargePct}
                          onChange={e => handleFinishSurchargeChange(f.id, e.target.value)}
                          className="w-20 bg-zinc-900 border border-zinc-700 focus:border-[#C5A059] rounded px-2 py-1 text-right text-[#C5A059] font-bold outline-none"
                        />
                        <span className="text-zinc-400">%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
