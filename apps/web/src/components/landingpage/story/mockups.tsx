// Previews of the app screens each chapter talks about. They reuse the app's own tokens so
// they read as the real product. Kept visual on purpose: a few words, no paragraphs.
// The figcaption says it is example data; keep that when editing.

import type { ReactNode } from "react";
import {
  Bell,
  CalendarCheck,
  Check,
  CircleCheck,
  Clock,
  Layers,
  MessageCircle,
  Phone,
  QrCode,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

function Frame({ caption = "Datos de ejemplo", children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="m-0">
      <div className="rounded-3xl border border-border bg-surface/85 p-4 shadow-lg backdrop-blur-md">{children}</div>
      <figcaption className="mt-2 text-caption text-foreground-subtle">{caption}</figcaption>
    </figure>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="mb-5 text-body font-medium text-foreground-muted md:text-[1.0625rem]">{children}</p>;
}

/** Icon chips: the chapter is a feeling, not a list to read. */
function Chips({ items, tone }: { items: { icon: typeof Bell; text: string }[]; tone: string }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
      {items.map(({ icon: Icon, text }) => (
        <li
          key={text}
          className="flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-2 text-label text-foreground backdrop-blur-md"
        >
          <Icon aria-hidden className={`h-4 w-4 shrink-0 ${tone}`} />
          {text}
        </li>
      ))}
    </ul>
  );
}

export function ChaosList() {
  return (
    <Chips
      tone="text-warning"
      items={[
        { icon: MessageCircle, text: "+30 mensajes" },
        { icon: CalendarCheck, text: "Agenda de papel" },
        { icon: Wallet, text: "Caja a ojo" },
        { icon: Clock, text: "Sin domingos" },
      ]}
    />
  );
}

export function BookingMock() {
  return (
    <Frame>
      <p className="m-0 mb-3 flex items-center gap-2 text-label font-semibold text-foreground">
        <Bell aria-hidden className="h-4 w-4 text-primary" /> Nueva reserva
        <span className="ml-auto flex items-center gap-1 text-caption font-normal text-foreground-subtle">
          <QrCode aria-hidden className="h-3.5 w-3.5" /> QR
        </span>
      </p>
      <div className="rounded-2xl bg-surface-raised p-4">
        <p className="m-0 font-heading text-h4 font-semibold text-foreground">Carlos M.</p>
        <p className="m-0 mt-1 text-body-sm text-foreground-muted">Degradado + barba · Hoy 18:30</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-label font-semibold text-primary-foreground">
            <Check aria-hidden className="h-4 w-4" /> Aceptar
          </span>
          <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-label font-semibold text-foreground">
            <X aria-hidden className="h-4 w-4" /> Rechazar
          </span>
        </div>
      </div>
    </Frame>
  );
}

/** Planned feature: an AI voice agent that answers the shop's phone and books the call. */
export function CallMock() {
  // Waveform heights of the live call, purely decorative.
  const wave = [30, 55, 80, 45, 95, 60, 35, 70, 50, 85, 40, 65, 30];
  return (
    <Frame caption="Concepto · datos de ejemplo">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-glow-primary">
          <Phone aria-hidden className="h-5 w-5 text-primary-foreground" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="m-0 text-label font-semibold text-foreground">Llamada · contesta la IA</p>
          <p className="m-0 text-caption text-foreground-muted">+34 6•• ••• 412 · 0:42</p>
        </div>
      </div>
      <div className="my-4 flex h-12 items-center justify-center gap-1" aria-hidden>
        {wave.map((h, i) => (
          <span
            key={i}
            className="call-wave w-1.5 rounded-full bg-primary"
            style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
      <p className="m-0 flex items-center gap-2 rounded-2xl bg-surface-raised px-4 py-3 text-label font-semibold text-foreground">
        <CircleCheck aria-hidden className="h-5 w-5 shrink-0 text-success" />
        Cita creada · Mañana 11:00
      </p>
    </Frame>
  );
}

export function FinanceMock() {
  // Example week; the last bar is today, which just grew with the completed booking.
  const week = [62, 48, 75, 58, 90, 100];
  const days = ["L", "M", "X", "J", "V", "S"];
  return (
    <Frame>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="m-0 flex items-center gap-1.5 text-label font-semibold text-success">
            <CircleCheck aria-hidden className="h-4 w-4" /> +18,00 €
          </p>
          <p className="m-0 mt-2 text-caption uppercase tracking-[0.12em] text-foreground-subtle">Caja de hoy</p>
          <p className="m-0 font-heading text-h2 font-bold text-foreground">246,00 €</p>
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

/** Planned feature: social trends + the barber's own data + a push telling when and what to post. */
export function TrendsMock() {
  const trends = [
    { name: "Antes y después", source: "TikTok", growth: "+180 %" },
    { name: "Degradado bajo", source: "Instagram", growth: "+95 %" },
  ];
  return (
    <Frame caption="Concepto · datos de ejemplo">
      <ul className="m-0 grid list-none gap-1.5 p-0">
        {trends.map((t) => (
          <li key={t.name} className="flex items-center justify-between gap-3 rounded-xl bg-surface-raised px-3 py-2">
            <span className="text-body-sm text-foreground">
              {t.name} <span className="text-caption text-foreground-subtle">· {t.source}</span>
            </span>
            <span className="shrink-0 text-label font-semibold text-success">{t.growth}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-primary/60 bg-surface-raised p-3 shadow-glow-primary">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Bell aria-hidden className="h-4 w-4 text-primary-foreground" />
        </span>
        <p className="m-0 text-label font-semibold text-foreground">
          Publica hoy, 19:30
          <span className="block text-caption font-normal text-foreground-muted">Reel 15 s · antes y después</span>
        </p>
      </div>
    </Frame>
  );
}

export function TimeList() {
  return (
    <Chips
      tone="text-success"
      items={[
        { icon: Check, text: "Citas" },
        { icon: Check, text: "Llamadas" },
        { icon: Check, text: "Cobros" },
        { icon: Check, text: "Informe semanal" },
      ]}
    />
  );
}

export function AssetsSteps() {
  return (
    <Chips
      tone="text-primary"
      items={[
        { icon: Layers, text: "Datos" },
        { icon: TrendingUp, text: "Decisiones" },
        { icon: Wallet, text: "Activos" },
      ]}
    />
  );
}
