"use client";

import { useEffect, useRef, useState } from "react";
import { SCREENS } from "./screens";
import type { Stop } from "./stops";

export type Chapter = {
  stop: Stop;
  /** The stop before this one: its plate is where this chapter's clip starts. */
  from: Stop;
};

const DESKTOP = "(min-width: 48rem)";

function Copy({ stop }: { stop: Stop }) {
  return (
    <>
      <p className="mb-3 text-caption font-bold uppercase tracking-[0.2em] text-primary">{stop.eyebrow}</p>
      <h2
        id={`titulo-${stop.id}`}
        className="m-0 font-heading text-[clamp(1.875rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
      >
        {stop.title}{" "}
        <span className="block bg-[image:var(--gradient-text)] bg-clip-text text-transparent">{stop.accent}</span>
      </h2>
      <p className="mb-0 mt-4 max-w-md text-body text-foreground-muted md:text-[1.0625rem]">{stop.body}</p>
    </>
  );
}

/**
 * The four chapters after the hero. The page scrolls natively: nothing runs per scroll frame.
 * A chapter becomes active once, when it crosses the middle of the viewport, and that one change
 * swaps the scene, plays the clip that flies into it at its own speed and lets its app screen
 * assemble. On desktop the scene and the screen sit in one sticky stage beside the text; on a
 * phone each chapter carries its own.
 */
export function Story({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const previous = useRef(-1);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = [...(root.current?.querySelectorAll<HTMLElement>("[data-chapter]") ?? [])];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.chapter));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((item) => observer.observe(item));

    // The small mark in the navigation takes over once the hero's wordmark has gone.
    const hero = document.getElementById("inicio");
    const heroObserver = new IntersectionObserver(
      ([entry]) => document.documentElement.classList.toggle("past-hero", !entry?.isIntersecting),
      { rootMargin: "-20% 0px 0px 0px" },
    );
    if (hero) heroObserver.observe(hero);

    return () => {
      observer.disconnect();
      heroObserver.disconnect();
      document.documentElement.classList.remove("past-hero");
    };
  }, []);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scope = window.matchMedia(DESKTOP).matches ? "stage" : "inline";
    const videos = [...(root.current?.querySelectorAll<HTMLVideoElement>(`video[data-scope="${scope}"]`) ?? [])];
    const forward = active > previous.current;
    previous.current = active;

    videos.forEach((video, i) => {
      if (i === active + 1) video.preload = "auto";
      if (i !== active) return;
      if (still || !forward) {
        video.pause();
        video.classList.remove("is-playing");
        return;
      }
      video.currentTime = 0;
      video.play().then(
        () => video.classList.add("is-playing"),
        () => {},
      );
    });
  }, [active]);

  return (
    <div ref={root} className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-14 md:px-12">
      <ol className="m-0 list-none p-0">
        {chapters.map(({ stop, from }, i) => {
          const Screen = SCREENS[stop.screen];
          return (
            <li
              key={stop.id}
              id={stop.id}
              data-chapter={i}
              aria-labelledby={`titulo-${stop.id}`}
              className={`story-chapter flex flex-col justify-center gap-6 py-16 md:min-h-[88vh] md:py-0${active === i ? " is-active" : ""}`}
            >
              <div className="story-scene relative aspect-[4/5] overflow-hidden rounded-3xl border border-border md:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element -- plates are already sized WebP */}
                <img
                  src={`/landing/${stop.plate}-mobile.webp`}
                  width={768}
                  height={1376}
                  alt={stop.alt}
                  loading="lazy"
                  decoding="async"
                />
                {from.leg && (
                  <video
                    data-scope="inline"
                    src={`/landing/video/${from.leg}-mobile.mp4`}
                    poster={`/landing/${from.plate}-mobile.webp`}
                    muted
                    playsInline
                    preload="none"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="story-copy">
                <Copy stop={stop} />
              </div>
              <div className="md:hidden">
                <Screen />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="hidden md:block">
        <div className="story-stage sticky top-[12vh] h-[76vh] overflow-hidden rounded-3xl border border-border">
          {chapters.map(({ stop, from }, i) => (
            <div key={stop.id} className={`story-layer${active === i ? " is-active" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- plates are already sized WebP */}
              <img
                src={`/landing/${stop.plate}-desktop.webp`}
                width={1376}
                height={768}
                alt={stop.alt}
                loading="lazy"
                decoding="async"
              />
              {from.leg && (
                <video
                  data-scope="stage"
                  src={`/landing/video/${from.leg}-desktop.webm`}
                  muted
                  playsInline
                  preload={i === 0 ? "auto" : "none"}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
          <div className="story-screens absolute bottom-5 left-5 w-[min(24rem,calc(100%-2.5rem))]">
            {chapters.map(({ stop }, i) => {
              const Screen = SCREENS[stop.screen];
              return (
                <div key={stop.id} className={`story-screen${active === i ? " is-active" : ""}`} aria-hidden={active !== i}>
                  <Screen />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
