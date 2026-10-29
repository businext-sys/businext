"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "./AppScreens";
import { CHAPTERS } from "./content";

/**
 * The chapters of the app, one after another: each one's bar fills over six seconds and its
 * end moves to the next. The bars stop while the block is off screen.
 */
export function Walkthrough() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setOnScreen(Boolean(entry?.isIntersecting)), { threshold: 0.3 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  const chapter = CHAPTERS[active]!;

  return (
    <div ref={root} className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16">
      <div>
        <ol className="m-0 list-none p-0">
          {CHAPTERS.map((c, i) => (
            <li key={c.title} className="border-t border-border-subtle last:border-b">
              <button
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={`relative flex w-full items-baseline gap-[18px] py-[18px] text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  i === active ? "text-foreground" : "text-foreground-subtle hover:text-foreground-muted"
                }`}
              >
                <span className={`text-caption font-bold tabular-nums ${i === active ? "text-secondary" : ""}`}>0{i + 1}</span>
                <span className="font-heading text-[24px] font-extrabold uppercase leading-none lg:text-[30px]">{c.title}</span>
                {i === active && (
                  <span
                    aria-hidden
                    onAnimationEnd={() => setActive((active + 1) % CHAPTERS.length)}
                    className={`landing-progress absolute -top-px left-0 h-0.5 w-full bg-primary${onScreen ? "" : " is-paused"}`}
                  />
                )}
              </button>
            </li>
          ))}
        </ol>
        <p className="mb-0 mt-[22px] min-h-[52px] max-w-[460px] text-body text-foreground-muted" aria-live="polite">
          {chapter.caption}
        </p>
      </div>

      <div className="relative order-first aspect-[4/5] overflow-hidden rounded-xl border border-border-subtle lg:order-none lg:aspect-square">
        {CHAPTERS.map((c, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- plates are already sized WebP
          <img
            key={c.title}
            src={`/landing/${c.plate}-desktop.webp`}
            width={1376}
            height={768}
            alt=""
            loading="lazy"
            decoding="async"
            className={`landing-scene absolute inset-0 h-full w-full object-cover object-[72%_center] transition-opacity duration-700 lg:object-[78%_center] ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <Phone
          screen={chapter.screen}
          play={active}
          className="absolute left-[5%] top-1/2 w-[52%] -translate-y-1/2 lg:left-[7%] lg:w-[40%]"
        />
      </div>
    </div>
  );
}
