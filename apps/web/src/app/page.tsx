import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ChevronDown } from "lucide-react";
import { CallFlow } from "@/components/landingpage/CallFlow";
import { FOUNDER_PERKS } from "@/components/landingpage/content";
import { HeroShowcase } from "@/components/landingpage/HeroShowcase";
import { ShopWebs } from "@/components/landingpage/ShopWebs";
import { Walkthrough } from "@/components/landingpage/Walkthrough";
import { WhitelistForm } from "@/components/landingpage/WhitelistForm";

export const metadata: Metadata = {
  title: { absolute: "Businext · La app que impulsa tu barbería" },
  description:
    "Un asistente de voz que coge las llamadas que tú no puedes, respuestas a tus reseñas redactadas por IA, un asistente al que preguntar cómo va tu negocio y tu web a medida. Reservas y caja, de serie. Plazas de fundador limitadas.",
};

const primaryCta =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-[22px] text-label font-bold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const secondaryCta =
  "inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-background/60 px-[22px] text-label font-bold text-foreground transition-colors hover:border-foreground-subtle focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const wrap = "mx-auto w-full max-w-[74rem] px-5 md:px-10";
const section = "py-20 md:py-[120px]";
const headline = "m-0 font-heading text-[clamp(2.375rem,5vw,4.25rem)] font-extrabold uppercase leading-[0.95] text-balance text-foreground";
const lead = "m-0 max-w-[34rem] text-body text-foreground-muted md:text-[1.125rem]";

function Eyebrow({ children }: { children: string }) {
  return <p className="m-0 text-caption font-bold uppercase tracking-[0.1em] text-secondary">{children}</p>;
}

