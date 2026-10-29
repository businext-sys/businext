// Everything the landing shows is a feature that exists today; the figures on the app screens
// are sample data and the page says so.

import { Lock, MessageSquare, Sparkles, Wrench, type LucideIcon } from "lucide-react";

export type ScreenId = "call" | "request" | "review" | "chat" | "till";

export const HERO_BEATS: { screen: ScreenId; title: string; text: string }[] = [
  { screen: "call", title: "Llamada atendida", text: "Carlos reservó el jueves a las 18:30" },
  { screen: "request", title: "Nueva solicitud", text: "Marcos quiere cita mañana a las 17:00" },
  { screen: "review", title: "Reseña de 5 estrellas", text: "Tienes la respuesta lista para copiar" },
  { screen: "chat", title: "Tu semana", text: "1.384 €, un 12 % más que la anterior" },
];

export const CALL_LINES: { who: "client" | "assistant"; text: string }[] = [
  { who: "client", text: "Hola, ¿tenéis hueco el jueves para degradado y barba?" },
  { who: "assistant", text: "Sí, a las 18:30 con Álex. ¿Te lo reservo a tu nombre?" },
  { who: "client", text: "Perfecto, soy Carlos." },
  { who: "assistant", text: "Hecho, Carlos. Te esperamos el jueves a las 18:30." },
];

export const CHAPTERS: { title: string; caption: string; screen: ScreenId; plate: string }[] = [
  {
    title: "No pierdes una llamada",
    caption: "El asistente de voz coge las llamadas que tú no puedes y deja la cita en tu agenda real.",
    screen: "call",
    plate: "stop2",
  },
  {
    title: "Te reservan online",
    caption:
      "Tu enlace de reserva trabaja solo. Te llega el aviso al móvil, aceptas con un toque y el cliente recibe su confirmación por email.",
    screen: "request",
    plate: "stop1",
  },
  {
    title: "Cuidas tu reputación",
    caption: "Tus reseñas de Google llegan a Businext y la IA te propone una respuesta en tu tono. Tú la revisas.",
    screen: "review",
    plate: "stop3",
  },
  {
    title: "Sabes cómo creces",
    caption:
      "Pregúntale al asistente cómo fue la semana, cuánto llevas en caja o qué reservas tienes mañana. Y en Inteligencia ves qué clientes fieles llevan tiempo sin venir.",
    screen: "chat",
    plate: "stop4",
  },
  {
    title: "Reservas y caja, solas",
    caption: "Agenda por barbero y caja del día: cada corte completado suma solo.",
    screen: "till",
    plate: "stop5",
  },
];

/** The sites that show what a Businext web looks like. `end` is how far each capture scrolls, in % of its height. */
export const SHOWCASE = [
  {
    name: "La Perla Barber Shop Studio",
    place: "Humanes de Madrid",
    href: "https://la-perla-barber-website.vercel.app",
    capture: "la-perla",
    end: { desktop: 87, mobile: 87 },
  },
  {
    name: "Sito Barbershop",
    place: "El Quiñón, Seseña",
    href: "https://sito-barbershop-web.vercel.app",
    capture: "sito",
    end: { desktop: 88, mobile: 88 },
  },
];

export const FOUNDER_PERKS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Lock, title: "Tarifa de fundador", text: "Mantienes para siempre las condiciones con las que entras." },
  { icon: Wrench, title: "Lo montamos contigo", text: "Configuramos tus servicios, barberos, horarios y el asistente de voz por ti." },
  { icon: MessageSquare, title: "Línea directa", text: "Hablas con quien construye Businext, y lo que pides entra en el plan." },
  { icon: Sparkles, title: "Primero en lo nuevo", text: "Cada función nueva llega antes a tu barbería." },
];
