// App screens that arrive piece by piece while their stop is scrolled through. They reuse the
// app's own tokens so they read as the real product, and every one says it shows example data.
// Each piece has an `at`: the share of the stop's progress at which it lands (see .ui-item).

import type { CSSProperties, ReactNode } from "react";
import {
  Bell,
  CalendarCheck,
  CircleCheck,
  Instagram,
  MessageSquareText,
  Phone,
  Send,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { ScreenId } from "./stops";

function Item({ at, className = "", children }: { at: number; className?: string; children: ReactNode }) {
  return (
    <div className={`ui-item ${className}`} style={{ "--at": at } as CSSProperties}>
      {children}
    </div>
  );
}

function Screen({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="ui-item m-0 w-full" style={{ "--at": -0.04 } as CSSProperties}>
      <div className="grid gap-2 rounded-3xl border border-border bg-surface/90 p-3 shadow-lg backdrop-blur-md sm:p-4">
        {children}
      </div>
      <figcaption className="mt-1.5 text-caption text-foreground-subtle">{caption}</figcaption>
    </figure>
  );
}

const card = "rounded-2xl bg-surface-raised px-3 py-2.5";

function Overview() {
  const pillars = [
    { icon: Phone, text: "Asistente telefónico con IA" },
    { icon: TrendingUp, text: "Tendencias y publicación automática" },
    { icon: Bell, text: "Avisos en tiempo real" },
    { icon: Wallet, text: "Reservas y caja" },
  ];
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0">
      {pillars.map(({ icon: Icon, text }, i) => (
        <li key={text} className="contents">
          <Item at={0.04 + i * 0.07} className="flex items-center gap-2 rounded-2xl border border-border bg-surface/80 px-3 py-2.5 backdrop-blur-md">
            <Icon aria-hidden className="h-4 w-4 shrink-0 text-primary" />
            <span className="text-body-sm text-foreground">{text}</span>
          </Item>
        </li>
      ))}
    </ul>
  );
}

function Call() {
  const lines = [
    { who: "client", text: "Hola, ¿tenéis hueco hoy para degradado y barba?" },
    { who: "ai", text: "Sí, a las 18:30 con Álex. ¿Te lo reservo a tu nombre?" },
    { who: "client", text: "Perfecto, soy Carlos." },
  ];
  return (
    <Screen caption="Vista previa del asistente telefónico. Llamada y datos de ejemplo.">
      <Item at={0.02} className="flex items-center justify-between">
        <p className="m-0 flex items-center gap-2 text-label font-semibold text-foreground">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
            <Phone aria-hidden className="h-3.5 w-3.5 text-primary-foreground" />
          </span>
          Llamada atendida por la IA
        </p>
        <span className="text-caption text-success">● en curso</span>
      </Item>
      {lines.map((line, i) => (
        <Item
          key={line.text}
          at={0.12 + i * 0.12}
          className={`max-w-[85%] rounded-2xl px-3 py-2 text-body-sm ${
            line.who === "ai" ? "justify-self-end bg-accent text-accent-foreground" : "bg-surface-raised text-foreground"
          }`}
        >
          {line.text}
        </Item>
      ))}
      <Item at={0.5} className="flex items-center gap-3 rounded-2xl border border-primary/60 bg-surface-raised px-3 py-2.5">
        <CalendarCheck aria-hidden className="h-5 w-5 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block text-label font-semibold text-foreground">Reserva creada</span>
          <span className="block text-caption text-foreground-muted">Carlos · Degradado + barba · Hoy 18:30 · Álex</span>
        </span>
      </Item>
    </Screen>
  );
}

function Trends() {
  const trends = [
    { name: "Antes y después en 15 s", source: "TikTok", growth: 180 },
    { name: "Degradado bajo con textura", source: "Instagram", growth: 95 },
    { name: "Transformación con audio viral", source: "YouTube Shorts", growth: 60 },
  ];
  return (
    <Screen caption="Vista previa de Tendencias y contenido. Tendencias y porcentajes de ejemplo.">
      <Item at={0.02} className="flex items-center gap-2 text-label font-semibold text-foreground">
        <TrendingUp aria-hidden className="h-4 w-4 text-primary" /> Creciendo esta semana
      </Item>
      {trends.map((t, i) => (
        <Item key={t.name} at={0.1 + i * 0.08} className={card}>
          <span className="flex items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block truncate text-body-sm text-foreground">{t.name}</span>
              <span className="block text-caption text-foreground-subtle">{t.source}</span>
            </span>
            <span className="shrink-0 text-label font-semibold text-success">+{t.growth} %</span>
          </span>
          <span aria-hidden className="mt-1.5 block h-1 overflow-hidden rounded-full bg-accent">
            <span className="ui-bar block h-full rounded-full bg-primary" style={{ "--w": t.growth / 180 } as CSSProperties} />
          </span>
        </Item>
      ))}
      <Item at={0.42} className="flex gap-2 text-body-sm text-foreground-muted">
        <Sparkles aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>
          Tu servicio estrella es <strong className="text-foreground">degradado + barba</strong>: graba el antes y después del
          de las 18:30.
        </span>
      </Item>
      <Item at={0.54} className="flex items-center gap-3 rounded-2xl border border-primary/60 bg-surface-raised px-3 py-2.5">
        <Send aria-hidden className="h-5 w-5 shrink-0 text-primary" />
        <span className="min-w-0 flex-1">
          <span className="block text-label font-semibold text-foreground">Publicación programada · hoy 19:30</span>
          <span className="flex items-center gap-1 text-caption text-foreground-muted">
            <Instagram aria-hidden className="h-3.5 w-3.5" /> Reel de 15 s · Instagram y TikTok
          </span>
        </span>
        <span className="rounded-full bg-primary px-2 py-0.5 text-caption font-semibold text-primary-foreground">Auto</span>
      </Item>
    </Screen>
  );
}