export default function Home() {
  return (
    <div className="landing w-full text-foreground">
      <a
        href="#whitelist"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar a la whitelist
      </a>

      <nav aria-label="Principal" className="sticky top-0 z-30 border-b border-border-subtle bg-background/95 backdrop-blur-md">
        <div className={`${wrap} flex h-[68px] items-center gap-8`}>
          <a href="#inicio" aria-label="Businext, ir al inicio" className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
            {/* eslint-disable-next-line @next/next/no-img-element -- static logo */}
            <img src="/logo-bn.png" alt="" width={54} height={36} className="h-9 w-auto" />
          </a>
          <div className="hidden gap-[26px] text-label text-foreground-subtle lg:flex">
            {[
              ["#llamadas", "Cómo funciona"],
              ["#la-app", "La app"],
              ["#webs", "Tu web"],
              ["#fundadores", "Fundadores"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="hover:text-foreground">
                {label}
              </a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden h-10 items-center rounded-md border border-border px-4 text-label font-bold text-foreground transition-colors hover:border-foreground-subtle sm:inline-flex"
            >
              Entrar
            </Link>
            <a href="#whitelist" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-label font-bold text-primary-foreground hover:bg-primary-hover">
              Apúntate
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
              alt="El barbero de Businext, de brazos cruzados junto al sillón de su barbería al anochecer."
              fetchPriority="high"
              decoding="async"
              className="landing-scene landing-drift absolute inset-0 h-full w-full object-cover object-[88%_center] lg:object-center"
            />
            <HeroShowcase />
          </div>
          <div className={`${wrap} relative z-10 flex flex-col gap-[22px] pb-16 pt-8 lg:py-32 [&>*]:max-w-[35rem]`}>
            <Eyebrow>Para barberías que quieren crecer</Eyebrow>
            <h1 id="titulo-inicio" className="m-0 font-heading text-[clamp(3rem,7vw,6.25rem)] font-black uppercase leading-[0.92] text-balance">
              Tu barbería no solo se organiza. <span className="text-primary">Crece.</span>
            </h1>
            <p className={lead}>
              Businext coge el teléfono cuando tú no puedes, te prepara la respuesta a cada reseña y te cuenta cómo va tu negocio. Las reservas,
              la caja y tu web vienen de serie.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#whitelist" className={primaryCta}>
                Apúntate a la whitelist <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
              <a href="#llamadas" className={secondaryCta}>
                Ver cómo funciona <ChevronDown aria-hidden className="h-4 w-4" />
              </a>
            </div>
            <p className="m-0 text-body-sm text-foreground-subtle">Sin instalar nada. Desde el móvil o el ordenador.</p>
          </div>
        </section>

        <section id="llamadas" aria-labelledby="titulo-llamadas" className={`${section} scroll-mt-[68px]`}>
          <div className={wrap}>
            <div className="mb-14 flex max-w-[47rem] flex-col gap-[18px]">
              <Eyebrow>Asistente de voz</Eyebrow>
              <h2 id="titulo-llamadas" className={headline}>
                Suena el teléfono.
                <span className="block text-primary">Tú sigues cortando.</span>
              </h2>
              <p className={lead}>El asistente atiende con voz natural, mira tu agenda real y deja la cita. Ninguna llamada perdida es un cliente perdido.</p>
            </div>
            <CallFlow />
            <ol className="m-0 mt-16 grid list-none border-t border-border p-0 md:grid-cols-3">
              {[
                ["Atiende", "Con voz natural, en español, a cualquier hora."],
                ["Mira tu agenda", "Solo ofrece horas que de verdad tienes libres."],
                ["Tú decides", "Reserva directa, o una solicitud que aceptas desde el móvil."],
              ].map(([title, text], i) => (
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
              <Eyebrow>La app</Eyebrow>
              <h2 id="titulo-app" className={headline}>
                Así <span className="text-primary">impulsa</span> tu barbería
              </h2>
            </div>
            <Walkthrough />
            <p className="mb-0 mt-4 text-caption text-foreground-subtle">Pantallas de la app con datos de ejemplo.</p>
          </div>
        </section>

        <section id="webs" aria-labelledby="titulo-webs" className={`${section} scroll-mt-[68px] pt-10 md:pt-10`}>
          <div className={wrap}>
            <div className="mb-14 flex max-w-[47rem] flex-col gap-[18px]">
              <Eyebrow>Tu web, incluida</Eyebrow>
              <h2 id="titulo-webs" className={headline}>
                Una web a tu medida.
                <span className="block text-primary">Dentro de la suscripción.</span>
              </h2>
              <p className={lead}>Con Businext tu barbería estrena web propia, con tu estilo. Estas dos ya están funcionando.</p>
            </div>
            <ShopWebs />
            <div className="mt-14 grid gap-6 border-t border-border pt-7 md:grid-cols-3">
              {[
                ["Con tu identidad", "Tu logo, tus colores y tus fotos. Ninguna se parece a otra."],
                ["Lo que busca tu cliente", "Precios, trabajos, horario, ubicación y cómo pedir cita."],
                ["Pensada para el móvil", "Rápida y clara en la pantalla desde la que te buscan."],
              ].map(([title, text]) => (
                <div key={title}>
                  <h3 className="m-0 font-heading text-[22px] font-extrabold uppercase leading-none">{title}</h3>
                  <p className="mb-0 mt-1.5 text-body text-foreground-muted">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-xl bg-surface px-6 py-[22px]">
              <p className="m-0 text-body text-foreground-muted">
                <strong className="text-foreground">¿Solo quieres la web?</strong> También te la hacemos a tu medida, sin suscripción.
              </p>
              <a href="#whitelist" className={secondaryCta}>
                Quiero mi web
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
                  alt="El barbero, apoyado en el mostrador de su barbería, mira el móvil."
                  loading="lazy"
                  decoding="async"
                  className="landing-scene landing-drift absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="relative flex max-w-[30rem] flex-col gap-4 p-6 lg:p-12">
                <Eyebrow>Pregúntale a tu negocio</Eyebrow>
                <h2 id="titulo-pregunta" className="m-0 font-heading text-[clamp(2.125rem,3.8vw,3.25rem)] font-extrabold uppercase leading-[0.95]">
                  Tu negocio, <span className="text-primary">en una conversación</span>
                </h2>
                <p className="reveal m-0 max-w-[86%] self-end rounded-[0.875rem] rounded-br-[4px] bg-surface-raised px-[13px] py-2.5 text-body-sm">
                  ¿Cuánto llevo este mes?
                </p>
                <p className="reveal m-0 max-w-[86%] self-start rounded-[0.875rem] rounded-bl-[4px] bg-accent px-[13px] py-2.5 text-body-sm text-accent-foreground">
                  4.910 €, un 9 % más que en septiembre a estas alturas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="fundadores" aria-labelledby="titulo-fundadores" className={`${section} scroll-mt-[100px] pt-0 md:pt-0`}>
          <div className={`${wrap} grid items-start gap-9 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14`}>
            <div className="flex flex-col gap-[18px]">
              <Eyebrow>Clientes fundadores</Eyebrow>
              <h2 id="titulo-fundadores" className={headline}>
                Las primeras barberías,
                <span className="block text-primary">con ventajas para siempre.</span>
              </h2>
              <p className={lead}>
                Abrimos Businext por tandas. Las barberías que entren en la primera serán fundadoras y lo notarán mientras sigan con nosotros.
              </p>
              <div aria-hidden className="mt-2 grid h-[148px] w-[148px] place-items-center rounded-full border-2 border-secondary text-center text-secondary">
                <span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em]">Barbería</span>
                  <span className="block font-heading text-[26px] font-black uppercase leading-[0.95] text-foreground">Fundadora</span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.14em]">Businext</span>
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {FOUNDER_PERKS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex flex-col gap-2 rounded-lg bg-surface p-[22px]">
                  <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-accent text-primary">
                    <Icon aria-hidden className="h-5 w-5" />
                  </span>
                  <h3 className="m-0 font-heading text-[24px] font-extrabold uppercase leading-none">{title}</h3>
                  <p className="m-0 text-body-sm text-foreground-muted">{text}</p>
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-secondary px-[22px] py-[18px] sm:col-span-2">
                <p className="m-0 text-body text-foreground-muted">
                  <strong className="text-secondary">Plazas limitadas</strong> en la primera tanda. Apuntarte no te compromete a nada.
                </p>
                <a href="#whitelist" className={primaryCta}>
                  Quiero ser fundador
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="whitelist" aria-labelledby="titulo-whitelist" className="scroll-mt-[68px] border-t border-border-subtle py-24 md:py-[140px]">
          <div className={`${wrap} grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]`}>
            <div className="flex flex-col gap-[22px]">
              <Eyebrow>Acceso anticipado</Eyebrow>
              <h2 id="titulo-whitelist" className="m-0 font-heading text-[clamp(2.75rem,6vw,5.5rem)] font-black uppercase leading-[0.92] text-balance">
                Mañana tu barbería <span className="text-primary">trabaja contigo.</span>
              </h2>
              <p className={lead}>Apúntate y te escribimos cuando abramos tu plaza de fundador.</p>
            </div>
            <div className="rounded-xl bg-surface p-6 sm:p-8">
              <WhitelistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle py-8 text-body-sm text-foreground-subtle">
        <div className={`${wrap} flex flex-wrap items-center justify-between gap-4`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static logo */}
          <img src="/logo-bn.png" alt="Businext" width={54} height={36} className="h-9 w-auto" />
          <span>© {new Date().getFullYear()} Businext</span>
        </div>
      </footer>
    </div>
  );
}
