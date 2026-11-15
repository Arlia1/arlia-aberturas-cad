export const FACTORY_PHONE = '5491170726054';
export const FACTORY_DISPLAY_PHONE = '+54 9 11 7072-6054';

/**
 * Builds WhatsApp link for the entire shopping cart (Carrito de Aberturas)
 */
export function buildCartWhatsAppUrl(cartItems, grandTotal, clientData = {}) {
  const clientName = clientData.clientName ? `\n*Cliente:* ${clientData.clientName}` : '';
  const obraLocation = clientData.location ? `\n*Zona de entrega / obra:* ${clientData.location}` : '';

  const lines = [
    `*HOLA ARLIA! QUIERO COTIZAR MI CARRITO DE ABERTURAS:*`,
    `--------------------------------------------------`,
    clientName ? clientName.trim() : null,
    obraLocation ? obraLocation.trim() : null,
    `--------------------------------------------------`,
    `*DETALLE DE MI PEDIDO (${cartItems.length} aberturas):*`,
    ...cartItems.map((item, idx) => {
      const pos = item.tag || `Abertura #${idx + 1}`;
      return (
        `\n${idx + 1}. *${pos}*` +
        `\n   • Modelo: ${item.typologyName}` +
        `\n   • Medidas: ${item.widthCm} cm ancho x ${item.heightCm} cm alto` +
        `\n   • Línea: ${item.seriesName} (${item.finishName})` +
        `\n   • Vidrio: ${item.glassName}` +
        `\n   • Cantidad: ${item.qty} un.` +
        `\n   • Subtotal estimado: $${item.subtotal.toLocaleString('es-AR')} ARS`
      );
    }),
    `\n--------------------------------------------------`,
    `*TOTAL ESTIMADO DEL CARRITO:* *$${grandTotal.toLocaleString('es-AR')} ARS*`,
    `--------------------------------------------------`,
    `¿Podrían confirmarme los plazos de fabricación y si pueden pasar a tomar las medidas finales? Gracias!`
  ].filter(Boolean);

  return `https://wa.me/${FACTORY_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Builds WhatsApp link for a single configured opening (Abertura actual)
 */
export function buildSingleVanoWhatsAppUrl(calc, widthCm, heightCm, typologyName, qty = 1, tag = 'Ventana') {
  const lines = [
    `*HOLA ARLIA! CONSULTA POR ESTA ABERTURA:*`,
    `--------------------------------------------------`,
    `*Identificador:* ${tag}`,
    `*Modelo:* ${typologyName}`,
    `*Medidas:* ${widthCm} cm ancho x ${heightCm} cm alto (${widthCm * 10} x ${heightCm * 10} mm)`,
    `*Línea de Aluminio:* ${calc.serie.name}`,
    `*Color:* ${calc.finish.name}`,
    `*Vidrio:* ${calc.glass.name}`,
    `*Cantidad:* ${qty} un.`,
    `--------------------------------------------------`,
    `*PRESUPUESTO ESTIMADO:* *$${calc.subtotal.toLocaleString('es-AR')} ARS*`,
    `--------------------------------------------------`,
    `Quisiera saber plazos de entrega y consultar si realizan instalación en mi zona.`
  ];

  return `https://wa.me/${FACTORY_PHONE}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * WhatsApp link to request on-site laser measurement
 */
export function buildMeasurementRequestUrl(extra = '') {
  const msg = [
    `*HOLA ARLIA! SOLICITUD DE MEDICIÓN A DOMICILIO / OBRA*`,
    `Quisiera coordinar una visita técnica para que tomen las medidas definitivas de mis aberturas.`,
    extra ? `Comentarios: ${extra}` : null,
    `¿En qué horarios tienen disponibilidad? Gracias!`
  ].filter(Boolean).join('\n');

  return `https://wa.me/${FACTORY_PHONE}?text=${encodeURIComponent(msg)}`;
}

/**
 * Direct inquiry link
 */
export function buildDirectInquiryUrl(topic = 'Consulta General de Aberturas') {
  const msg = `*HOLA ARLIA ABERTURAS*\nMe contacto desde la página web para consultar por: ${topic}.`;
  return `https://wa.me/${FACTORY_PHONE}?text=${encodeURIComponent(msg)}`;
}
