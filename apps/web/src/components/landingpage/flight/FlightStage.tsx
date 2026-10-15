"use client";

import { useEffect, useRef } from "react";
import type { Stop } from "./stops";

/**
 * One pinned stage the whole story flies through, as in businext-web-system's narrative
 * template. Only the stop covering the top of the viewport is on show, so two moments of
 * the shot are never on screen at once.
 *
 * The plate is the content and the fallback: server-rendered, the clip's poster, and what
 * stays without JavaScript, without the clip, or with a request for less motion. Each
 * stop's progress scrubs the leg to the next plate; the clip advances, it never plays.
 */
export function FlightStage({ stops }: { stops: Stop[] }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = stage.current;
    if (!root) return;
    const sections = [...document.querySelectorAll<HTMLElement>("section.flight-stop")];
    const panels = [...root.querySelectorAll<HTMLElement>(".flight-panel")];
    const pips = [...document.querySelectorAll<HTMLElement>(".flight-pip")];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.matchMedia("(max-width: 47.99rem)");

    // A phone cannot keep up with a seek per scroll frame: each one decodes from the last
    // keyframe and they queue. At most one seek in flight per clip; newer targets replace
    // the pending one and the clip jumps to wherever the scroll is when it lands.
    const pending = new WeakMap<HTMLVideoElement, number>();
    const seeking = new WeakSet<HTMLVideoElement>();
    const drive = (video: HTMLVideoElement) => {
      const target = pending.get(video);
      if (target === undefined || seeking.has(video)) return;
      pending.delete(video);
      if (Math.abs(video.currentTime - target) < 1 / 48) return;
      seeking.add(video);
      video.currentTime = target;
    };
    const onSeeked = (event: Event) => {
      const video = event.target as HTMLVideoElement;
      seeking.delete(video);
      drive(video);
    };
    root.addEventListener("seeked", onSeeked, true);

    // iOS will not paint a seeked frame of a clip that has never played.
    root.querySelectorAll("video").forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.addEventListener(
        "loadeddata",
        () => {
          if (phone.matches) void video.play().then(() => video.pause(), () => {});
        },
        { once: true },
      );
    });

    let frame = 0;
    const sync = () => {
      frame = 0;
      const last = sections.at(-1)?.getBoundingClientRect();
      document.documentElement.classList.toggle("flight-landed", Boolean(last && last.bottom <= 0));

      sections.forEach((section, index) => {
        const { top, height } = section.getBoundingClientRect();
        const panel = panels[index];
        if (!panel) return;
        const on = top <= 1 && top + height > 0;
        section.classList.toggle("is-on", on);
        panel.classList.toggle("is-on", on);
        if (on) pips.forEach((pip, i) => pip.setAttribute("aria-current", i === index ? "true" : "false"));

        const progress = Math.min(1, Math.max(0, -top / height));
        section.style.setProperty("--progress", progress.toFixed(3));

        const video = panel.querySelector("video");
        if (video && !still && !video.src && Math.abs(top) < height * 2) {
          const src = phone.matches ? video.dataset.clipMobile : video.dataset.clipDesktop;
          if (src) {
            video.src = src;
            video.load();
          }
        }
        if (!video?.duration) return;
        video.classList.add("is-ready");
        const target = progress * video.duration;
        if (!phone.matches) video.currentTime = target;
        else if (on || Math.abs(top) < height) {
          pending.set(video, target);
          drive(video);
        }
      });
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(sync);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    root.addEventListener("loadeddata", sync, true);
    sync();
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      root.removeEventListener("seeked", onSeeked, true);
      root.removeEventListener("loadeddata", sync, true);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("flight-landed");
    };
  }, [stops]);

  return (
    <div className="flight-stage" ref={stage}>
      {stops.map((stop, index) => (
        <div className={`flight-panel${index === 0 ? " is-on" : ""}`} key={stop.id}>
          <picture>
            <source media="(max-width: 47.99rem)" srcSet={`/landing/${stop.plate}-mobile.webp`} width={768} height={1376} />
            <img
              src={`/landing/${stop.plate}-desktop.webp`}
              width={1376}
              height={768}
              alt={stop.alt}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
          </picture>
          {stop.leg && (
            <video
              data-clip-desktop={`/landing/video/${stop.leg}-desktop.webm`}
              data-clip-mobile={`/landing/video/${stop.leg}-mobile.mp4`}
              muted
              playsInline
              preload="none"
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}
