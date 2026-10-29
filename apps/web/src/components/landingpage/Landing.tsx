import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ChevronDown, Heart, Lock, MapPin, MessageSquare, Smartphone, Sparkles, Wrench } from "lucide-react";
import { CallFlow } from "./CallFlow";
import { COPY, LANDING_PATH, SHOWCASE, type Lang } from "./content";
import { HeroShowcase } from "./HeroShowcase";
import { ShopWebs } from "./ShopWebs";
import { Walkthrough } from "./Walkthrough";
import { WhitelistForm } from "./WhitelistForm";

const SITE = "https://businext.greenfourtech.com";

export function landingMetadata(lang: Lang): Metadata {
  const { title, description } = COPY[lang].meta;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: `${SITE}${LANDING_PATH[lang]}`,
      languages: { es: `${SITE}${LANDING_PATH.es}`, en: `${SITE}${LANDING_PATH.en}`, "x-default": `${SITE}${LANDING_PATH.es}` },
    },
    openGraph: { title, description, url: `${SITE}${LANDING_PATH[lang]}`, locale: lang === "es" ? "es_ES" : "en_US" },
  };
}

const primaryCta =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-[22px] text-label font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const secondaryCta =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-background/60 px-[22px] text-label font-bold text-foreground transition-colors hover:border-foreground-subtle focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const wrap = "mx-auto w-full max-w-[74rem] px-5 md:px-10";
const section = "py-20 md:py-[120px]";
const headline = "m-0 font-heading text-[clamp(2.375rem,5vw,4.25rem)] font-extrabold uppercase leading-[0.95] text-balance text-foreground";
const lead = "m-0 max-w-[34rem] text-body text-foreground-muted md:text-[1.125rem]";

const SIGNATURE_ICONS = [Sparkles, MapPin, Smartphone];
const PERK_ICONS = [Lock, Wrench, MessageSquare, Sparkles];

function Eyebrow({ children }: { children: string }) {
  return <p className="m-0 text-caption font-bold uppercase tracking-[0.1em] text-secondary">{children}</p>;
}

