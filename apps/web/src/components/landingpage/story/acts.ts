/**
 * The story the landing tells, act by act. One continuous clip (public/story/story.mp4,
 * 720 frames) is scrubbed by the scroll; each act owns a slice of it, and its share of the
 * scroll is proportional to that slice, so copy and footage always line up.
 *
 * The script and the reasoning behind it live in apps/web/LANDING.md.
 */
export type Act = {
  id: string;
  /** Short name for the side navigation. */
  label: string;
  /** One line, shown next to the label in the navigation. */
  blurb: string;
  eyebrow: string;
  /** The heading, split so one word can carry the accent. */
  heading: [before: string, accent: string, after?: string];
  body: string;
  /** Lines that arrive one by one while the act is scrolled through. */
  points?: string[];
  /** First and last frame of the clip this act scrubs through (1-based, inclusive). */
  frames: [from: number, to: number];
  /** Still shown when the clip cannot play: no JS yet, reduced motion, or still loading. */
  poster: string;
  posterAlt: string;
};

export const STORY_FRAMES = 720;

export const ACTS: Act[] = [
  {
    id: "problema",
    label: "Tu día",
    blurb: "Cortas, contestas, apuntas, cobras",
    eyebrow: "Un sábado cualquiera",
    heading: ["Tu barbería no para.", "Tú", "tampoco."],
    body: "Estás con la máquina en la mano y suena el teléfono. Un WhatsApp para mañana, una cita apuntada en un papel, un cliente que no viene. Y a las nueve de la noche, la caja sin cuadrar.",
    frames: [1, 80],
    poster: "/story/problem.webp",
    posterAlt: "Una burbuja de luz nace en la oscuridad",
  },
  {
    id: "agenda",
    label: "Agenda",
    blurb: "Las citas entran solas",
    eyebrow: "01 — Reservas",
    heading: ["La agenda se llena", "sola", "."],
    body: "Tus clientes reservan desde tu enlace o tu código QR, a cualquier hora. Tú aceptas con un toque, entre corte y corte. Ni una llamada más con las manos ocupadas.",
    points: ["Enlace y QR propios para reservar", "Agenda por barbero y por día", "Huecos libres a la vista"],
    frames: [81, 175],
    poster: "/story/agenda.webp",
    posterAlt: "Un calendario de neón dentro de una burbuja, con un día marcado",
  },
  {
    id: "caja",
    label: "Caja",
    blurb: "Sabes lo que ganas cada día",
    eyebrow: "02 — Dinero",
    heading: ["Sabes lo que", "ganas", ", cada día."],
    body: "Cada corte cobrado y cada producto vendido entran en la caja al momento. Ves el día, el mes y el año, y lo que deja cada servicio. Se acabó cuadrar a ojo.",
    points: ["Caja del día en tiempo real", "Servicios, productos y gastos", "Evolución mes a mes"],
    frames: [176, 310],
    poster: "/story/cash.webp",
    posterAlt: "Un fajo de billetes de neón dentro de una burbuja",
  },
  {
    id: "resenas",
    label: "Reseñas",
    blurb: "Tu reputación trabaja por ti",
    eyebrow: "03 — Reputación",
    heading: ["Tu fama trabaja", "por ti", "."],
    body: "Businext lee tus reseñas de Google, te dice qué gusta y qué no, y te deja la respuesta escrita. Tú solo la revisas. Un buen perfil es lo que hace que un vecino nuevo entre por la puerta.",
    points: ["Reseñas de Google en un solo sitio", "Lo positivo y lo negativo, resumido", "Respuestas redactadas por IA"],
    frames: [311, 400],
    poster: "/story/reviews.webp",
    posterAlt: "El logotipo de Google rodeado de estrellas dentro de una burbuja",
  },
  {
    id: "asesor",
    label: "Asesor IA",
    blurb: "Te dice dónde está el dinero",
    eyebrow: "04 — Inteligencia",
    heading: ["Un asesor que conoce tu", "barbería", "."],
    body: "Cada semana, un informe con lo que importa: qué tarde se queda vacía, qué clientes han dejado de venir, qué barbero tira del negocio. Y qué hacer con cada cosa.",
    points: ["Informe semanal automático", "Clientes en riesgo de no volver", "Recomendaciones concretas"],
    frames: [401, 550],
    poster: "/story/advisor.webp",
    posterAlt: "Un cerebro de neón con las letras IA dentro de una burbuja",
  },
  {
    id: "businext",
    label: "Businext",
    blurb: "Más tiempo y más dinero",
    eyebrow: "Todo en uno",
    heading: ["Más tiempo en el sillón. Más dinero en la", "caja", "."],
    body: "Businext se ocupa de la agenda, la caja y la reputación para que tú te ocupes de lo tuyo: cortar, atender y hacer crecer tu barbería.",
    frames: [551, 720],
    poster: "/story/businext.webp",
    posterAlt: "La palabra Businext en neón rompiendo su burbuja",
  },
];
