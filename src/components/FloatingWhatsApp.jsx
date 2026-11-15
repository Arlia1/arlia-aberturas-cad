import React, { useState } from 'react';
import { X, ArrowUpRight, MessageSquare, Phone, Clock, ShieldCheck, Ruler } from 'lucide-react';
import { FACTORY_DISPLAY_PHONE, buildCartWhatsAppUrl, buildMeasurementRequestUrl, buildDirectInquiryUrl } from '../services/whatsapp.service';

export default function FloatingWhatsApp({ cart = [], grandTotal = 0, currentCalc = null }) {
  const [isOpen, setIsOpen] = useState(false);

  const hasItems = cart.length > 0;

  return (
    <>
      {/* Strictly ONE Floating Action Button */}
      <div className="fixed bottom-5 right-5 z-50">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir WhatsApp Oficial"
          className="relative flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold px-4 py-3 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] transition-all transform hover:scale-105 active:scale-95"
        >
          {/* Official WhatsApp SVG Icon */}
          <svg className="w-6 h-6 fill-black shrink-0" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.813 3.179 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.766-5.768-5.767zm9.969 5.766c0 5.505-4.495 10-10 10-1.706 0-3.32-.429-4.743-1.189l-5.257 1.378 1.405-5.132c-.854-1.488-1.336-3.21-1.336-5.057 0-5.505 4.495-10 10-10s10 4.495 10 10z" />
          </svg>

          <span className="text-sm font-bold tracking-tight">
            WhatsApp Aberturas
          </span>

          {hasItems && (
            <span className="bg-black text-[#25D366] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Slide-over / Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full sm:max-w-md bg-[#0F141E] border border-white/[0.12] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden p-6 text-zinc-100 space-y-4 animate-slideUp sm:animate-scaleUp mr-0 sm:mr-2 mb-0 sm:mb-16"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 flex items-center justify-center text-[#25D366]">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.77.813 2.796.813 3.179 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.766-5.768-5.767zm9.969 5.766c0 5.505-4.495 10-10 10-1.706 0-3.32-.429-4.743-1.189l-5.257 1.378 1.405-5.132c-.854-1.488-1.336-3.21-1.336-5.057 0-5.505 4.495-10 10-10s10 4.495 10 10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-white leading-tight">
                    ARLIA Aberturas & Vidrios
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    Línea Oficial: <span className="text-[#C5A059] font-mono">{FACTORY_DISPLAY_PHONE}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
                aria-label="Cerrar ventana de WhatsApp"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Note */}
            <div className="bg-[#141B26] border border-white/[0.06] p-3 rounded-lg text-xs space-y-1 font-sans">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Atención y asesoramiento online</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Envianos las medidas de tus ventanas o tu carrito y te pasamos el presupuesto exacto al momento.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              {hasItems ? (
                <a
                  href={buildCartWhatsAppUrl(cart, grandTotal)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-colors shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Enviar Carrito Completo ({cart.length} aberturas • ${grandTotal.toLocaleString('es-AR')})</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              ) : currentCalc ? (
                <a
                  href={buildDirectInquiryUrl(`Consulta por ${currentCalc.serie?.name || 'Abertura'} ($${currentCalc.subtotal.toLocaleString('es-AR')} ARS)`)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between transition-colors shadow-lg"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Consultar Abertura Actual (${currentCalc.subtotal.toLocaleString('es-AR')} ARS)</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              ) : null}

              <a
                href={buildMeasurementRequestUrl()}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full bg-zinc-800/80 hover:bg-zinc-800 text-zinc-100 border border-white/[0.08] text-xs py-2.5 px-4 rounded-xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Ruler className="w-4 h-4 text-[#C5A059]" />
                  <span>Pedir Medición a Domicilio / Obra</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </a>

              <a
                href={buildDirectInquiryUrl('Asesoramiento sobre ventanas y doble vidrio')}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full bg-zinc-800/80 hover:bg-zinc-800 text-zinc-100 border border-white/[0.08] text-xs py-2.5 px-4 rounded-xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>Hablar con un Asesor de Ventas</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-400" />
              </a>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-white/[0.06]">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Lunes a Viernes 8:00 a 18:30 hs
              </span>
              <span className="flex items-center gap-1 text-[#C5A059]">
                <ShieldCheck className="w-3.5 h-3.5" /> Calidad Oficial Aluar
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
