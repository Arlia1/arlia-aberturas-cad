import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Compass,
  ShoppingCart,
  Plus,
  Trash2,
  ArrowUpRight,
  Settings,
  Ruler,
  CheckCircle2,
  ShieldCheck,
  Sun,
  Volume2,
  Clock,
  Sparkles,
  Phone
} from 'lucide-react';
import {
  INITIAL_SERIES,
  INITIAL_GLASSES,
  FINISHES,
  TYPOLOGIES,
  PRESETS
} from './data/carpentryCatalog';
import CadBlueprintSvg from './components/CadBlueprintSvg';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import AdminPanel from './components/AdminPanel';
import {
  buildCartWhatsAppUrl,
  buildSingleVanoWhatsAppUrl,
  FACTORY_DISPLAY_PHONE
} from './services/whatsapp.service';
import {
  getStoredSeries,
  saveStoredSeries,
  getStoredGlasses,
  saveStoredGlasses,
  getStoredFinishes,
  saveStoredFinishes,
  getStoredPliego,
  saveStoredPliego
} from './utils/storage';

export default function App() {
  // Catalogs loaded from local persistence
  const [seriesList, setSeriesList] = useState(getStoredSeries);
  const [glassList, setGlassList] = useState(getStoredGlasses);
  const [finishesList, setFinishesList] = useState(getStoredFinishes);

  useEffect(() => {
    saveStoredSeries(seriesList);
  }, [seriesList]);

  useEffect(() => {
    saveStoredGlasses(glassList);
  }, [glassList]);

  useEffect(() => {
    saveStoredFinishes(finishesList);
  }, [finishesList]);

  // Main UI Navigation Tab: 'configurator' | 'cart' | 'admin'
  const [activeTab, setActiveTab] = useState('configurator');

  // Parametric Configuration State
  const [typologyId, setTypologyId] = useState('corrediza_2h');
  const [widthCm, setWidthCm] = useState(150);
  const [heightCm, setHeightCm] = useState(120);
  const [seriesId, setSeriesId] = useState('modena');
  const [glassId, setGlassId] = useState('dvh_std');
  const [finishId, setFinishId] = useState('negro');
  const [qty, setQty] = useState(1);
  const [customTag, setCustomTag] = useState('Ventana Dormitorio');

  // Shopping Cart State (Stored in localStorage)
  const [cart, setCart] = useState(getStoredPliego);
  const [clientInfo, setClientInfo] = useState({ clientName: '', location: '' });
  const [cartNotice, setCartNotice] = useState(false);

  useEffect(() => {
    saveStoredPliego(cart);
  }, [cart]);

  // Ref to scroll to configurator
  const configuratorRef = useRef(null);
  const scrollToConfigurator = () => {
    setActiveTab('configurator');
    if (configuratorRef.current) {
      configuratorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Active Typology Object
  const currentTypology = useMemo(() => {
    return TYPOLOGIES.find(t => t.id === typologyId) || TYPOLOGIES[0];
  }, [typologyId]);

  // Real-time Cost & Plain Spec Calculator
  const calc = useMemo(() => {
    const serie = seriesList.find(s => s.id === seriesId) || seriesList[0];
    const glass = glassList.find(g => g.id === glassId) || glassList[0];
    const finish = finishesList.find(f => f.id === finishId) || finishesList[0];

    const areaM2 = (widthCm / 100) * (heightCm / 100);
    const leaves = currentTypology.leaves;

    // Linear meters of aluminum perimeter + intermediate sashes
    const perimeterMl = ((widthCm + heightCm) * 2) / 100 + leaves * (heightCm / 100);

    // Pricing calculation
    const aluminumCost = perimeterMl * serie.pricePerMl * (1 + finish.surchargePct / 100);
    const glassCost = areaM2 * glass.pricePerM2;
    const unitPrice = Math.round(aluminumCost + glassCost);
    const subtotal = unitPrice * qty;

    // Friendly insulation badges
    const thermalText = glass.insulationLevel || 'Aislante Térmico';
    const noiseText = glass.acousticText || `Atenuación -${serie.baseDb} dB`;

    return {
      serie,
      glass,
      finish,
      areaM2: Number(areaM2.toFixed(2)),
      perimeterMl: Number(perimeterMl.toFixed(2)),
      unitPrice,
      subtotal,
      thermalText,
      noiseText
    };
  }, [widthCm, heightCm, currentTypology, seriesId, glassId, finishId, qty, seriesList, glassList, finishesList]);

  // Preset Selector
  const applyPreset = (preset) => {
    setWidthCm(preset.widthCm);
    setHeightCm(preset.heightCm);
    if (preset.typologyId) setTypologyId(preset.typologyId);
    if (preset.seriesId && seriesList.some(s => s.id === preset.seriesId)) {
      setSeriesId(preset.seriesId);
    }
    if (preset.glassId && glassList.some(g => g.id === preset.glassId)) {
      setGlassId(preset.glassId);
    }
    if (preset.finishId && finishesList.some(f => f.id === preset.finishId)) {
      setFinishId(preset.finishId);
    }
    setCustomTag(preset.name);
  };

  // Add Item to Cart
  const handleAddToCart = () => {
    const newItem = {
      id: 'item-' + Date.now(),
      tag: customTag || `Abertura #${cart.length + 1}`,
      typologyId: currentTypology.id,
      typologyName: currentTypology.name,
      widthCm,
      heightCm,
      leaves: currentTypology.leaves,
      seriesId: calc.serie.id,
      seriesName: calc.serie.name,
      glassId: calc.glass.id,
      glassName: calc.glass.name,
      finishId: calc.finish.id,
      finishName: calc.finish.name,
      areaM2: calc.areaM2,
      unitPrice: calc.unitPrice,
      qty,
      subtotal: calc.subtotal
    };

    setCart([...cart, newItem]);
    setCartNotice(true);
    setTimeout(() => setCartNotice(false), 2400);

    // Increment tag for next item
    const nextNum = cart.length + 2;
    setCustomTag(`Ventana #${nextNum}`);
  };

  // Remove Item from Cart
  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // Grand Total of Cart
  const grandTotal = cart.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div className="min-h-screen bg-[#07090C] text-zinc-100 font-sans selection:bg-[#C5A059]/30">
      {/* Top Navbar */}
      <header className="border-b border-white/[0.08] bg-[#0A0D12]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Clean Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('configurator')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1B212D] to-[#0A0D12] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-white leading-none">
                ARLIA
              </span>
              <span className="text-[11px] text-zinc-400 font-sans ml-2 hidden sm:inline">
                Aberturas & Vidrios
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('configurator')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-sans transition-all flex items-center gap-1.5 ${
                activeTab === 'configurator'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>Cotizador</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className={`relative px-3 sm:px-4 py-2 rounded-lg text-xs font-sans transition-all flex items-center gap-1.5 ${
                activeTab === 'cart'
                  ? 'bg-[#C5A059] text-black font-bold'
                  : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Carrito</span>
              {cart.length > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'cart' ? 'bg-black text-[#C5A059]' : 'bg-[#C5A059] text-black'
                }`}>
                  {cart.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'admin' ? 'configurator' : 'admin')}
              className={`px-2.5 sm:px-3 py-2 rounded-lg text-xs font-mono transition-all border ${
                activeTab === 'admin'
                  ? 'bg-white text-black font-bold border-white'
                  : 'border-white/[0.1] text-zinc-400 hover:text-white'
              }`}
              title="Panel de Precios / Admin"
            >
              <Settings className="w-3.5 h-3.5 inline sm:mr-1" />
              <span className="hidden sm:inline">/admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* PRESENTACIÓN CON CTA AL INICIO */}
        {activeTab === 'configurator' && (
          <section className="bg-gradient-to-b from-[#111622] to-[#0A0D12] border border-white/[0.08] rounded-2xl p-6 sm:p-10 text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 bg-[#C5A059]/10 border border-[#C5A059]/30 px-3 py-1 rounded-full text-xs text-[#C5A059] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fábrica Directa • Calidad Aluar & Doble Vidrio</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight">
              Aberturas de aluminio a medida para tu casa o proyecto
            </h1>

            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto font-sans leading-relaxed">
              Elegí el modelo de ventana o puerta balcón, ingresá las medidas exactas y obtené
              tu presupuesto estimado al instante con opción de envío directo a WhatsApp.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={scrollToConfigurator}
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#b38f4a] text-black font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <Ruler className="w-4 h-4" />
                <span>Diseñar mi Abertura</span>
              </button>

              <a
                href={buildSingleVanoWhatsAppUrl(calc, widthCm, heightCm, currentTypology.name, qty, customTag)}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-[#141B26] hover:bg-[#1C2536] text-white border border-white/[0.12] font-semibold text-sm rounded-xl transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#25D366]" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/[0.06] text-xs text-zinc-400 font-sans max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fabricación a medida exacta</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                <span>Garantía de fábrica hasta 15 años</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Entrega en 15 a 20 días hábiles</span>
              </div>
            </div>
          </section>
        )}

        {/* Admin Tab View */}
        {activeTab === 'admin' && (
          <AdminPanel
            seriesList={seriesList}
            setSeriesList={setSeriesList}
            glassList={glassList}
            setGlassList={setGlassList}
            finishesList={finishesList}
            setFinishesList={setFinishesList}
            onClose={() => setActiveTab('configurator')}
          />
        )}

        {/* Carrito Tab View */}
        {activeTab === 'cart' && (
          <div className="bg-[#0B0E14] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#C5A059] block">
                  TU PEDIDO DE ABERTURAS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                  Carrito de Compras ({cart.length} aberturas)
                </h2>
                <p className="text-xs text-zinc-400 font-sans mt-0.5">
                  Podés agregar todas las ventanas de tu casa y enviar el pedido completo a nuestro WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('configurator')}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-sans rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Agregar Otra Abertura</span>
                </button>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('¿Desea vaciar todas las aberturas del carrito?')) {
                        setCart([]);
                      }
                    }}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs rounded-lg transition-colors"
                  >
                    Vaciar Carrito
                  </button>
                )}
              </div>
            </div>

            {/* Client Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#0E131C] rounded-xl border border-white/[0.06] text-xs font-sans">
              <div>
                <label className="text-zinc-400 block mb-1">Tu Nombre o Estudio:</label>
                <input
                  type="text"
                  placeholder="Ej: Marcelo Arlia"
                  value={clientInfo.clientName}
                  onChange={e => setClientInfo({ ...clientInfo, clientName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#C5A059] rounded px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Localidad o Barrio de entrega:</label>
                <input
                  type="text"
                  placeholder="Ej: Tigre, Nordelta, San Isidro..."
                  value={clientInfo.location}
                  onChange={e => setClientInfo({ ...clientInfo, location: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#C5A059] rounded px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            {/* Cart Items Table */}
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4 border border-dashed border-white/[0.1] rounded-xl">
                <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto text-zinc-500">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">El carrito está vacío</h3>
                  <p className="text-xs text-zinc-400 mt-1">Configurá una abertura en el cotizador y presioná "Agregar al Carrito".</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('configurator')}
                  className="px-5 py-2.5 bg-[#C5A059] text-black font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Ruler className="w-4 h-4" /> Ir al Cotizador
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="border-b border-white/[0.08] text-zinc-400 text-[11px] uppercase">
                        <th className="py-3 px-3">Abertura</th>
                        <th className="py-3 px-3">Medidas</th>
                        <th className="py-3 px-3">Línea & Color</th>
                        <th className="py-3 px-3">Vidrio</th>
                        <th className="py-3 px-3 text-center">Cant.</th>
                        <th className="py-3 px-3 text-right">Subtotal</th>
                        <th className="py-3 px-3 text-center">Eliminar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {cart.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 px-3">
                            <span className="font-bold text-white block">{item.tag}</span>
                            <span className="text-[11px] text-zinc-400">{item.typologyName}</span>
                          </td>
                          <td className="py-3 px-3 font-mono">
                            <span className="text-zinc-200">{item.widthCm} x {item.heightCm} cm</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-zinc-200 block">{item.seriesName}</span>
                            <span className="text-[11px] text-[#C5A059]">{item.finishName}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-sky-300 block">{item.glassName}</span>
                          </td>
                          <td className="py-3 px-3 text-center text-zinc-200 font-bold">
                            x{item.qty}
                          </td>
                          <td className="py-3 px-3 text-right text-[#C5A059] font-bold text-sm font-mono">
                            ${item.subtotal.toLocaleString('es-AR')}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors"
                              title="Eliminar del carrito"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cart Grand Summary Bar */}
                <div className="bg-[#10141D] border border-[#C5A059]/40 p-6 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-zinc-400 block font-sans">
                      TOTAL ESTIMADO ({cart.length} aberturas):
                    </span>
                    <span className="font-mono text-3xl font-bold text-[#C5A059] tabular-nums block mt-0.5">
                      ${grandTotal.toLocaleString('es-AR')} ARS
                    </span>
                    <span className="text-[11px] text-zinc-500 block">
                      Valores con entrega y fabricación estimada en 15 a 20 días hábiles.
                    </span>
                  </div>

                  <a
                    href={buildCartWhatsAppUrl(cart, grandTotal, clientInfo)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full md:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <span>Pedir Presupuesto por WhatsApp</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Configurator Tab View */}
        {activeTab === 'configurator' && (
          <div ref={configuratorRef} className="space-y-6">
            {/* Quick Presets Bar */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs text-zinc-400 font-sans mr-1">
                Modelos Rápidos:
              </span>
              {PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 bg-[#10141E] hover:bg-[#18202F] border border-white/[0.08] hover:border-[#C5A059]/50 text-zinc-300 hover:text-white rounded-lg text-xs font-sans transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Added to Cart Toast Notification */}
            {cartNotice && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-sans text-emerald-400 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>¡Abertura agregada al carrito con éxito! ({cart.length} aberturas en total).</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('cart')}
                  className="px-3 py-1 bg-emerald-500 text-black font-bold rounded hover:bg-emerald-400 transition-colors"
                >
                  Ver Carrito
                </button>
              </div>
            )}

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Easy Customization Controls (5 cols) */}
              <div className="lg:col-span-5 bg-[#0B0E14] border border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
                {/* 1. Identification Tag */}
                <div>
                  <label className="block text-xs font-bold text-zinc-200 mb-1.5 font-sans">
                    1. Nombre de la Abertura
                  </label>
                  <input
                    type="text"
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    placeholder="Ej: Ventana Dormitorio Principal"
                    className="w-full bg-[#0F141E] border border-white/[0.1] focus:border-[#C5A059] rounded-lg px-3.5 py-2 text-xs text-white outline-none transition-colors"
                  />
                </div>

                {/* 2. Typology Selector */}
                <div>
                  <label className="block text-xs font-bold text-zinc-200 mb-1.5 font-sans">
                    2. Modelo de Ventana o Puerta
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TYPOLOGIES.map(t => {
                      const isSelected = t.id === typologyId;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTypologyId(t.id)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            isSelected
                              ? 'bg-[#18202F] border-[#C5A059] text-white shadow-md'
                              : 'bg-[#0E131C] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15]'
                          }`}
                        >
                          <span className="text-xs font-semibold block leading-tight">
                            {t.name}
                          </span>
                          <span className="text-[11px] text-zinc-500 block mt-0.5">
                            {t.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Dimensions Controls */}
                <div className="space-y-4 pt-2 border-t border-white/[0.06]">
                  <label className="block text-xs font-bold text-zinc-200 font-sans">
                    3. Medidas en Centímetros
                  </label>

                  {/* Width */}
                  <div className="bg-[#0E131C] p-3.5 rounded-xl border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium">Ancho:</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="number"
                          min="60"
                          max="450"
                          step="5"
                          value={widthCm}
                          onChange={e => setWidthCm(Number(e.target.value))}
                          className="w-16 bg-black/50 border border-zinc-700 px-2 py-0.5 text-right text-white font-bold rounded"
                        />
                        <span className="text-zinc-400">cm</span>
                        <span className="text-zinc-500 text-[11px]">({widthCm * 10} mm)</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="450"
                      step="5"
                      value={widthCm}
                      onChange={e => setWidthCm(Number(e.target.value))}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>

                  {/* Height */}
                  <div className="bg-[#0E131C] p-3.5 rounded-xl border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-300 font-medium">Alto:</span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <input
                          type="number"
                          min="60"
                          max="360"
                          step="5"
                          value={heightCm}
                          onChange={e => setHeightCm(Number(e.target.value))}
                          className="w-16 bg-black/50 border border-zinc-700 px-2 py-0.5 text-right text-white font-bold rounded"
                        />
                        <span className="text-zinc-400">cm</span>
                        <span className="text-zinc-500 text-[11px]">({heightCm * 10} mm)</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="360"
                      step="5"
                      value={heightCm}
                      onChange={e => setHeightCm(Number(e.target.value))}
                      className="w-full accent-[#C5A059] cursor-pointer"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center justify-between bg-[#0E131C] p-3 rounded-xl border border-white/[0.06] text-xs">
                    <span className="text-zinc-300 font-medium">Cantidad de ventanas iguales:</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-8 h-8 bg-zinc-800 text-white rounded font-bold hover:bg-zinc-700"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-white font-bold text-sm font-mono">{qty}</span>
                      <button
                        type="button"
                        onClick={() => setQty(qty + 1)}
                        className="w-8 h-8 bg-zinc-800 text-white rounded font-bold hover:bg-zinc-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4. Series */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <label className="block text-xs font-bold text-zinc-200 font-sans">
                    4. Línea de Aluminio
                  </label>
                  <select
                    value={seriesId}
                    onChange={e => setSeriesId(e.target.value)}
                    className="w-full bg-[#0F141E] border border-white/[0.1] focus:border-[#C5A059] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    {seriesList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.subtitle})
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-zinc-400 leading-normal pl-1">
                    {calc.serie?.description}
                  </p>
                </div>

                {/* 5. Glass */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <label className="block text-xs font-bold text-zinc-200 font-sans">
                    5. Tipo de Vidrio
                  </label>
                  <select
                    value={glassId}
                    onChange={e => setGlassId(e.target.value)}
                    className="w-full bg-[#0F141E] border border-white/[0.1] focus:border-[#C5A059] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    {glassList.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-zinc-400 leading-normal pl-1">
                    {calc.glass?.description}
                  </p>
                </div>

                {/* 6. Color */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <label className="block text-xs font-bold text-zinc-200 font-sans">
                    6. Color del Marco de Aluminio
                  </label>
                  <select
                    value={finishId}
                    onChange={e => setFinishId(e.target.value)}
                    className="w-full bg-[#0F141E] border border-white/[0.1] focus:border-[#C5A059] rounded-lg px-3.5 py-2.5 text-xs text-white outline-none"
                  >
                    {finishesList.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.tag})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column: Live Visual & Budget Summary (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Visual Window Canvas */}
                <CadBlueprintSvg
                  widthCm={widthCm}
                  heightCm={heightCm}
                  typology={currentTypology}
                  series={calc.serie}
                  glass={calc.glass}
                  finish={calc.finish}
                  qty={qty}
                />

                {/* Plain Benefit Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-sans">
                  <div className="bg-[#0B0E14] border border-white/[0.08] p-3.5 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Aislación Térmica</span>
                    </div>
                    <span className="text-white font-bold block">{calc.thermalText}</span>
                    <span className="text-[11px] text-zinc-400">Protege de frío y calor</span>
                  </div>

                  <div className="bg-[#0B0E14] border border-white/[0.08] p-3.5 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                      <Volume2 className="w-4 h-4 text-sky-400" />
                      <span>Aislación Acústica</span>
                    </div>
                    <span className="text-emerald-400 font-bold block">{calc.noiseText}</span>
                    <span className="text-[11px] text-zinc-400">Reduce ruidos de la calle</span>
                  </div>

                  <div className="bg-[#0B0E14] border border-white/[0.08] p-3.5 rounded-xl space-y-1 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      <span>Garantía Oficial</span>
                    </div>
                    <span className="text-[#C5A059] font-bold block">{calc.serie.warrantyYears} Años</span>
                    <span className="text-[11px] text-zinc-400">Aluminio virgen Aluar</span>
                  </div>
                </div>

                {/* Calculation Summary Card & Actions */}
                <div className="bg-[#0B0E14] border border-[#C5A059]/40 rounded-2xl p-6 space-y-5 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                    <div>
                      <span className="text-xs text-zinc-400 block font-sans">
                        PRESUPUESTO ESTIMADO // {qty} {qty === 1 ? 'VENTANA' : 'VENTANAS'}
                      </span>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-mono text-3xl sm:text-4xl font-bold text-[#C5A059] tabular-nums">
                          ${calc.subtotal.toLocaleString('es-AR')}
                        </span>
                        <span className="font-mono text-xs text-zinc-400">ARS</span>
                      </div>
                      <span className="text-xs text-zinc-400 font-sans block mt-0.5">
                        Precio por unidad: ${calc.unitPrice.toLocaleString('es-AR')} ARS
                      </span>
                    </div>

                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-emerald-400 block font-semibold">
                        FABRICACIÓN A MEDIDA
                      </span>
                      <span className="text-xs text-zinc-400 font-sans">
                        Entrega en 15 a 20 días hábiles
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons: "Agregar al Carrito" */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="px-5 py-3.5 bg-[#C5A059] hover:bg-[#b38f4a] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar al Carrito</span>
                    </button>

                    <a
                      href={buildSingleVanoWhatsAppUrl(calc, widthCm, heightCm, currentTypology.name, qty, customTag)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3.5 bg-[#141B26] hover:bg-[#1A2332] text-zinc-200 hover:text-white border border-white/[0.1] font-semibold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <span>Consultar por WhatsApp</span>
                      <ArrowUpRight className="w-4 h-4 text-[#C5A059]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Strictly ONE Floating Official WhatsApp Button */}
      <FloatingWhatsApp
        cart={cart}
        grandTotal={grandTotal}
        currentCalc={calc}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#050709] py-8 mt-16 text-zinc-400 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Compass className="w-4 h-4 text-[#C5A059]" />
            <span className="font-serif text-base font-bold text-white tracking-wide">
              ARLIA ABERTURAS & VIDRIOS
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-zinc-400">
            <span>WhatsApp Directo: <strong className="text-zinc-200">{FACTORY_DISPLAY_PHONE}</strong></span>
            <span>Garantía: <strong className="text-emerald-400">Hasta 15 años</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
