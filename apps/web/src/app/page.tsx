import Link from "next/link";
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ArrowRight, ChevronDown, ExternalLink, Globe, Sparkles } from "lucide-react";
import { SCREENS } from "@/components/landingpage/flight/screens";
import { Story, type Chapter } from "@/components/landingpage/flight/Story";
import { FAQS, SHOWCASE, STOPS } from "@/components/landingpage/flight/stops";
import { WhitelistForm } from "@/components/landingpage/WhitelistForm";

export const metadata: Metadata = {
  title: { absolute: "Businext · Tu barbería, dirigida por IA" },
  description:
    "Asistente telefónico con IA que reserva por ti, tendencias de redes convertidas en publicaciones automáticas, avisos en tiempo real y reservas y caja que funcionan solas. Apúntate a la whitelist.",
};

const primaryCta =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-label font-semibold text-brand-foreground shadow-glow-primary transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const secondaryCta =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-6 py-3.5 text-label font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const gradientText = "bg-[image:var(--gradient-text)] bg-clip-text text-transparent";

const WORDMARK = "Businext";

const [HERO, ...REST] = STOPS;
const CHAPTERS: Chapter[] = REST.map((stop, i) => ({ stop, from: STOPS[i]! }));
const HeroScreen = SCREENS[HERO.screen];

function Eyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-caption font-bold uppercase tracking-[0.2em] text-primary">{children}</p>;
}

