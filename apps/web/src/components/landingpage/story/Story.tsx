"use client";

import { useEffect, useRef } from "react";

import { ACTS, STORY_FRAMES } from "./acts";
import s from "./story.module.css";

// VP9 where the browser has it (lighter per frame at this quality), H.264 everywhere else.
const CLIPS = [
  { src: "/story/story.webm", type: 'video/webm; codecs="vp9"' },
  { src: "/story/story.mp4", type: 'video/mp4; codecs="avc1.640028"' },
];
const FPS = 30;

/**
 * The narrative part of the landing: one pinned stage, one clip scrubbed by the scroll,
 * and the acts of the story scrolling over it. The clip advances with the finger, it
 * never plays on its own.
 *
 * The posters are the content and the fallback: server-rendered, and what stays if there
 * is no JavaScript, the clip has not loaded yet, or the visitor asked for less motion.
 */
export function Story() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const story = root.current;
    const clip = video.current;
    if (!story || !clip) return;

    const acts = [...story.querySelectorAll<HTMLElement>("[data-act]")];
    const posters = [...story.querySelectorAll<HTMLElement>("[data-poster]")];
    const pips = [...story.querySelectorAll<HTMLElement>("[data-pip]")];
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    story.classList.add(s.live);

    // A phone cannot keep up with a seek per scroll frame: each one decodes from the last
    // keyframe and they queue behind each other. So one seek in flight at a time; newer
    // targets replace the pending one. The clip carries a keyframe every sixth frame.
    let pending: number | undefined;
    let seeking = false;
    const drive = () => {
      if (pending === undefined || seeking) return;
      const target = pending;
      pending = undefined;
      if (Math.abs(clip.currentTime - target) < 1 / (FPS * 2)) return;
      seeking = true;
      clip.currentTime = target;
    };
    const onSeeked = () => {
      seeking = false;
      drive();
    };
    clip.addEventListener("seeked", onSeeked);

    let current = -1;
    let frame = 0;
    const sync = () => {
      frame = 0;
      const viewport = window.innerHeight;
      let onStage = -1;
      acts.forEach((act, index) => {
        const { top, height } = act.getBoundingClientRect();
        // The last act ends when the stage unpins, one screen before the act's own bottom.
        const span = index === acts.length - 1 ? Math.max(1, height - viewport) : height;
        const progress = Math.min(1, Math.max(0, -top / span));
        act.style.setProperty("--progress", progress.toFixed(3));

        // Exactly one act covers the top edge of the viewport: that one is on stage.
        const on = top <= 1 && top + span > 0;
        if (on) {
          onStage = index;
          if (current !== index) {
            current = index;
            posters.forEach((p, i) => (p.dataset.on = String(i === index)));
            pips.forEach((p, i) => p.setAttribute("aria-current", String(i === index)));
          }
          const [from, to] = ACTS[index].frames;
          const target = (from - 1 + progress * (to - from)) / FPS;
          if (clip.dataset.ready === "true") {
            pending = Math.min(target, (STORY_FRAMES - 1) / FPS);
            drive();
          }
        }
      });
      // The copy is pinned to the screen: off the story, no act may show it. The stage keeps
      // the last poster it had, so it reads right as it scrolls in or out.
      acts.forEach((a, i) => (a.dataset.on = String(i === onStage)));
    };

    const onScroll = () => {
      frame ||= requestAnimationFrame(sync);
    };

    // The clip is only fetched when the story is about to be reached, and never when the
    // visitor asked for less motion: then the posters tell it.
    let watcher: IntersectionObserver | undefined;
    if (!still) {
      clip.muted = true;
      clip.playsInline = true;
      const onLoaded = () => {
        // iOS will not paint a seeked frame of a clip that has never played.
        void clip.play().then(
          () => clip.pause(),
          () => {},
        );
        clip.dataset.ready = "true";
        sync();
      };
      clip.addEventListener("loadeddata", onLoaded, { once: true });
      watcher = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          const playable = CLIPS.find((c) => clip.canPlayType(c.type));
          if (playable) {
            // The whole clip is needed to scrub it: ask for all of it, not just the start.
            clip.preload = "auto";
            clip.src = playable.src;
            clip.load();
          }
          watcher?.disconnect();
        },
        { rootMargin: "100% 0px" },
      );
      watcher.observe(story);
    }

    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    sync();
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      clip.removeEventListener("seeked", onSeeked);
      watcher?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={root} className={s.story} aria-label="Cómo Businext cambia el día de tu barbería">
      <div className={s.stage}>
        <div className={s.screen}>
          {ACTS.map((act, index) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={act.id}
              data-poster
              data-on={index === 0 ? "true" : "false"}
              className={s.poster}
              src={act.poster}
              alt={act.posterAlt}
              width={720}
              height={1290}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          ))}
          <video ref={video} className={s.clip} muted playsInline preload="none" aria-hidden="true" />
        </div>

        <nav aria-label="Partes de la historia">
          <ol className={s.pips}>
            {ACTS.map((act, index) => (
              <li key={act.id}>
                <a
                  data-pip
                  className={s.pip}
                  href={`#${act.id}`}
                  aria-current={index === 0 ? "true" : "false"}
                  aria-label={`${act.label}: ${act.blurb}`}
                >
                  <span className={s.tip} aria-hidden="true">
                    <strong>{act.label}</strong>
                    <span>{act.blurb}</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className={s.acts}>
        {ACTS.map((act) => {
          const share = (act.frames[1] - act.frames[0] + 1) / STORY_FRAMES;
          return (
            <article
              key={act.id}
              id={act.id}
              data-act
              className={s.act}
              style={{ "--share": share.toFixed(4) } as React.CSSProperties}
            >
              <div className={s.copy}>
                <p className={s.eyebrow}>{act.eyebrow}</p>
                <h2 className={s.heading}>
                  {act.heading[0]} <span className={s.accent}>{act.heading[1]}</span>
                  {act.heading[2] && !/^[.,]/.test(act.heading[2]) ? " " : ""}
                  {act.heading[2]}
                </h2>
                <p className={s.body}>{act.body}</p>
                {act.points && (
                  <ul className={s.points}>
                    {act.points.map((point, i, all) => (
                      <li
                        key={point}
                        // Spread over the first half of the act, before the next one takes over.
                        style={{ "--at": (0.1 + (0.4 * i) / all.length).toFixed(3) } as React.CSSProperties}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
