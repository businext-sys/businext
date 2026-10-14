// Narrative of the landing: a barber who becomes an entrepreneur.
// Copy lives here so the page reads as a script, and the components only lay it out.
// Keep it short: the scene and the app mockup tell the story, the copy only names it.
// Every scene image has a -desktop (16:9) and a -mobile (9:16) plate in /public/landing,
// registered in /public/assets.manifest.json.

export type ChapterId = "chaos" | "bookings" | "calls" | "finances" | "trends" | "time" | "assets";

export type Chapter = {
  id: ChapterId;
  /** Chapter number shown in the eyebrow. */
  number: string;
  eyebrow: string;
  title: string;
  accent: string;
  /** One line, a few words. */
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
    accent: "Y luego, el otro turno.",
    lede: "Mensajes, agenda de papel y caja a ojo.",
    image: "chaos",
    alt: "El barbero, agotado, sentado de noche en su propio sillón mirando un móvil lleno de mensajes, con una agenda de papel tachada y billetes sueltos en el mostrador.",
  },
  {
    id: "bookings",
    number: "02",
    eyebrow: "Reservas",
    title: "Entra una reserva.",
    accent: "Tú sigues cortando.",
    lede: "Enlace y QR propios. Aceptas con un toque.",
    image: "bookings",
    alt: "El barbero haciendo un degradado con la máquina a un cliente con capa negra mientras su móvil, sobre el mostrador, se ilumina con una notificación turquesa.",
  },
  {
    id: "calls",
    number: "03",
    eyebrow: "Agente de llamadas IA",
    title: "Suena el teléfono.",
    accent: "Contesta tu IA.",
    lede: "Atiende, agenda y te avisa. 24/7.",
    image: "calls",
    alt: "El barbero cortando el pelo con tijera y peine mientras su móvil, sobre el mostrador, contesta solo una llamada: encima flota una esfera turquesa de voz con ondas de sonido y un icono de auriculares.",
    upcoming: true,
  },
  {
    id: "finances",
    number: "04",
    eyebrow: "Finanzas",
    title: "Terminas el corte.",
    accent: "La caja se cuadra sola.",
    lede: "Cada reserva completada, registrada.",
    image: "finances",
    alt: "Un cliente con el corte recién hecho se despide en la puerta mientras el barbero sonríe mirando el móvil, sobre el que flota un gráfico de barras turquesa con una moneda.",
  },
  {
    id: "trends",
    number: "05",
    eyebrow: "Tendencias IA",
    title: "Tu barbería,",
    accent: "en tendencia.",
    lede: "Qué, cómo y cuándo publicar.",
    image: "trends",
    alt: "El barbero grabando con un móvil sobre trípode y aro de luz el degradado de un cliente, rodeado de iconos holográficos turquesa de corazón, reproducir, tendencia al alza y campana.",
    upcoming: true,
  },
  {
    id: "time",
    number: "06",
    eyebrow: "Tiempo",
    title: "Las horas",
    accent: "vuelven a ser tuyas.",
    lede: "Lo repetitivo lo hace Businext.",
    image: "time",
    strongScrim: true,
    alt: "El barbero relajado en una terraza al sol de la tarde, riendo con un café y el móvil boca abajo sobre la mesa.",
  },
  {
    id: "assets",
    number: "07",
    eyebrow: "Patrimonio",
    title: "De barbero",
    accent: "a empresario.",
    lede: "Datos, decisiones, activos.",
    image: "assets",
    alt: "El barbero de pie entre dos barberías que son suyas, al amanecer, levantando un juego de llaves; la segunda está recién abierta con luces turquesa.",
  },
];
