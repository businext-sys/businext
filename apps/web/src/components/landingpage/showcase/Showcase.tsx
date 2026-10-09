"use client";

import { useEffect, useRef } from "react";

import { SCREENS, STEPS, type Screen } from "./screens";
import s from "./showcase.module.css";

function Heading({ parts, id }: { parts: Screen["heading"]; id?: string }) {
  const [before, accent, after = ""] = parts;
  return (
    <h3 id={id} className={s.heading}>
      {before} <span className={s.accent}>{accent}</span>
      {after && !/^[.,]/.test(after) ? " " : ""}
      {after}
    </h3>
  );
}

/**
 * The descriptive half of the landing: what each part of the app looks like, with real
 * captures. It scrolls like any page, so each block animates when it reaches the screen,
 * and stays in once it has.
 */
export function Showcase() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const blocks = root.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!blocks) return;
    root.current?.classList.add(s.live);
    const watcher = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-visible", "true");
          watcher.unobserve(entry.target);
        }
      },
      { threshold: 0.2 },
    );
    blocks.forEach((block) => watcher.observe(block));
    return () => watcher.disconnect();
  }, []);

  return (
    <section ref={root} className={s.showcase} aria-labelledby="showcase-title">
      <header className={s.intro}>
        <p className={s.eyebrow}>Por dentro</p>
        <h2 id="showcase-title" className={s.title}>
          Así se ve Businext <span className={s.accent}>trabajando</span>.
        </h2>
        <p className={s.lead}>
          Capturas reales de la aplicación con los datos de una barbería de ejemplo. Lo mismo que verás tú desde el primer
          día, en el ordenador o en el móvil.
        </p>
      </header>

      {SCREENS.map((screen, index) => (
        <article
          key={screen.id}
          id={screen.id}
          data-reveal
          className={`${s.block} ${index % 2 ? s.flip : ""}`}
          aria-labelledby={`${screen.id}-title`}
        >
          <div className={s.copy}>
            <p className={s.eyebrow}>{screen.eyebrow}</p>
            <Heading id={`${screen.id}-title`} parts={screen.heading} />
            <p className={s.text}>{screen.text}</p>
            <ul className={s.bullets}>
              {screen.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>

          <figure className={`${s.figure} ${screen.phone ? s.withPhone : ""}`}>
            <div className={s.browser}>
              <div className={s.bar} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screen.shot.src}
                alt={screen.shot.alt}
                width={screen.shot.width}
                height={screen.shot.height}
                loading="lazy"
                decoding="async"
              />
            </div>
            {screen.phone && (
              <div className={s.phone}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screen.phone.src}
                  alt={screen.phone.alt}
                  width={screen.phone.width}
                  height={screen.phone.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </figure>
        </article>
      ))}

      <div className={s.stepsBlock} data-reveal>
        <p className={s.eyebrow}>Para empezar</p>
        <h2 className={s.title}>
          Tres pasos y tu barbería <span className={s.accent}>funciona sola</span>.
        </h2>
        <ol className={s.steps}>
          {STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