export default function Home() {
  return (
    <div className="landing w-full text-foreground">
      <a
        href="#whitelist"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar a la whitelist
      </a>

      <nav aria-label="Principal" className="site-nav fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 md:px-12">
        <span className="nav-brand font-heading text-label font-bold uppercase tracking-[0.22em] text-primary">Businext</span>
        <div className="flex items-center gap-2">
          <a
            href="#whitelist"
            className="hidden rounded-lg bg-brand px-4 py-2 text-label font-semibold text-brand-foreground transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
          >
            Whitelist
          </a>
          <Link
            href="/login"
            className="rounded-lg border border-border bg-background/40 px-4 py-2 text-label font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Entrar
          </Link>
        </div>
      </nav>

      <main>
        <section id="inicio" aria-labelledby="titulo-inicio" className="hero relative flex min-h-[100svh] items-start md:items-center">
          <picture>
            <source media="(max-width: 47.99rem)" srcSet={`/landing/${HERO.plate}-mobile.webp`} width={768} height={1376} />
            <img
              src={`/landing/${HERO.plate}-desktop.webp`}
              width={1376}
              height={768}
              alt={HERO.alt}
              fetchPriority="high"
              decoding="async"
              className="hero-plate absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <div aria-hidden className="hero-scrim absolute inset-0" />
          <div className="hero-copy relative z-10 w-full px-5 pb-10 pt-28 md:max-w-[min(40rem,48vw)] md:px-0 md:pb-0 md:pl-[clamp(3rem,7vw,8rem)]">
            <p
              aria-label={WORDMARK}
              className="m-0 mb-3 font-heading text-[clamp(2.75rem,11vw,6.5rem)] font-bold leading-none tracking-[-0.04em]"
            >
              {[...WORDMARK].map((letter, i) => (
                <span key={i} aria-hidden className={`wordmark-letter ${gradientText}`} style={{ "--i": i } as CSSProperties}>
                  {letter}
                </span>
              ))}
            </p>
            <Eyebrow>{HERO.eyebrow}</Eyebrow>
            <h1
              id="titulo-inicio"
              className="m-0 font-heading text-[clamp(1.875rem,5.6vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
            >
              {HERO.title} <span className={`block ${gradientText}`}>{HERO.accent}</span>
            </h1>
            <p className="mb-0 mt-4 max-w-xl text-body text-foreground-muted md:text-[1.0625rem]">{HERO.body}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="#whitelist" className={primaryCta}>
                Apúntate a la whitelist <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
              <a href={`#${CHAPTERS[0]?.stop.id}`} className={secondaryCta}>
                Ver cómo funciona <ChevronDown aria-hidden className="h-4 w-4" />
              </a>
            </div>
            <div className="is-active mt-6 hidden max-w-md md:block">
              <HeroScreen />
            </div>
          </div>
        </section>

        <section aria-label="Cómo funciona" className="py-10 md:py-24">
          <Story chapters={CHAPTERS} />
        </section>

        <div>
          <section id="whitelist" aria-labelledby="titulo-whitelist" className="px-5 pb-20 pt-28 md:px-12">
            <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[1.1fr_1fr]">
              <div className="reveal">
                <Eyebrow>Acceso anticipado</Eyebrow>
                <h2 id="titulo-whitelist" className="m-0 font-heading text-[clamp(1.875rem,6vw,3rem)] font-bold leading-tight tracking-[-0.03em]">
                  Entra en la <span className={gradientText}>whitelist.</span>
                </h2>
                <p className="mb-6 mt-4 text-body text-foreground-muted">
                  Abrimos Businext por tandas a un número limitado de barberías. Apúntate y te avisamos cuando sea tu turno.
                </p>
                <div className="rounded-2xl border border-border bg-surface p-5">
                  <p className="m-0 text-caption uppercase tracking-[0.12em] text-foreground-subtle">Precio de lanzamiento</p>
                  <p className="m-0 mt-1 font-heading text-h2 font-bold text-foreground-subtle">
                    <s aria-label="Precio todavía sin cerrar">··,·· €</s>
                    <span className="ml-2 align-middle text-body font-normal">/ mes</span>
                  </p>
                  <p className="m-0 mt-2 text-body-sm text-foreground-muted">
                    Rondará entre <strong className="text-foreground">50 y 70 € al mes</strong>, según lo que necesite tu
                    barbería: barberos, llamadas que atiende la IA y redes que gestiona. Lo cerramos contigo al abrir tu plaza.
                  </p>
                </div>
              </div>
              <div className="reveal rounded-3xl border border-border bg-surface p-6 shadow-lg sm:p-8">
                <WhitelistForm />
              </div>
            </div>
          </section>

          <section aria-labelledby="titulo-webs" className="px-5 pb-24 md:px-12">
            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
              <article className="reveal relative overflow-hidden rounded-3xl border border-primary/60 bg-surface p-6 shadow-glow-primary sm:p-8">
                <p className="m-0 mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-caption font-bold uppercase tracking-[0.12em] text-brand-foreground">
                  <Sparkles aria-hidden className="h-3.5 w-3.5" /> Incluida en el pack
                </p>
                <h2 id="titulo-webs" className="m-0 font-heading text-h2 font-bold leading-tight">
                  Tu web, dentro de la suscripción.
                </h2>
                <p className="mb-0 mt-3 text-body text-foreground-muted">
                  Con Businext tu barbería estrena web propia: precios, trabajos, ubicación y un botón de reserva conectado a tu
                  agenda. Sin pagar aparte.
                </p>
              </article>

              <article className="reveal rounded-3xl border border-border bg-surface p-6 sm:p-8">
                <p className="m-0 mb-4 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-caption font-bold uppercase tracking-[0.12em] text-primary">
                  <Globe aria-hidden className="h-3.5 w-3.5" /> ¿Solo la web?
                </p>
                <h3 className="m-0 font-heading text-h2 font-bold leading-tight">
                  Web para tu barbería <span className={`whitespace-nowrap ${gradientText}`}>desde 150 €.</span>
                </h3>
                <p className="mb-4 mt-3 text-body text-foreground-muted">Pago único, a tu medida. Mira dos que ya están funcionando:</p>
                <ul className="m-0 mb-5 grid list-none gap-2 p-0">
                  {SHOWCASE.map((site) => (
                    <li key={site.href}>
                      <a
                        href={site.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-11 items-center justify-between gap-3 rounded-2xl bg-surface-raised px-4 py-3 transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <span>
                          <span className="block text-label font-semibold text-foreground">{site.name}</span>
                          <span className="block text-caption text-foreground-muted">{site.place}</span>
                        </span>
                        <ExternalLink aria-hidden className="h-4 w-4 shrink-0 text-primary" />
                        <span className="sr-only">(se abre en otra pestaña)</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a href="#whitelist" className={`${secondaryCta} w-full`}>
                  Quiero mi web <ArrowRight aria-hidden className="h-4 w-4" />
                </a>
              </article>
            </div>
          </section>

          <section aria-labelledby="titulo-faq" className="px-5 pb-28 md:px-12">
            <div className="mx-auto max-w-2xl">
              <h2 id="titulo-faq" className="mb-8 text-center font-heading text-h2 font-bold">
                Preguntas frecuentes
              </h2>
              <div className="grid gap-3">
                {FAQS.map((f) => (
                  <details key={f.q} className="reveal group rounded-2xl border border-border bg-surface px-5 py-4 open:border-primary/60">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <ChevronDown aria-hidden className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="m-0 mt-3 text-body-sm text-foreground-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <footer className="border-t border-border px-5 py-8 text-center text-caption text-foreground-subtle">
            © {new Date().getFullYear()} Businext
          </footer>
        </div>
      </main>
    </div>
  );
}
