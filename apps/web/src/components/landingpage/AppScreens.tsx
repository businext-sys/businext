// The app as it looks on a phone, drawn with the app's own tokens. Each screen's pieces enter in
// --d order whenever the screen mounts, so remounting it (a new key) plays it again.

import type { CSSProperties, ReactNode } from "react";
import { COPY, type Copy, type Lang, type ScreenId } from "./content";

const AVATAR = "/avatar-asistente.jpg";

function Piece({ d, className = "", children }: { d: number; className?: string; children: ReactNode }) {
  return (
    <div className={`landing-piece ${className}`} style={{ "--d": d } as CSSProperties}>
      {children}
    </div>
  );
}

export function Wave({ bars, className = "" }: { bars: number; className?: string }) {
  return (
    <span aria-hidden className={`flex items-center gap-[0.18em] ${className}`}>
      {Array.from({ length: bars }, (_, i) => (
        <i
          key={i}
          className="landing-wave w-[0.22em] rounded-sm bg-primary"
          style={{ height: `${30 + Math.round(Math.abs(Math.sin(i * 1.7)) * 70)}%`, animationDelay: `${(i * 0.09).toFixed(2)}s` }}
        />
      ))}
    </span>
  );
}

function StatusBar({ time }: { time: string }) {
  return (
    <div className="flex justify-between px-[0.6em] text-[0.82em] font-bold text-foreground">
      <span>{time}</span>
      <span>5G</span>
    </div>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <span className="block text-[0.68em] font-bold uppercase tracking-[0.1em] text-secondary">{eyebrow}</span>
      <span className="block font-heading text-[1.55em] font-extrabold uppercase leading-none text-foreground">{title}</span>
    </>
  );
}

const bubble = "max-w-[86%] rounded-[0.875rem] px-[0.7em] py-[0.55em] text-[0.86em] leading-snug";
const fromClient = `${bubble} self-end rounded-br-[4px] bg-surface-raised text-foreground`;
const fromAssistant = `${bubble} self-start rounded-bl-[4px] bg-accent text-accent-foreground`;
const card = "rounded-lg bg-surface px-[0.75em] py-[0.65em] text-[0.84em] text-foreground";
const aiCard = "rounded-lg bg-accent px-[0.75em] py-[0.65em] text-[0.84em] text-accent-foreground";
const tag = "ml-auto whitespace-nowrap rounded-full bg-primary px-[0.55em] py-[0.15em] text-[0.78em] font-bold text-primary-foreground";
const tagData = "ml-auto whitespace-nowrap rounded-full bg-secondary px-[0.55em] py-[0.15em] text-[0.78em] font-bold text-secondary-foreground";
const sub = "block text-[0.88em] text-foreground-subtle";
const big = "font-heading text-[2.1em] font-extrabold leading-none";
const row = "flex items-center justify-between gap-[0.6em]";
const actions = "flex gap-[0.4em] text-center text-[0.9em] font-bold";
const action = "flex-1 rounded-md bg-surface-raised py-[0.5em] text-foreground";
const primaryAction = "landing-press flex-1 rounded-md bg-primary py-[0.5em] text-primary-foreground";
const slot = "flex items-center gap-[0.6em] rounded-lg bg-surface px-[0.65em] py-[0.5em] text-[0.84em] text-foreground";
const aiSlot = "flex items-center gap-[0.6em] rounded-lg bg-accent px-[0.65em] py-[0.5em] text-[0.84em] text-accent-foreground";

function Bars({ heights }: { heights: number[] }) {
  return (
    <span aria-hidden className="mt-[0.5em] flex h-[2.4em] items-end gap-[0.3em]">
      {heights.map((h, i) => (
        <i key={i} className={`flex-1 rounded-[3px] ${i === heights.length - 1 ? "bg-primary" : "bg-accent-hover"}`} style={{ height: `${h}%` }} />
      ))}
    </span>
  );
}

function Call({ t }: { t: Copy["screens"] }) {
  const c = t.call;
  return (
    <>
      <StatusBar time="11:20" />
      <Piece d={0} className="text-center">
        <span className="relative mx-auto mb-[0.2em] mt-[0.6em] block h-[6em] w-[6em]">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny static avatar */}
          <img src={AVATAR} alt="" className="h-full w-full rounded-full border-2 border-primary object-cover" />
          <i aria-hidden className="landing-ring absolute -inset-[0.5em] rounded-full border-2 border-primary" />
        </span>
        <span className="block text-[0.68em] font-bold uppercase tracking-[0.1em] text-secondary">{c.answering}</span>
        <span className="block font-heading text-[1.3em] font-extrabold uppercase leading-none text-foreground">+34 612 ·· ·· 18</span>
      </Piece>
      <Piece d={0.4} className="flex justify-center">
        <Wave bars={18} className="h-[1.8em]" />
      </Piece>
      <Piece d={1} className={fromClient}>{c.ask}</Piece>
      <Piece d={1.8} className={fromAssistant}>{c.offer}</Piece>
      <Piece d={2.6} className={fromClient}>{c.name}</Piece>
      <Piece d={3.4} className={aiCard}>
        <span className={row}>
          <b>{c.created}</b>
          <span className={tag}>{c.tag}</span>
        </span>
        <span className="block text-[0.88em]">{c.when}</span>
      </Piece>
    </>
  );
}

