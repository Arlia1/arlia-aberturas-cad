export const INITIAL_SERIES = [
  {
    id: 'modena',
    name: 'Aluar Módena',
    subtitle: 'Línea Clásica Residencial',
    description: 'La opción más elegida para hogares. Excelente relación precio-calidad y gran durabilidad.',
    pricePerMl: 38500,
    maxHeightCm: 220,
    maxWidthCm: 260,
    baseDb: 31,
    frameDepthMm: 45,
    thermalBridge: false,
    warrantyYears: 10
  },
  {
    id: 'a30',
    name: 'Aluar A30 New',
    subtitle: 'Línea Pesada de Alta Prestación',
    description: 'Estructura más robusta. Ideal para ventanales grandes, puertas balcón y máxima aislación.',
    pricePerMl: 58000,
    maxHeightCm: 280,
    maxWidthCm: 380,
    baseDb: 37,
    frameDepthMm: 60,
    thermalBridge: false,
    warrantyYears: 15
  },
  {
    id: 'rpt60',
    name: 'Aluar RPT Aislación Total',
    subtitle: 'Máxima Eficiencia Térmica y Ahorro',
    description: 'Evita el paso del frío y el calor hacia el interior. Mantiene tu casa templada todo el año.',
    pricePerMl: 82000,
    maxHeightCm: 320,
    maxWidthCm: 420,
    baseDb: 44,
    frameDepthMm: 68,
    thermalBridge: true,
    warrantyYears: 20
  },
  {
    id: 'a40',
    name: 'Aluar A40 Minimalista',
    subtitle: 'Marcos Ocultos & Vista Panorámica',
    description: 'Perfiles ultra delgados para disfrutar de la vista con la mayor entrada de luz posible.',
    pricePerMl: 94000,
    maxHeightCm: 340,
    maxWidthCm: 480,
    baseDb: 40,
    frameDepthMm: 72,
    thermalBridge: true,
    warrantyYears: 20
  }
];

export const INITIAL_GLASSES = [
  {
    id: 'dvh_solar',
    name: 'Doble Vidrio Hermético (DVH) Control Solar',
    subtitle: 'Aísla frío, calor y frena el sol directo',
    description: 'Doble panel de vidrio sellado que mantiene el ambiente fresco en verano y cálido en invierno.',
    pricePerM2: 105000,
    insulationLevel: 'Excelente',
    acousticText: 'Silencioso (-34 dB)',
    thicknessMm: 20
  },
  {
    id: 'dvh_std',
    name: 'Doble Vidrio Hermético (DVH) Estándar',
    subtitle: 'Aislación térmica y acústica equilibrada',
    description: 'Evita que los vidrios transpiren y reduce sensiblemente el gasto en aire o calefacción.',
    pricePerM2: 76000,
    insulationLevel: 'Muy Buena',
    acousticText: 'Aislante (-31 dB)',
    thicknessMm: 17
  },
  {
    id: 'dvh_acoustic',
    name: 'Doble Vidrio Acústico Antirruido',
    subtitle: 'Máxima paz frente a calles transitadas',
    description: 'Lámina especial insonorizante que frena ruidos de colectivos, tránsito y ruidos exteriores.',
    pricePerM2: 142000,
    insulationLevel: 'Máxima Aislación',
    acousticText: 'Insonorizado (-42 dB)',
    thicknessMm: 26
  },
  {
    id: 'lam_33',
    name: 'Vidrio Laminado de Seguridad (Blindex)',
    subtitle: 'Vidrio de seguridad que no se desarma',
    description: 'Ante golpes accidentales no se quiebra en pedazos peligrosos. Ideal para puertas bajas.',
    pricePerM2: 58000,
    insulationLevel: 'Estándar',
    acousticText: 'Estándar (-32 dB)',
    thicknessMm: 6.38
  }
];

