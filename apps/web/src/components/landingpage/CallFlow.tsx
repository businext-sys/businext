"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { Wave } from "./AppScreens";
import { COPY, type Lang } from "./content";

const CYCLE_MS = 11000;
const lineStep = 2.8;

/**
 * A call the voice assistant takes, and the booking it leaves in the agenda. At rest every line
 * is there; while the block is on screen the conversation plays again every cycle.
 */
export function CallFlow({ lang }: { lang: Lang }) {
  const t = COPY[lang].calls;
  const root = useRef<HTMLDivElement>(null);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (!entry?.isIntersecting) return;
        setCycle((c) => c + 1);
        timer = window.setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
      },
      { threshold: 0.35 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const playing = cycle > 0 ? "landing-piece" : "";
  const step = (i: number) => ({ "--d": 0.5 + i * lineStep }) as CSSProperties;

  return (
    <div ref={root}>
      <div key={cycle} className="grid items-center gap-4 lg:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)]">
        <div className="flex flex-col gap-3 rounded-xl bg-surface p-[22px]" aria-label={t.callLabel}>
          <div className="flex items-center gap-3 border-b border-border-subtle pb-3.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny static avatar */}
            <img src="/avatar-asistente.jpg" alt={t.avatarAlt} width={48} height={48} className="h-12 w-12 rounded-full border-2 border-primary object-cover" />
            <span>
              <b className="block leading-tight text-foreground">{t.assistantName}</b>
              <span className="text-caption text-success">{t.inProgress}</span>
            </span>
            <Wave bars={14} className="ml-auto h-[22px] text-[14px]" />
          </div>
          {t.lines.map((line, i) => (
            <p
              key={line.text}
              className={`m-0 max-w-[86%] rounded-[0.875rem] px-[13px] py-2.5 text-body-sm ${
                line.who === "assistant"
                  ? "self-end rounded-br-[4px] bg-accent text-accent-foreground"
                  : "self-start rounded-bl-[4px] bg-surface-raised text-foreground"
              } ${playing}`}
              style={step(i)}
            >
              <span className="block text-caption font-bold text-secondary">{line.who === "assistant" ? t.assistant : t.client}</span>
              {line.text}
            </p>
          ))}
        </div>

        <ArrowRight aria-hidden className="mx-auto h-12 w-12 rotate-90 text-primary lg:rotate-0" strokeWidth={1.5} />

        <div className="flex flex-col gap-2 rounded-xl bg-surface p-[22px]" aria-label={t.agendaLabel}>
          <p className="m-0 text-caption font-bold uppercase tracking-[0.1em] text-secondary">{t.agenda}</p>
          <p className="m-0 font-heading text-[30px] font-extrabold uppercase leading-none text-foreground">Álex</p>
          {t.slots.map(([time, who]) => (
            <p key={time} className="m-0 flex items-center gap-3.5 rounded-lg bg-surface-raised px-3.5 py-3 text-body-sm">
              <b className="w-[46px] tabular-nums text-foreground">{time}</b>
              <span className="text-foreground-muted">{who}</span>
            </p>
          ))}
          <p className={`m-0 flex items-center gap-3.5 rounded-lg bg-accent px-3.5 py-3 text-body-sm text-accent-foreground ${playing}`} style={step(t.lines.length)}>
            <b className="w-[46px] tabular-nums">18:30</b>
            <span className="min-w-0">{t.booked}</span>
            <span className="ml-auto whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-caption font-bold text-primary-foreground">{t.bookedTag}</span>
          </p>
          <p className="m-0 flex items-center gap-3.5 rounded-lg border border-dashed border-border px-3.5 py-3 text-body-sm text-foreground-subtle">
            <b className="w-[46px] tabular-nums">19:15</b>
            {t.free}
          </p>
        </div>
      </div>
    </div>
  );
}