/** The landing in one language. `/` renders it in Spanish and `/en` in English. */
export function Landing({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const sections = [
    ["#llamadas", t.nav.sections.calls],
    ["#la-app", t.nav.sections.app],
    ["#webs", t.nav.sections.webs],
    ["#fundadores", t.nav.sections.founders],
  ];

  return (
    <div lang={lang} className="landing w-full text-foreground">
      <a
        href="#whitelist"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t.skip}
      </a>

      <nav aria-label={t.nav.label} className="sticky top-0 z-30 border-b border-border-subtle bg-background/95 backdrop-blur-md">
        <div className={`${wrap} flex h-[68px] items-center gap-8`}>
          <a href="#inicio" aria-label={t.nav.home} className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            {/* eslint-disable-next-line @next/next/no-img-element -- static logo */}
            <img src="/logo-bn.png" alt="" width={54} height={36} className="h-9 w-auto" />
          </a>
          <div className="hidden gap-[26px] text-label text-foreground-subtle lg:flex">
            {sections.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-foreground">
                {label}
              </a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <div role="group" aria-label={t.nav.language} className="flex items-center text-caption font-bold">
              {(["es", "en"] as const).map((l, i) => (
                <span key={l} className="flex items-center">
                  {i > 0 && <span aria-hidden className="text-foreground-subtle">/</span>}
                  <Link
                    href={LANDING_PATH[l]}
                    hrefLang={l}
                    lang={l}
                    aria-current={l === lang ? "page" : undefined}
                    className={`flex h-10 items-center px-1.5 uppercase tracking-[0.08em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      l === lang ? "text-foreground" : "text-foreground-subtle hover:text-foreground-muted"
                    }`}
                  >
                    {l}
                  </Link>
                </span>
              ))}
            </div>
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-md border border-border px-4 text-label font-bold text-foreground transition-colors hover:border-foreground-subtle sm:inline-flex"
            >
              {t.nav.login}
            </Link>
            <a href="#whitelist" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-label font-bold text-primary-foreground hover:bg-primary-hover">
              {t.nav.join}
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section id="inicio" aria-labelledby="titulo-inicio" className="relative overflow-hidden border-b border-border-subtle lg:flex lg:min-h-[720px] lg:items-center">
          <div className="relative h-[min(128vw,35rem)] overflow-hidden lg:absolute lg:inset-0 lg:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element -- plates are already sized WebP */}
            <img
              src="/landing/stop1-desktop.webp"
              width={1376}
              height={768}
              alt={t.hero.plateAlt}
              fetchPriority="high"
              decoding="async"
              className="landing-scene landing-drift absolute inset-0 h-full w-full object-cover object-[88%_center] lg:object-center"
            />
            <HeroShowcase lang={lang} />
          </div>
          <div className={`${wrap} relative z-10 flex flex-col gap-[22px] pb-16 pt-8 lg:py-32 [&>*]:max-w-[35rem]`}>
            <Eyebrow>{t.hero.eyebrow}</Eyebrow>
            <h1 id="titulo-inicio" className="m-0 font-heading text-[clamp(3rem,7vw,6.25rem)] font-black uppercase leading-[0.92] text-balance">
              {t.hero.title} <span className="text-primary">{t.hero.accent}</span>
            </h1>
            <p className={lead}>{t.hero.lead}</p>
            <div className="flex flex-wrap gap-3">
              <a href="#whitelist" className={primaryCta}>
                {t.hero.join} <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
              <a href="#llamadas" className={secondaryCta}>
                {t.hero.how} <ChevronDown aria-hidden className="h-4 w-4" />
              </a>
            </div>
            <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 border-t border-border-subtle p-0 pt-5 text-body-sm text-foreground-muted">
              {t.hero.signature.map((text, i) => {
                const Icon = SIGNATURE_ICONS[i]!;
                return (
                  <li key={text} className="flex items-center gap-2">
                    <Icon aria-hidden className="h-4 w-4 shrink-0 text-primary" />
                    {text}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="llamadas" aria-labelledby="titulo-llamadas" className={`${section} scroll-mt-[68px]`}>
          <div className={wrap}>
            <div className="mb-14 flex max-w-[47rem] flex-col gap-[18px]">
              <Eyebrow>{t.calls.eyebrow}</Eyebrow>
              <h2 id="titulo-llamadas" className={headline}>
                {t.calls.title}
                <span className="block text-primary">{t.calls.accent}</span>
              </h2>
              <p className={lead}>{t.calls.lead}</p>
            </div>
            <CallFlow lang={lang} />
            <ol className="m-0 mt-16 grid list-none border-t border-border p-0 md:grid-cols-3">
              {t.calls.steps.map(([title, text], i) => (
                <li key={title} className="flex flex-col gap-2 border-border-subtle py-6 max-md:[&+li]:border-t md:py-0 md:pr-7 md:pt-7 md:[&+li]:border-l md:[&+li]:pl-7">
                  <span className="font-heading text-[22px] font-extrabold text-secondary">0{i + 1}</span>
                  <h3 className="m-0 font-heading text-[28px] font-extrabold uppercase leading-none">{title}</h3>
                  <p className="m-0 text-body text-foreground-muted">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="la-app" aria-labelledby="titulo-app" className={`${section} scroll-mt-[68px] pt-10 md:pt-10`}>
          <div className={wrap}>
            <div className="mb-8 flex max-w-[47rem] flex-col gap-[18px]">
              <Eyebrow>{t.app.eyebrow}</Eyebrow>
              <h2 id="titulo-app" className={headline}>
                {t.app.title} <span className="text-primary">{t.app.accent}</span> {t.app.rest}
              </h2>
            </div>
            <Walkthrough lang={lang} />
            <p className="mb-0 mt-4 text-caption text-foreground-subtle">{t.app.sample}</p>
          </div>
        </section>

        <section id="webs" aria-labelledby="titulo-webs" className={`${section} scroll-mt-[68px] pt-10 md:pt-10`}>
          <div className={wrap}>
            <div className="mb-14 flex max-w-[47rem] flex-col gap-[18px]">
              <Eyebrow>{t.webs.eyebrow}</Eyebrow>
              <h2 id="titulo-webs" className={headline}>
                {t.webs.title}
                <span className="block text-primary">{t.webs.accent}</span>
              </h2>
              <p className={lead}>{t.webs.lead}</p>
            </div>
            <ShopWebs lang={lang} />
            <div className="mt-14 grid gap-6 border-t border-border pt-7 md:grid-cols-3">
              {t.webs.points.map(([title, text]) => (
                <div key={title}>
                  <h3 className="m-0 font-heading text-[22px] font-extrabold uppercase leading-none">{title}</h3>
                  <p className="mb-0 mt-1.5 text-body text-foreground-muted">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-xl bg-surface px-6 py-[22px]">
              <p className="m-0 text-body text-foreground-muted">
                <strong className="text-foreground">{t.webs.onlyTitle}</strong> {t.webs.onlyText}
              </p>
              <a href="#whitelist" className={secondaryCta}>
                {t.webs.onlyCta}
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="titulo-pregunta" className={`${section} pt-0 md:pt-0`}>
          <div className={wrap}>
            <div className="relative overflow-hidden rounded-xl border border-border-subtle bg-surface lg:flex lg:aspect-[16/8] lg:items-center lg:bg-transparent">
              <div className="relative h-[min(70vw,23.75rem)] lg:absolute lg:inset-0 lg:h-auto">
                {/* eslint-disable-next-line @next/next/no-img-element -- plates are already sized WebP */}
                <img
                  src="/landing/stop4-desktop.webp"
                  width={1376}
                  height={768}
                  alt={t.ask.plateAlt}
                  loading="lazy"
                  decoding="async"
                  className="landing-scene landing-drift absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="relative flex max-w-[30rem] flex-col gap-4 p-6 lg:p-12">
                <Eyebrow>{t.ask.eyebrow}</Eyebrow>
                <h2 id="titulo-pregunta" className="m-0 font-heading text-[clamp(2.125rem,3.8vw,3.25rem)] font-extrabold uppercase leading-[0.95]">
                  {t.ask.title} <span className="text-primary">{t.ask.accent}</span>
                </h2>
                <p className="reveal m-0 max-w-[86%] self-end rounded-[0.875rem] rounded-br-[4px] bg-surface-raised px-[13px] py-2.5 text-body-sm">
                  {t.ask.question}
                </p>
                <p className="reveal m-0 max-w-[86%] self-start rounded-[0.875rem] rounded-bl-[4px] bg-accent px-[13px] py-2.5 text-body-sm text-accent-foreground">
                  {t.ask.answer}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="fundadores" aria-labelledby="titulo-fundadores" className={`${section} scroll-mt-[100px] pt-0 md:pt-0`}>
          <div className={`${wrap} grid items-start gap-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14`}>
            <div className="flex flex-col gap-[18px]">
              <Eyebrow>{t.founders.eyebrow}</Eyebrow>
              <h2 id="titulo-fundadores" className={headline}>
                {t.founders.title}
                <span className="block text-primary">{t.founders.accent}</span>
              </h2>
              <p className={lead}>{t.founders.lead}</p>
              <div aria-hidden className="mt-2 grid h-[148px] w-[148px] place-items-center rounded-full border-2 border-secondary text-center text-secondary">
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em]">{t.founders.seal[0]}</span>
                  <span className="block font-heading text-[26px] font-black uppercase leading-[0.95] text-foreground">{t.founders.seal[1]}</span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em]">{t.founders.seal[2]}</span>
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {t.founders.perks.map(({ title, text }, i) => {
                const Icon = PERK_ICONS[i]!;
                return (
                  <div key={title} className="flex flex-col gap-2 rounded-lg bg-surface p-[22px]">
                    <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-accent text-primary">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <h3 className="m-0 font-heading text-[24px] font-extrabold uppercase leading-none">{title}</h3>
                    <p className="m-0 text-body-sm text-foreground-muted">{text}</p>
                  </div>
                );
              })}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-secondary px-[22px] py-[18px] sm:col-span-2">
                <p className="m-0 text-body text-foreground-muted">
                  <strong className="text-secondary">{t.founders.limited}</strong> {t.founders.limitedText}
                </p>
                <a href="#whitelist" className={primaryCta}>
                  {t.founders.cta}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="whitelist" aria-labelledby="titulo-whitelist" className="scroll-mt-[68px] border-t border-border-subtle py-24 md:py-[140px]">
          <div className={`${wrap} grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]`}>
            <div className="flex flex-col gap-[22px]">
              <Eyebrow>{t.whitelist.eyebrow}</Eyebrow>
              <h2 id="titulo-whitelist" className="m-0 font-heading text-[clamp(2.75rem,6vw,5.5rem)] font-black uppercase leading-[0.92] text-balance">
                {t.whitelist.title} <span className="text-primary">{t.whitelist.accent}</span>
              </h2>
              <p className={lead}>{t.whitelist.lead}</p>
            </div>
            <div className="rounded-xl bg-surface p-6 sm:p-8">
              <WhitelistForm lang={lang} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle pb-8 pt-16 text-body-sm text-foreground-subtle">
        <div className={`${wrap} grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]`}>
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element -- static logo */}
            <img src="/logo-bn.png" alt="Businext" width={72} height={48} className="h-12 w-auto self-start" />
            <p className="m-0 max-w-[22rem] font-heading text-[clamp(1.75rem,3vw,2.25rem)] font-extrabold uppercase leading-none text-foreground">
              {t.footer.tagline} <span className="text-primary">{t.footer.accent}</span>
            </p>
            <p className="m-0 flex items-center gap-2 text-foreground-muted">
              {t.footer.madeWith} <Heart aria-label={t.footer.love} className="h-4 w-4 fill-secondary text-secondary" /> {t.footer.inMadrid}
            </p>
          </div>
          <nav aria-label={t.footer.label} className="flex flex-col gap-3">
            <p className="m-0 text-caption font-bold uppercase tracking-[0.1em] text-secondary">Businext</p>
            {sections.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-foreground">
                {label}
              </a>
            ))}
            <Link href="/login" className="hover:text-foreground">
              {t.nav.login}
            </Link>
          </nav>
          <div className="flex flex-col gap-3">
            <p className="m-0 text-caption font-bold uppercase tracking-[0.1em] text-secondary">{t.footer.builtTitle}</p>
            {SHOWCASE.map((site) => (
              <a key={site.href} href={site.href} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                {site.name} ↗<span className="sr-only"> {t.webs.newTab}</span>
              </a>
            ))}
            <a href="#whitelist" className="mt-2 font-bold text-primary hover:underline">
              {t.footer.join}
            </a>
          </div>
        </div>
        <div className={`${wrap} mt-12 flex flex-wrap justify-between gap-3 border-t border-border-subtle pt-6 text-caption`}>
          <span>© {new Date().getFullYear()} Businext</span>
          <span>{t.footer.motto}</span>
        </div>
      </footer>
    </div>
  );
}
