"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Phone as PhoneIcon, Star, TrendingUp, type LucideIcon } from "lucide-react";
import { Phone } from "./AppScreens";
import { COPY, type Lang, type ScreenId } from "./content";

const BEAT_MS = 4600;
const TOAST_DELAY_MS = 900;
const ICONS: Record<ScreenId, LucideIcon> = { call: PhoneIcon, request: MessageSquare, review: Star, chat: TrendingUp, till: TrendingUp };

/** The app layer over the hero scene: the phone walks through one feature per beat and its notification slides in beside it. */
export function HeroShowcase({ lang }: { lang: Lang }) {
  const t = COPY[lang].hero;
  const [beat, setBeat] = useState(0);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = window.setTimeout(() => setToastShown(true), still ? 0 : TOAST_DELAY_MS);
    const next = still
      ? undefined
      : window.setTimeout(() => {
          setToastShown(false);
          setBeat((beat + 1) % t.beats.length);
        }, BEAT_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(next);
    };
  }, [beat, t.beats.length]);

  function go(i: number) {
    setToastShown(false);
    setBeat(i);
  }

  const { screen, title, text } = t.beats[beat]!;
  const Icon = ICONS[screen];

  return (
    <>
      <Phone
        lang={lang}
        screen={screen}
        className="absolute bottom-[30px] right-4 z-10 w-[168px] lg:bottom-auto lg:right-[5%] lg:top-1/2 lg:w-[clamp(220px,19vw,280px)] lg:-translate-y-1/2"
      />
      <div
        aria-hidden
        className={`landing-toast absolute left-4 top-[18px] z-20 flex w-[min(290px,calc(100%-2rem))] items-center gap-3 rounded-[0.875rem] border border-border bg-surface px-3.5 py-3 text-body-sm leading-snug lg:left-auto lg:right-[calc(5%+clamp(220px,19vw,280px)-36px)] lg:top-[64%] lg:w-[300px]${toastShown ? " is-shown" : ""}`}
      >
        <span className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] bg-accent text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <span className="min-w-0">
          <span className="flex justify-between gap-2 text-caption font-bold text-foreground">
            {title}
            <span className="font-normal text-foreground-subtle">{t.now}</span>
          </span>
          <span className="block text-foreground-muted">{text}</span>
        </span>
      </div>
      <div className="absolute bottom-3 right-4 z-20 flex w-[168px] justify-center gap-1.5 lg:bottom-[22px] lg:right-[5%] lg:w-[clamp(220px,19vw,280px)]">
        {t.beats.map((b, i) => (
          <button
            key={b.screen}
            type="button"
            aria-label={`${t.show}: ${b.title}`}
            aria-pressed={i === beat}
            onClick={() => go(i)}
            className="flex h-6 w-8 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className={`h-1 w-full rounded-full ${i === beat ? "bg-primary" : "bg-border"}`} />
          </button>
        ))}
      </div>
    </>
  );
}