export const FINISHES = [
  {
    id: 'negro',
    name: 'Negro Semimate',
    code: 'RAL 9005',
    colorHex: '#1D2024',
    strokeHex: '#4A505C',
    surchargePct: 12,
    tag: 'El más elegido'
  },
  {
    id: 'blanco',
    name: 'Blanco Brillante',
    code: 'RAL 9010',
    colorHex: '#EAEAEA',
    strokeHex: '#FFFFFF',
    surchargePct: 8,
    tag: 'Luminoso y clásico'
  },
  {
    id: 'anodizado',
    name: 'Aluminio Natural Anodizado',
    code: 'Natural Mate',
    colorHex: '#9CA3AF',
    strokeHex: '#D1D5DB',
    surchargePct: 0,
    tag: 'Aluminio cepillado'
  },
  {
    id: 'grafito',
    name: 'Gris Grafito Oscuro',
    code: 'RAL 7016',
    colorHex: '#2B303A',
    strokeHex: '#525969',
    surchargePct: 15,
    tag: 'Estilo moderno'
  },
  {
    id: 'bronce',
    name: 'Bronce Colonial',
    code: 'Bronce Oscuro',
    colorHex: '#3D312A',
    strokeHex: '#6E594D',
    surchargePct: 18,
    tag: 'Cálido y elegante'
  },
  {
    id: 'madera',
    name: 'Símil Madera Nogal',
    code: 'Nogal Premium',
    colorHex: '#4A2F1D',
    strokeHex: '#7C5237',
    surchargePct: 30,
    tag: 'Aspecto madera'
  }
];

export const TYPOLOGIES = [
  {
    id: 'corrediza_2h',
    name: 'Ventana Corrediza (2 Hojas)',
    leaves: 2,
    category: 'Ventanas',
    description: 'Dos hojas que se deslizan suavemente. Es el modelo tradicional para dormitorios y cocinas.'
  },
  {
    id: 'puerta_balcon',
    name: 'Puerta Balcón (2 Hojas)',
    leaves: 2,
    category: 'Puertas',
    description: 'Abertura de piso a techo para salida al patio, balcón o jardín con zócalo reforzado.'
  },
  {
    id: 'corrediza_3h',
    name: 'Ventanál 3 Hojas (Guía Triple)',
    leaves: 3,
    category: 'Ventanales',
    description: 'Permite abrir dos tercios del espacio para una entrada de aire y paso mucho más amplia.'
  },
  {
    id: 'corrediza_4h',
    name: 'Ventanál 4 Hojas (Apertura Central)',
    leaves: 4,
    category: 'Ventanales',
    description: 'Las hojas abren hacia ambos lados dejando libre el centro. Ideal para livings grandes.'
  },
  {
    id: 'pano_fijo',
    name: 'Paño Fijo (Sin Apertura)',
    leaves: 1,
    category: 'Fijos',
    description: 'Máxima vista y luz natural. No se abre, garantizando cierre hermético perfecto.'
  },
  {
    id: 'oscilobatiente',
    name: 'Ventana Oscilobatiente (Abre de costado y arriba)',
    leaves: 1,
    category: 'Ventilación',
    description: 'Doble función: abre hacia adentro como una puerta o se reclina de arriba para ventilar.'
  }
];

export const PRESETS = [
  {
    name: 'Ventana Dormitorio (150 x 120 cm)',
    widthCm: 150,
    heightCm: 120,
    typologyId: 'corrediza_2h',
    seriesId: 'modena',
    glassId: 'dvh_std',
    finishId: 'negro'
  },
  {
    name: 'Puerta Balcón Living (200 x 210 cm)',
    widthCm: 200,
    heightCm: 210,
    typologyId: 'puerta_balcon',
    seriesId: 'a30',
    glassId: 'dvh_solar',
    finishId: 'negro'
  },
  {
    name: 'Ventanál Grande Jardín (300 x 220 cm)',
    widthCm: 300,
    heightCm: 220,
    typologyId: 'corrediza_3h',
    seriesId: 'a30',
    glassId: 'dvh_solar',
    finishId: 'negro'
  },
  {
    name: 'Paño Fijo de Luz (120 x 150 cm)',
    widthCm: 120,
    heightCm: 150,
    typologyId: 'pano_fijo',
    seriesId: 'modena',
    glassId: 'dvh_solar',
    finishId: 'blanco'
  },
  {
    name: 'Ventana Baño / Cocina (100 x 60 cm)',
    widthCm: 100,
    heightCm: 60,
    typologyId: 'oscilobatiente',
    seriesId: 'modena',
    glassId: 'dvh_std',
    finishId: 'anodizado'
  }
];
