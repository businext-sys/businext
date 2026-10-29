import type { CSSProperties } from "react";
import { ExternalLink } from "lucide-react";
import { COPY, SHOWCASE, type Lang } from "./content";

/**
 * The webs we built, as they are live: each capture scrolls by itself inside a browser and a phone.
 * On a phone only the phone frame shows, large enough to read.
 */
export function ShopWebs({ lang }: { lang: Lang }) {
  const t = COPY[lang].webs;
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-6">
      {SHOWCASE.map((site) => {
        const host = new URL(site.href).host;
        return (
          <article key={site.href} className="reveal flex flex-col gap-4">
            <div className="relative md:pb-7">
              <div className="hidden overflow-hidden rounded-[10px] border border-border bg-surface md:block">
                <div aria-hidden className="flex items-center gap-2 border-b border-border-subtle px-3 py-[9px]">
                  <i className="h-[9px] w-[9px] rounded-full bg-border" />
                  <i className="h-[9px] w-[9px] rounded-full bg-border" />
                  <i className="h-[9px] w-[9px] rounded-full bg-border" />
                  <span className="ml-2 min-w-0 flex-1 truncate rounded-full bg-muted px-3 py-[3px] text-caption text-foreground-subtle">{host}</span>
                </div>
                <div className="landing-site-frame relative aspect-[16/10] overflow-hidden bg-background">
                  {/* eslint-disable-next-line @next/next/no-img-element -- full-page capture that scrolls with CSS */}
                  <img
                    src={`/landing/webs/${site.capture}-desktop.jpg`}
                    width={640}
                    alt={t.alt(site.name)}
                    loading="lazy"
                    decoding="async"
                    className="landing-site h-auto w-full max-w-none"
                    style={{ "--end": site.end.desktop } as CSSProperties}
                  />
                </div>
              </div>
              <div className="relative mx-auto w-[min(64%,16rem)] rounded-[30px] border border-border bg-surface-raised p-[7px] [aspect-ratio:9/19.2] md:absolute md:bottom-0 md:right-0 md:mx-0 md:w-1/4 md:rounded-[22px] md:p-[5px]">
                <div className="landing-site-frame h-full overflow-hidden rounded-[23px] bg-background md:rounded-[17px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- full-page capture that scrolls with CSS */}
                  <img
                    src={`/landing/webs/${site.capture}-mobile.jpg`}
                    width={300}
                    alt={t.mobileAlt(site.name)}
                    loading="lazy"
                    decoding="async"
                    className="landing-site h-auto w-full max-w-none"
                    style={{ "--end": site.end.mobile } as CSSProperties}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="m-0 font-heading text-[26px] font-extrabold uppercase leading-none text-foreground">{site.name}</p>
                <p className="m-0 text-body-sm text-foreground-subtle">{site.place}</p>
              </div>
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap text-label font-bold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t.visit} <ExternalLink aria-hidden className="h-4 w-4" />
                <span className="sr-only">{t.newTab}</span>
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
