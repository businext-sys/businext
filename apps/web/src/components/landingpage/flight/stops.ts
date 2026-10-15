// The flight: one continuous shot through the barbershop, scrubbed by the scroll.
// Each stop has a plate (-desktop 16:9, -mobile 9:16) in /public/landing and, except the
// last, a leg that flies to the next plate in /public/landing/video. Everything generated is
// registered in /public/assets.manifest.json.

export type ScreenId = "overview" | "call" | "trends" | "control" | "till";

export type Stop = {
  id: string;
  /** Short name for the navigation pips. */
  label: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  /** Base name of the plate: /landing/<plate>-desktop.webp and -mobile.webp. */
  plate: string;
  alt: string;
  /** Base name of the leg to the next plate: /landing/video/<leg>-desktop.webm and -mobile.mp4. */
  leg?: string;
  screen: ScreenId;
};

export const STOPS: Stop[] = [
  {
    id: "inicio",
    label: "Businext",
    eyebrow: "Businext para barberías",
    title: "Tu barbería contesta, publica y cobra",
    accent: "mientras tú cortas.",
    body: "Una IA que coge el teléfono, convierte las tendencias en publicaciones y te avisa de todo al momento. Reservas y caja, solas.",
    plate: "stop1",
    alt: "Ilustración 3D del barbero con chaqueta de cuero marrón, de brazos cruzados junto al sillón de su barbería al anochecer; sobre el móvil del mostrador flota un anillo de luz turquesa.",
    leg: "leg1-2",
    screen: "overview",
  },
  {
    id: "llamadas",
    label: "Asistente telefónico",
    eyebrow: "01 · Asistente telefónico con IA",
    title: "Suena el teléfono.",
    accent: "Lo coge la IA.",
    body: "Atiende cada llamada con voz natural, mira tu agenda real y deja la cita reservada. Tú no sueltas la máquina.",
    plate: "stop2",
    alt: "El barbero hace un degradado a un cliente con capa negra mientras, en primer plano, el móvil del mostrador emite ondas de sonido turquesa y una tarjeta de calendario holográfica.",
    leg: "leg2-3",
    screen: "call",
  },
  {
    id: "tendencias",
    label: "Tendencias y contenido",
    eyebrow: "02 · Tendencias y contenido",
    title: "Lo que es tendencia,",
    accent: "publicado solo.",
    body: "Analiza lo que crece en TikTok, Instagram y YouTube, lo cruza con tus servicios y te propone qué grabar. Tú das el visto bueno; Businext lo publica a la mejor hora.",
    plate: "stop3",
    alt: "El barbero graba con un móvil en trípode y aro de luz al cliente recién cortado, rodeado de iconos holográficos turquesa: corazón, reproducir, gráfica al alza y calendario.",
    leg: "leg3-4",
    screen: "trends",
  },
  {
    id: "control",
    label: "Control con IA",
    eyebrow: "03 · Control con IA",
    title: "Todo lo que pasa,",
    accent: "te llega al momento.",
    body: "Reservas, cancelaciones, cobros y publicaciones: la IA lo vigila y te avisa en tiempo real. Y le preguntas lo que quieras de tu negocio.",
    plate: "stop4",
    alt: "Con la barbería ya vacía, el barbero apoyado en el mostrador mira el móvil sonriendo, rodeado de tarjetas de notificación holográficas turquesa.",
    leg: "leg4-5",
    screen: "control",
  },
  {
    id: "reservas-y-caja",
    label: "Reservas y caja",
    eyebrow: "04 · Reservas y caja",
    title: "Y lo de siempre,",
    accent: "funcionando solo.",
    body: "Agenda por barbero, enlace y QR para reservar, y cada corte completado entra en la caja del día.",
    plate: "stop5",
    alt: "El barbero estrecha la mano a un cliente recién cortado junto al mostrador, donde una tableta muestra un calendario turquesa y un datáfono brilla con una moneda holográfica.",
    screen: "till",
  },
];

/** The sites that show what a Businext web looks like. */
export const SHOWCASE = [
  {
    name: "La Perla Barber Shop Studio",
    place: "Humanes de Madrid",
    href: "https://la-perla-barber-website.vercel.app",
  },
  {
    name: "Sito Barbershop",
    place: "El Quiñón, Seseña",
    href: "https://sito-barbershop-web.vercel.app",
  },
];

export const FAQS = [
  {
    q: "¿Cuánto costará?",
    a: "El precio final lo cerramos al abrir tu plaza. Rondará entre 50 y 70 € al mes según lo que necesite tu barbería: número de barberos, volumen de llamadas que atiende la IA y redes que gestiona.",
  },
  {
    q: "¿Qué es la whitelist?",
    a: "La lista de acceso anticipado. Abrimos Businext por tandas a un número limitado de barberías; si te apuntas, te escribimos cuando sea tu turno. Apuntarse no te compromete a nada.",
  },
  {
    q: "¿La web está incluida?",
    a: "Sí: la suscripción incluye una web para tu barbería, con precios, trabajos, ubicación y reserva conectada a tu agenda. Si solo quieres la web, la hacemos desde 150 €.",
  },
  {
    q: "¿Necesito instalar algo?",
    a: "No. Businext funciona desde el navegador del móvil o del ordenador.",
  },
];
