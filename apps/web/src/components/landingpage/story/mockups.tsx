// Previews of the app screens each chapter talks about. They reuse the app's own tokens so
// they read as the real product, and every one says it shows example data.

import type { ReactNode } from "react";
import {
  Bell,
  CalendarCheck,
  Check,
  CircleCheck,
  Clock,
  Layers,
  MessageCircle,
  QrCode,
  Sparkles,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

function Frame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="m-0">
      <div className="rounded-3xl border border-border bg-surface/85 p-4 shadow-lg backdrop-blur-md sm:p-5">{children}</div>
      <figcaption className="mt-2 text-caption text-foreground-subtle">{caption}</figcaption>
    </figure>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="mb-6 text-body text-foreground-muted md:text-[1.0625rem]">{children}</p>;
}

export function ChaosList() {
  const pains = [
    { icon: MessageCircle, text: "Mensajes de citas a cualquier hora" },
    { icon: CalendarCheck, text: "Agenda de papel con huecos y tachones" },
    { icon: Wallet, text: "La caja, a ojo y al final del día" },
    { icon: Clock, text: "Domingos cuadrando cuentas" },
  ];
  return (
    <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
      {pains.map(({ icon: Icon, text }) => (
        <li key={text} className="flex items-center gap-3 rounded-2xl border border-border bg-surface/70 px-4 py-3 text-body-sm text-foreground">
          <Icon aria-hidden className="h-4 w-4 shrink-0 text-warning" />
          {text}
        </li>
      ))}
    </ul>
  );
}

export function BookingMock() {
  return (
    <Frame caption="Vista previa de Notificaciones › Solicitudes de reserva. Datos de ejemplo.">
      <div className="mb-3 flex items-center justify-between">
        <p className="m-0 flex items-center gap-2 text-label font-semibold text-foreground">
          <Bell aria-hidden className="h-4 w-4 text-primary" /> Nueva solicitud
        </p>
        <span className="text-caption text-foreground-subtle">ahora</span>
      </div>
      <div className="rounded-2xl bg-surface-raised p-4">
        <p className="m-0 font-heading text-h4 font-semibold text-foreground">Carlos M.</p>
        <p className="m-0 mt-1 text-body-sm text-foreground-muted">Degradado + barba · 45 min</p>
        <p className="m-0 mt-1 text-body-sm text-foreground-muted">Hoy, 18:30 · con Álex</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-label font-semibold text-primary-foreground">
            <Check aria-hidden className="h-4 w-4" /> Aceptar
          </span>
          <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-label font-semibold text-foreground">
            <X aria-hidden className="h-4 w-4" /> Rechazar
          </span>
        </div>
      </div>
      <p className="m-0 mt-3 flex items-center gap-2 text-caption text-foreground-muted">
        <QrCode aria-hidden className="h-4 w-4 text-primary" /> Llegó desde el enlace y el QR de tu barbería
      </p>
    </Frame>
  );
}

