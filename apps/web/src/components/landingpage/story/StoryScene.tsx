import type { ReactNode } from "react";

type Props = {
  id: string;
  /** Base name of the plate: /landing/<image>-desktop.webp and -mobile.webp. */
  image: string;
  alt: string;
  /** Eyebrow and heading: sits on the empty area the plate leaves for it, so keep it short. */
  header: ReactNode;
  /** Lede and app mockup: flows under the plate on mobile, under the header on desktop. */
  children?: ReactNode;
  priority?: boolean;
  labelledBy: string;
  /** For plates with bright areas behind the mobile heading: a denser top scrim. */
  strongScrim?: boolean;
};

// Scrim stops measured against the plates (p99 luminance of the copy area): text stays
// above 9:1 and the heading above 6:1. Re-measure when a plate is regenerated.
const MOBILE_SCRIM =
  "bg-[linear-gradient(to_bottom,rgb(12_17_23/0.92)_0%,rgb(12_17_23/0.55)_30%,transparent_48%,transparent_70%,var(--color-background)_100%)]";
const MOBILE_SCRIM_STRONG =
  "bg-[linear-gradient(to_bottom,rgb(12_17_23/0.96)_0%,rgb(12_17_23/0.86)_38%,transparent_56%,transparent_70%,var(--color-background)_100%)]";
const DESKTOP_SCRIM =
  "md:bg-[linear-gradient(to_right,rgb(12_17_23/0.96)_0%,rgb(12_17_23/0.8)_32%,rgb(12_17_23/0.2)_58%,transparent_70%)]";

/**
 * One chapter of the story. Plates are composed with empty space for the copy: the left
 * third on desktop (16:9) and the top third on mobile (9:16), so the copy never covers
 * the character. Each orientation only downloads its own plate.
 */
export function StoryScene({ id, image, alt, header, children, priority, labelledBy, strongScrim }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className="relative overflow-hidden bg-background md:flex md:min-h-screen md:items-center"
    >
      <div className="relative aspect-[9/16] max-h-[100svh] w-full md:absolute md:inset-0 md:aspect-auto md:max-h-none">
        <picture>
          <source media="(max-width: 767px)" srcSet={`/landing/${image}-mobile.webp`} width={768} height={1376} />
          <img
            src={`/landing/${image}-desktop.webp`}
            width={1376}
            height={768}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top md:object-right"
          />
        </picture>
        {/* Scrims: keep the copy at AA over any part of the plate. */}
        <div aria-hidden className={`absolute inset-0 ${strongScrim ? MOBILE_SCRIM_STRONG : MOBILE_SCRIM} ${DESKTOP_SCRIM}`} />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 hidden h-40 bg-[linear-gradient(to_top,var(--color-background),transparent)] md:block"
        />
      </div>

      <div className="md:relative md:z-10 md:mx-auto md:w-full md:max-w-7xl md:px-12 md:py-28">
        <div className="md:max-w-xl">
          <header
            className={`story-reveal absolute inset-x-0 top-0 z-10 px-5 md:static md:p-0 ${priority ? "pt-24" : "pt-14"}`}
          >
            {header}
          </header>
          {children && (
            <div className="story-reveal relative z-10 -mt-24 px-5 pb-20 md:mt-6 md:p-0">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Eyebrow({ number, children, upcoming }: { number?: string; children: ReactNode; upcoming?: boolean }) {
  return (
    <p className="mb-4 flex flex-wrap items-center gap-3 text-caption font-bold uppercase tracking-[0.2em] text-primary">
      {number && <span className="text-foreground-muted">{number}</span>}
      <span>{children}</span>
      {upcoming && (
        <span className="rounded-full border border-primary px-2.5 py-0.5 text-[0.6875rem] tracking-[0.12em] text-primary">
          Nuevo · Próximamente
        </span>
      )}
    </p>
  );
}