function Request({ t }: { t: Copy["screens"] }) {
  const r = t.request;
  return (
    <>
      <StatusBar time="13:05" />
      <Piece d={0}>
        <Heading eyebrow={r.eyebrow} title={r.title} />
      </Piece>
      <Piece d={0.7} className={card}>
        <span className={row}>
          <b>Marcos T.</b>
          <span className={tagData}>{r.tag}</span>
        </span>
        <span className={sub}>{r.detail}</span>
      </Piece>
      <Piece d={1.4} className={actions}>
        <span className={action}>{r.decline}</span>
        <span className={primaryAction} style={{ "--d": 2 } as CSSProperties}>
          {r.accept}
        </span>
      </Piece>
      <Piece d={2.8} className={aiCard}>
        <span className={row}>
          <b>{r.confirmed}</b>
          <span className={tag}>✓</span>
        </span>
        <span className="block text-[0.88em]">{r.emailed}</span>
      </Piece>
      <Piece d={3.5} className={aiSlot}>
        <b className="w-[2.8em]">17:00</b>
        {r.slot}
      </Piece>
    </>
  );
}

function Review({ t }: { t: Copy["screens"] }) {
  const r = t.review;
  return (
    <>
      <StatusBar time="16:40" />
      <Piece d={0}>
        <Heading eyebrow={r.eyebrow} title={r.title} />
      </Piece>
      <Piece d={0.7} className={card}>
        <span className={row}>
          <span className="grid h-[2.2em] w-[2.2em] shrink-0 place-items-center rounded-full bg-surface-raised text-[0.8em] font-bold">LG</span>
          <span className="flex-1">
            Lucía G.<span className={sub}>{r.ago}</span>
          </span>
          <span className="tracking-[0.1em] text-warning" aria-label={r.stars}>
            ★★★★★
          </span>
        </span>
        <span className="mt-[0.4em] block italic text-foreground-muted">{r.quote}</span>
      </Piece>
      <Piece d={1.8} className="rounded-lg border border-dashed border-border px-[0.7em] py-[0.6em] text-[0.84em] text-foreground-muted">
        <span className="mb-[0.2em] block text-[0.82em] font-bold uppercase tracking-[0.1em] text-secondary">{r.draft}</span>
        {r.reply}
      </Piece>
      <Piece d={2.6} className={actions}>
        <span className={action}>{r.edit}</span>
        <span className={primaryAction} style={{ "--d": 3.2 } as CSSProperties}>
          {r.copy}
        </span>
      </Piece>
    </>
  );
}

function Chat({ t }: { t: Copy["screens"] }) {
  const c = t.chat;
  return (
    <>
      <StatusBar time="21:15" />
      <div className="flex items-center gap-[0.6em] border-b border-border-subtle pb-[0.55em]">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static avatar */}
        <img src={AVATAR} alt="" className="h-[2.6em] w-[2.6em] rounded-full border-2 border-primary object-cover" />
        <span>
          <b className="block text-[0.95em] leading-tight text-foreground">{c.assistant}</b>
          <span className="flex items-center gap-[0.35em] text-[0.75em] text-success">
            <i aria-hidden className="h-[0.45em] w-[0.45em] rounded-full bg-success" /> {c.online}
          </span>
        </span>
      </div>
      <Piece d={0.3} className={fromClient}>{c.ask}</Piece>
      <Piece d={1.1} className={card}>
        <span className="block text-[0.82em] font-bold uppercase tracking-[0.1em] text-secondary">{c.lastWeek}</span>
        <span className={row}>
          <span className={big}>{c.total}</span>
          <span className="font-bold text-success">{c.growth}</span>
        </span>
        <Bars heights={[55, 45, 70, 52, 85, 100]} />
      </Piece>
      <Piece d={2} className={fromAssistant}>{c.answer}</Piece>
      <div className="mt-auto flex flex-wrap gap-[0.35em]">
        {c.chips.map((chip) => (
          <span key={chip} className="rounded-full border border-border-subtle bg-muted px-[0.65em] py-[0.35em] text-[0.74em] text-muted-foreground">
            {chip}
          </span>
        ))}
      </div>
    </>
  );
}

function Till({ t }: { t: Copy["screens"] }) {
  const c = t.till;
  const [lastTime, lastWho, lastAmount] = c.last;
  return (
    <>
      <StatusBar time="20:45" />
      <Piece d={0}>
        <Heading eyebrow={c.eyebrow} title={c.title} />
      </Piece>
      {c.rows.map(([time, who, amount], i) => (
        <Piece key={time} d={0.5 + i * 0.3} className={slot}>
          <b className="w-[2.8em]">{time}</b>
          {who}
          <span className={tagData}>{amount}</span>
        </Piece>
      ))}
      <Piece d={1.1} className={aiSlot}>
        <b className="w-[2.8em]">{lastTime}</b>
        {lastWho}
        <span className={tag}>{lastAmount}</span>
      </Piece>
      <Piece d={2} className={card}>
        <span className="block text-[0.82em] font-bold uppercase tracking-[0.1em] text-secondary">{c.total}</span>
        <span className={row}>
          <span className={big}>{c.amount}</span>
          <span className="font-bold text-success">{c.growth}</span>
        </span>
        <Bars heights={[62, 48, 75, 58, 90, 100]} />
      </Piece>
    </>
  );
}

const SCREENS: Record<ScreenId, (props: { t: Copy["screens"] }) => ReactNode> = { call: Call, request: Request, review: Review, chat: Chat, till: Till };

/** A phone showing one screen of the app. Change `play` to play the screen again. */
export function Phone({ lang, screen, play = 0, className = "" }: { lang: Lang; screen: ScreenId; play?: number; className?: string }) {
  const Screen = SCREENS[screen];
  return (
    <div aria-hidden className={`landing-phone ${className}`}>
      <div className="landing-phone-screen">
        <div key={`${screen}-${play}`} className="absolute inset-0 flex flex-col gap-[0.75em] px-[0.95em] pb-[1.2em] pt-[1.1em]">
          <Screen t={COPY[lang].screens} />
        </div>
      </div>
    </div>
  );
}