export function FinanceMock() {
  // Example week; the last bar is today, which just grew with the completed booking.
  const week = [62, 48, 75, 58, 90, 100];
  const days = ["L", "M", "X", "J", "V", "S"];
  return (
    <Frame caption="Vista previa de Reservas › Completar y Finanzas › Caja del día. Datos de ejemplo.">
      <div className="flex items-center gap-3 rounded-2xl bg-surface-raised p-4">
        <CircleCheck aria-hidden className="h-6 w-6 shrink-0 text-success" />
        <div className="min-w-0 flex-1">
          <p className="m-0 text-label font-semibold text-foreground">Reserva completada</p>
          <p className="m-0 text-body-sm text-foreground-muted">Degradado + barba · Carlos M.</p>
        </div>
        <p className="m-0 font-heading text-h4 font-bold text-success">+18,00 €</p>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="m-0 text-caption uppercase tracking-[0.12em] text-foreground-subtle">Caja de hoy</p>
          <p className="m-0 font-heading text-h2 font-bold text-foreground">246,00 €</p>
          <p className="m-0 flex items-center gap-1 text-caption text-success">
            <TrendingUp aria-hidden className="h-3.5 w-3.5" /> registrada automáticamente
          </p>
        </div>
        <div className="flex h-20 items-end gap-1.5" aria-hidden>
          {week.map((h, i) => (
            <div key={days[i]} className="flex flex-col items-center gap-1">
              <div
                className={`w-4 rounded-md ${i === week.length - 1 ? "bg-primary" : "bg-accent-hover"}`}
                style={{ height: `${h * 0.6}px` }}
              />
              <span className="text-[0.625rem] text-foreground-subtle">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** The new feature: social trends + the barber's own data + a push telling when and what to post. */
export function TrendsMock() {
  const trends = [
    { name: "Antes y después en 15 s", source: "TikTok", growth: "+180 %" },
    { name: "Degradado bajo con textura", source: "Instagram", growth: "+95 %" },
    { name: "Transformación con audio en tendencia", source: "YouTube Shorts", growth: "+60 %" },
  ];
  return (
    <figure className="m-0">
      <ol className="m-0 grid list-none gap-3 p-0">
        <li className="rounded-3xl border border-border bg-surface/85 p-4 backdrop-blur-md">
          <p className="m-0 mb-3 flex items-center gap-2 text-label font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-caption text-primary">1</span>
            Radar de tendencias
          </p>
          <ul className="m-0 grid list-none gap-1.5 p-0">
            {trends.map((t) => (
              <li key={t.name} className="flex items-center justify-between gap-3 rounded-xl bg-surface-raised px-3 py-2">
                <span className="min-w-0">
                  <span className="block truncate text-body-sm text-foreground">{t.name}</span>
                  <span className="block text-caption text-foreground-subtle">{t.source}</span>
                </span>
                <span className="shrink-0 text-label font-semibold text-success">{t.growth}</span>
              </li>
            ))}
          </ul>
        </li>
        <li className="rounded-3xl border border-border bg-surface/85 p-4 backdrop-blur-md">
          <p className="m-0 mb-2 flex items-center gap-2 text-label font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-caption text-primary">2</span>
            Cruzado con tus datos
          </p>
          <p className="m-0 flex gap-2 text-body-sm text-foreground-muted">
            <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Tu servicio estrella es <strong className="text-foreground">degradado + barba</strong> y tus clientes reservan
              sobre todo de jueves a sábado por la tarde. Los antes y después de degradados están creciendo: es tu formato.
            </span>
          </p>
        </li>
        <li className="rounded-3xl border border-primary/60 bg-surface/90 p-4 shadow-glow-primary backdrop-blur-md">
          <p className="m-0 mb-2 flex items-center gap-2 text-label font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-caption text-primary-foreground">3</span>
            Te avisa en el momento
          </p>
          <div className="flex gap-3 rounded-2xl bg-surface-raised p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
              <Bell aria-hidden className="h-4 w-4 text-primary-foreground" />
            </span>
            <div className="min-w-0">
              <p className="m-0 flex justify-between gap-2 text-caption text-foreground-subtle">
                <span>Businext · Contenido</span>
                <span>17:45</span>
              </p>
              <p className="m-0 text-label font-semibold text-foreground">Publica hoy a las 19:30</p>
              <p className="m-0 text-body-sm text-foreground-muted">
                Reel vertical de 15 s: antes y después del degradado de las 18:30, con el audio en tendencia. Idea de texto
                incluida.
              </p>
            </div>
          </div>
        </li>
      </ol>
      <figcaption className="mt-2 text-caption text-foreground-subtle">
        Concepto de la próxima funcionalidad. Tendencias, porcentajes y horarios son de ejemplo.
      </figcaption>
    </figure>
  );
}

export function TimeList() {
  const items = [
    { task: "Confirmar citas", how: "Con un toque, desde la notificación" },
    { task: "Apuntar cada cobro", how: "Automático al completar la reserva" },
    { task: "Saber cómo fue la semana", how: "Informe con IA cada semana" },
    { task: "Pensar qué publicar", how: "Te lo propone el radar", upcoming: true },
  ];
  return (
    <ul className="m-0 grid list-none gap-2 p-0">
      {items.map((i) => (
        <li key={i.task} className="flex items-start gap-3 rounded-2xl border border-border bg-surface/80 px-4 py-3 backdrop-blur-md">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <span>
            <span className="block text-body-sm font-semibold text-foreground">{i.task}</span>
            <span className="block text-caption text-foreground-muted">
              {i.how}
              {i.upcoming && <span className="text-primary"> · próximamente</span>}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AssetsSteps() {
  const steps = [
    { icon: Layers, title: "Datos", text: "Qué servicio, qué día y qué barbero generan más." },
    { icon: TrendingUp, title: "Decisiones", text: "Precios, horarios y una silla más, con números." },
    { icon: Wallet, title: "Activos", text: "Equipo, marca propia y un segundo local." },
  ];
  return (
    <ol className="m-0 grid list-none gap-2 p-0 sm:grid-cols-3">
      {steps.map(({ icon: Icon, title, text }, i) => (
        <li key={title} className="rounded-2xl border border-border bg-surface/80 p-4 backdrop-blur-md">
          <p className="m-0 mb-1 flex items-center gap-2 text-label font-semibold text-foreground">
            <Icon aria-hidden className="h-4 w-4 text-primary" />
            <span className="sr-only">Paso {i + 1}: </span>
            {title}
          </p>
          <p className="m-0 text-caption text-foreground-muted">{text}</p>
        </li>
      ))}
    </ol>
  );
}
