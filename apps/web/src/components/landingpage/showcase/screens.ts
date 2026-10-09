/**
 * Past the story the landing lands: a plain, descriptive tour of the real app. Every
 * image is a capture of the web app itself, with demo data from a fictional barbershop
 * (see apps/web/LANDING.md for how they are produced).
 */
export type Shot = { src: string; width: number; height: number; alt: string };

export type Screen = {
  id: string;
  eyebrow: string;
  heading: [before: string, accent: string, after?: string];
  text: string;
  bullets: string[];
  /** The desktop view, framed as a browser window. */
  shot: Shot;
  /** The same moment on a phone, framed as a phone next to it. */
  phone?: Shot;
};

export const SCREENS: Screen[] = [
  {
    id: "vista-agenda",
    eyebrow: "Agenda",
    heading: ["Tu día entero en una", "pantalla", "."],
    text: "Las citas de hoy por barbero, lo que ya está cobrado y lo que falta. Añades un cliente que entra sin cita en dos toques y cierras cada servicio con su cobro.",
    bullets: ["Citas por barbero y por hora", "Clientes sin cita en dos toques", "Cobro al cerrar cada servicio"],
    shot: {
      src: "/landing/screens/agenda-desktop.webp",
      width: 1440,
      height: 900,
      alt: "Agenda de hoy en Businext: citas por hora con cliente, servicio, barbero e importe, las primeras ya cobradas",
    },
    phone: {
      src: "/landing/screens/agenda-mobile.webp",
      width: 390,
      height: 844,
      alt: "La agenda de hoy en el móvil",
    },
  },
  {
    id: "vista-reserva",
    eyebrow: "Reserva online",
    heading: ["Tus clientes reservan", "solos", "."],
    text: "Cada barbería tiene su página de reservas, con enlace y código QR. El cliente elige servicio, barbero y hora; tú recibes la solicitud y decides.",
    bullets: ["Enlace y QR para el escaparate", "Solo ve los huecos libres", "Tú aceptas o rechazas"],
    shot: {
      src: "/landing/screens/solicitudes-desktop.webp",
      width: 1440,
      height: 560,
      alt: "Tres solicitudes de reserva online pendientes, con servicio, barbero y botones para aceptar o rechazar",
    },
    phone: {
      src: "/landing/screens/reserva-mobile.webp",
      width: 390,
      height: 844,
      alt: "Página pública de reservas de la barbería en el móvil: el cliente elige el servicio y ve su precio",
    },
  },
  {
    id: "vista-finanzas",
    eyebrow: "Finanzas",
    heading: ["La caja, al", "céntimo", "."],
    text: "Lo que ha vendido hoy cada barbero, con su comisión calculada. Ingresos, gastos y balance del mes y del año, con gráficas que se entienden de un vistazo.",
    bullets: ["Ventas del día por barbero", "Comisiones calculadas solas", "Ganancias por servicio y producto"],
    shot: {
      src: "/landing/screens/finanzas-desktop.webp",
      width: 1440,
      height: 900,
      alt: "Finanzas: ventas del día por barbero, registros con comisiones y gráfica de ganancias por servicio",
    },
  },
  {
    id: "vista-resenas",
    eyebrow: "Reseñas",
    heading: ["Responde a cada reseña sin", "escribirla", "."],
    text: "Tus reseñas de Google, con la nota media, lo que más gusta y lo que hay que mejorar. La IA redacta la respuesta y tú la apruebas.",
    bullets: ["Nota y tendencia de tu perfil", "Resumen de lo positivo y lo negativo", "Respuestas redactadas por IA"],
    shot: {
      src: "/landing/screens/resenas-desktop.webp",
      width: 1440,
      height: 900,
      alt: "Panel de reseñas de Google con la nota media, métricas y reseñas con respuesta sugerida",
    },
  },
  {
    id: "vista-inteligencia",
    eyebrow: "Inteligencia",
    heading: ["Tu informe de cada", "semana", "."],
    text: "Qué ha ido bien, qué clientes llevan tiempo sin volver y cómo rinde cada barbero. Con recomendaciones concretas para la semana que empieza.",
    bullets: ["Resumen semanal automático", "Clientes en riesgo", "Rendimiento del equipo"],
    shot: {
      src: "/landing/screens/inteligencia-desktop.webp",
      width: 1440,
      height: 900,
      alt: "Informe semanal de inteligencia con resumen, recomendaciones y análisis de clientes",
    },
  },
];

export const STEPS = [
  { title: "Crea tu cuenta", text: "Desde el móvil o el ordenador. Sin instalar nada y con el primer mes gratis." },
  { title: "Configura tu barbería", text: "Servicios, precios, horarios y barberos. Menos de diez minutos." },
  { title: "Comparte tu enlace", text: "Pon el QR en el espejo y el enlace en Instagram. Las reservas empiezan a entrar." },
];
