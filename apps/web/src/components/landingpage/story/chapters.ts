// Narrative of the landing: a barber who becomes an entrepreneur.
// Copy lives here so the page reads as a script, and the components only lay it out.
// Every scene image has a -desktop (16:9) and a -mobile (9:16) plate in /public/landing,
// registered in /public/assets.manifest.json.

export type ChapterId = "chaos" | "bookings" | "finances" | "trends" | "time" | "assets";

export type Chapter = {
  id: ChapterId;
  /** Chapter number shown in the eyebrow. */
  number: string;
  eyebrow: string;
  title: string;
  accent: string;
  lede: string;
  /** Base name of the plate: /landing/<image>-desktop.webp and -mobile.webp. */
  image: string;
  alt: string;
  /** Set for features that are planned but not shipped yet. */
  upcoming?: boolean;
  /** The mobile plate is bright behind the heading (see StoryScene). */
  strongScrim?: boolean;
};

export const HERO = {
  image: "hero",
  alt: "Ilustración 3D de un barbero joven con chaqueta de cuero marrón, de pie en la puerta de cristal de su barbería al amanecer, con un sillón de barbero y luz turquesa al fondo.",
};

export const CHAPTERS: Chapter[] = [
  {
    id: "chaos",
    number: "01",
    eyebrow: "Las 23:40",
    title: "Cortas diez horas.",
    accent: "Luego empieza el otro turno.",
    lede:
      "WhatsApps sin contestar, una agenda de papel tachada y la caja cuadrada a ojo. Eres un artista con la tijera, pero el negocio te está robando las noches.",
    image: "chaos",
    alt: "El barbero, agotado, sentado de noche en su propio sillón mirando un móvil lleno de mensajes, con una agenda de papel tachada y billetes sueltos en el mostrador.",
  },
  {
    id: "bookings",
    number: "02",
    eyebrow: "Reservas",
    title: "Una reserva entra.",
    accent: "Tú sigues cortando.",
    lede:
      "Tu barbería tiene su propio enlace y su código QR. El cliente elige servicio y hora, y la solicitud te llega al instante. Aceptas con un toque, sin soltar la máquina.",
    image: "bookings",
    alt: "El barbero haciendo un degradado con la máquina a un cliente con capa negra mientras su móvil, sobre el mostrador, se ilumina con una notificación turquesa.",
  },
  {
    id: "finances",
    number: "03",
    eyebrow: "Finanzas",
    title: "Completas el corte.",
    accent: "La caja se cuadra sola.",
    lede:
      "Al marcar la reserva como completada, el ingreso se registra en tus finanzas. Sabes lo que llevas hoy, esta semana y este mes, sin libretas ni calculadora.",
    image: "finances",
    alt: "Un cliente con el corte recién hecho se despide en la puerta mientras el barbero sonríe mirando el móvil, sobre el que flota un gráfico de barras turquesa con una moneda.",
  },
  {
    id: "trends",
    number: "04",
    eyebrow: "Inteligencia artificial",
    title: "Tu barbería,",
    accent: "en tendencia.",
    lede:
      "Businext escucha lo que está creciendo en TikTok, Instagram y YouTube, lo cruza con los datos reales de tu barbería y te avisa de cuándo publicar, qué formato usar y qué idea grabar para llegar a más gente.",
    image: "trends",
    alt: "El barbero grabando con un móvil sobre trípode y aro de luz el degradado de un cliente, rodeado de iconos holográficos turquesa de corazón, reproducir, tendencia al alza y campana.",
    upcoming: true,
  },
  {
    id: "time",
    number: "05",
    eyebrow: "Tiempo",
    title: "Las horas",
    accent: "vuelven a ser tuyas.",
    lede:
      "Lo repetitivo lo hace Businext: confirmar citas, apuntar cobros, preparar el informe de la semana. Tú vuelves a tener domingos.",
    image: "time",
    strongScrim: true,
    alt: "El barbero relajado en una terraza al sol de la tarde, riendo con un café y el móvil boca abajo sobre la mesa.",
  },
  {
    id: "assets",
    number: "06",
    eyebrow: "Patrimonio",
    title: "De barbero",
    accent: "a empresario.",
    lede:
      "Con datos claros decides con cabeza: qué servicio empujar, cuándo subir precios, cuándo abrir otra silla. El tiempo y la eficiencia que ganas se convierten en activos: un equipo, una marca, un segundo local.",
    image: "assets",
    alt: "El barbero de pie entre dos barberías que son suyas, al amanecer, levantando un juego de llaves; la segunda está recién abierta con luces turquesa.",
  },
];

export const FAQS = [
  {
    q: "¿Está pensado para barberías?",
    a: "Sí. Businext nace para barberías y peluquerías: reservas por servicio y barbero, caja diaria, equipo y análisis semanal. También funciona para cualquier negocio con citas, como centros de estética o clínicas.",
  },
  {
    q: "¿Mis clientes pueden reservar por su cuenta?",
    a: "Sí. Tu barbería tiene un enlace único y un código QR que puedes poner en el espejo, en Instagram o en la puerta. El cliente elige servicio y horario, y tú aceptas o rechazas la solicitud desde el móvil.",
  },
  {
    q: "¿Cómo llegan los cobros a las finanzas?",
    a: "Cuando completas una reserva, el ingreso del servicio se registra en tus finanzas. También puedes apuntar ventas de producto y gastos para ver la caja del día y la evolución de la semana.",
  },
  {
    q: "¿Qué es el radar de tendencias?",
    a: "Es la próxima funcionalidad de Businext: detecta lo que está creciendo en redes sociales, lo cruza con tus datos (servicios estrella, horas con más clientes, tu público) y te envía notificaciones con el momento, el formato y la idea para publicar. Hoy ya tienes el informe semanal con IA; el radar llegará en una próxima versión.",
  },
  {
    q: "¿Cómo funciona el primer mes gratis?",
    a: "Creas tu cuenta, introduces tu tarjeta para verificar tu identidad y usas Businext completo durante 30 días sin cargo. Después se activa la suscripción de 14,99 €/mes; si cancelas antes, no se te cobra nada.",
  },
  {
    q: "¿Necesito instalar algo?",
    a: "No. Businext funciona desde el navegador del móvil o del ordenador, sin descargas ni configuraciones técnicas.",
  },
];