function Control() {
  const alerts = [
    { icon: CalendarCheck, title: "La IA reservó a Carlos", text: "Degradado + barba · hoy 18:30", time: "18:02" },
    { icon: Bell, title: "Cancelación a las 19:00", text: "Hueco ofrecido a tu lista de espera", time: "18:20" },
    { icon: Instagram, title: "Reel publicado", text: "1.240 reproducciones en la primera hora", time: "20:31" },
  ];
  return (
    <Screen caption="Vista previa de Notificaciones y del asistente. Datos de ejemplo.">
      {alerts.map(({ icon: Icon, title, text, time }, i) => (
        <Item key={title} at={0.04 + i * 0.1} className="flex gap-3 rounded-2xl bg-surface-raised p-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary">
            <Icon aria-hidden className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex justify-between gap-2 text-label font-semibold text-foreground">
              {title}
              <span className="text-caption font-normal text-foreground-subtle">{time}</span>
            </span>
            <span className="block text-caption text-foreground-muted">{text}</span>
          </span>
        </Item>
      ))}
      <Item at={0.38} className="flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-body-sm text-foreground">
        <MessageSquareText aria-hidden className="h-4 w-4 shrink-0 text-primary" />
        ¿Cuánto llevo esta semana?
      </Item>
      <Item at={0.5} className="justify-self-end rounded-2xl bg-accent px-3 py-2 text-body-sm text-accent-foreground">
        1.384 €, un 12 % más que la semana pasada.
      </Item>
    </Screen>
  );
}

function Till() {
  const slots = [
    { time: "17:00", who: "Javi R. · Corte", tone: "bg-accent-hover" },
    { time: "17:45", who: "Marcos T. · Barba", tone: "bg-accent-hover" },
    { time: "18:30", who: "Carlos M. · Degradado + barba", tone: "bg-primary" },
  ];
  const week = [62, 48, 75, 58, 90, 100];
  return (
    <Screen caption="Vista previa de Reservas y Finanzas. Datos de ejemplo.">
      {slots.map((s, i) => (
        <Item key={s.time} at={0.04 + i * 0.07} className="flex items-center gap-3 rounded-xl bg-surface-raised px-3 py-2">
          <span className={`h-6 w-1 rounded-full ${s.tone}`} aria-hidden />
          <span className="w-11 text-label font-semibold text-foreground">{s.time}</span>
          <span className="truncate text-body-sm text-foreground-muted">{s.who}</span>
        </Item>
      ))}
      <Item at={0.3} className="flex items-center gap-3 rounded-2xl border border-success/50 bg-surface-raised px-3 py-2.5">
        <CircleCheck aria-hidden className="h-5 w-5 shrink-0 text-success" />
        <span className="flex-1 text-label font-semibold text-foreground">Reserva completada</span>
        <span className="font-heading text-h4 font-bold text-success">+18,00 €</span>
      </Item>
      <Item at={0.42} className="flex items-end justify-between gap-4 px-1">
        <span>
          <span className="block text-caption uppercase tracking-[0.12em] text-foreground-subtle">Caja de hoy</span>
          <span className="block font-heading text-h2 font-bold text-foreground">246,00 €</span>
        </span>
        <span className="flex h-14 items-end gap-1.5" aria-hidden>
          {week.map((h, i) => (
            <span
              key={i}
              className={`ui-bar-v w-3.5 rounded-md ${i === week.length - 1 ? "bg-primary" : "bg-accent-hover"}`}
              style={{ "--h": h / 100 } as CSSProperties}
            />
          ))}
        </span>
      </Item>
    </Screen>
  );
}

export const SCREENS: Record<ScreenId, () => ReactNode> = {
  overview: Overview,
  call: Call,
  trends: Trends,
  control: Control,
  till: Till,
};
