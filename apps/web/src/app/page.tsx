import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ChevronDown, ExternalLink, Globe, Sparkles } from "lucide-react";
import { FlightStage } from "@/components/landingpage/flight/FlightStage";
import { SCREENS } from "@/components/landingpage/flight/screens";
import { FAQS, SHOWCASE, STOPS } from "@/components/landingpage/flight/stops";
import { WhitelistForm } from "@/components/landingpage/WhitelistForm";

export const metadata: Metadata = {
  title: { absolute: "Businext · Tu barbería, dirigida por IA" },
  description:
    "Asistente telefónico con IA que reserva por ti, tendencias de redes convertidas en publicaciones automáticas, avisos en tiempo real y reservas y caja que funcionan solas. Apúntate a la whitelist.",
};

const primaryCta =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-label font-semibold text-primary-foreground shadow-glow-primary transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const secondaryCta =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-6 py-3.5 text-label font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const gradientText = "bg-[image:var(--gradient-text)] bg-clip-text text-transparent";

function Eyebrow({ children }: { children: string }) {
  return <p className="mb-3 text-caption font-bold uppercase tracking-[0.2em] text-primary">{children}</p>;
}

export default function Home() {
  return (
    <div className="w-full bg-background text-foreground">
      <a
        href="#whitelist"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar a la whitelist
      </a>

      <nav aria-label="Principal" className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 md:px-12">
        <span className="font-heading text-label font-bold uppercase tracking-[0.22em] text-primary">Businext</span>
        <div className="flex items-center gap-2">
          <a
            href="#whitelist"
            className="hidden rounded-lg bg-primary px-4 py-2 text-label font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
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

      <FlightStage stops={STOPS} />
      {/* Without script nothing puts a stop on stage: let every copy flow instead. */}
      <noscript>
        <style>{`.flight-copy{position:relative;opacity:1;visibility:visible;min-height:100svh}.ui-item{opacity:1;translate:none}`}</style>
      </noscript>

      <nav aria-label="Capítulos" className="flight-pips">
        {STOPS.map((stop, index) => (
          <a key={stop.id} className="flight-pip" href={`#${stop.id}`} aria-current={index === 0 ? "true" : "false"}>
            <span className="sr-only">{stop.label}</span>
          </a>
        ))}
      </nav>

      <main>
        {STOPS.map((stop, index) => {
          const Heading = index === 0 ? "h1" : "h2";
          const ScreenView = SCREENS[stop.screen];
          return (
            <section
              key={stop.id}
              id={stop.id}
              aria-labelledby={`titulo-${stop.id}`}
              className={`flight-stop${index === 0 ? " is-on" : ""}`}
            >
              <div className="flight-copy">
                <div className="flight-text">
                  <Eyebrow>{stop.eyebrow}</Eyebrow>
                  <Heading
                    id={`titulo-${stop.id}`}
                    className="m-0 font-heading text-[clamp(1.875rem,6.4vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
                  >
                    {stop.title} <span className={`block ${gradientText}`}>{stop.accent}</span>
                  </Heading>
                  <p className="mb-0 mt-4 max-w-xl text-body text-foreground-muted md:text-[1.0625rem]">{stop.body}</p>
                  {index === 0 && (
                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <a href="#whitelist" className={primaryCta}>
                        Apúntate a la whitelist <ArrowRight aria-hidden className="h-4 w-4" />
                      </a>
                      <a href={`#${STOPS[1]?.id}`} className={secondaryCta}>
                        Ver cómo funciona <ChevronDown aria-hidden className="h-4 w-4" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="flight-screen">
                  <ScreenView />
                </div>
              </div>
            </section>
          );
        })}

        {/* Past the flight the page lands on solid ground and covers the stage. */}
        <div className="flight-site">
          <section id="whitelist" aria-labelledby="titulo-whitelist" className="px-5 pb-20 pt-28 md:px-12">
            <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-[1.1fr_1fr]">
              <div>
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
              <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg sm:p-8">
                <WhitelistForm />
              </div>
            </div>
          </section>

          <section aria-labelledby="titulo-webs" className="px-5 pb-24 md:px-12">
            <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
              <article className="relative overflow-hidden rounded-3xl border border-primary/60 bg-surface p-6 shadow-glow-primary sm:p-8">
                <p className="m-0 mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-caption font-bold uppercase tracking-[0.12em] text-primary-foreground">
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

              <article className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
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
                  <details key={f.q} className="group rounded-2xl border border-border bg-surface px-5 py-4 open:border-primary/60">
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
