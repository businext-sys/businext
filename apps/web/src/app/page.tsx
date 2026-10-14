import Link from "next/link";
import type { ComponentType } from "react";
import type { Metadata } from "next";
import { ArrowRight, ChevronDown } from "lucide-react";
import { StoryScene, Eyebrow } from "@/components/landingpage/story/StoryScene";
import { CHAPTERS, HERO, type ChapterId } from "@/components/landingpage/story/chapters";
import {
  AssetsSteps,
  BookingMock,
  CallMock,
  ChaosList,
  FinanceMock,
  Lede,
  TimeList,
  TrendsMock,
} from "@/components/landingpage/story/mockups";

export const metadata: Metadata = {
  title: { absolute: "Businext · La app que convierte tu barbería en empresa" },
  description:
    "Reservas, llamadas con IA, caja automática y tendencias. Businext digitaliza tu barbería para que ganes tiempo y patrimonio.",
};

const MOCKUPS: Record<ChapterId, ComponentType> = {
  chaos: ChaosList,
  bookings: BookingMock,
  calls: CallMock,
  finances: FinanceMock,
  trends: TrendsMock,
  time: TimeList,
  assets: AssetsSteps,
};

function Title({ id, title, accent, as: Tag = "h2" }: { id: string; title: string; accent: string; as?: "h1" | "h2" }) {
  return (
    <Tag
      id={id}
      className="m-0 font-heading text-[clamp(2rem,7vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground"
    >
      {title}{" "}
      <span className="block bg-[image:var(--gradient-text)] bg-clip-text text-transparent">{accent}</span>
    </Tag>
  );
}

const primaryCta =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-label font-semibold text-primary-foreground shadow-glow-primary transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

export default function Home() {
  return (
    <div className="w-full bg-background text-foreground">
      <a
        href="#capitulo-chaos"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Saltar a la historia
      </a>

      <nav aria-label="Principal" className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-4 md:px-12">
        <span className="font-heading text-label font-bold uppercase tracking-[0.22em] text-primary">Businext</span>
        <Link
          href="/login"
          className="rounded-lg border border-border px-4 py-2 text-label font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Entrar
        </Link>
      </nav>

      {/* Prologue */}
      <StoryScene
        id="inicio"
        image={HERO.image}
        alt={HERO.alt}
        priority
        labelledBy="titulo-inicio"
        header={
          <>
            <Eyebrow>Businext para barberías</Eyebrow>
            <Title as="h1" id="titulo-inicio" title="Tu talento ya trabaja." accent="Ahora, que trabaje tu negocio." />
          </>
        }
      >
        <Lede>Más tiempo. Más eficiencia. Más patrimonio.</Lede>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/login" className={primaryCta}>
            Prueba gratis <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
          <a
            href="#capitulo-chaos"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 text-label font-semibold text-foreground transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            Ver cómo <ChevronDown aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </StoryScene>

      {CHAPTERS.map((c) => {
        const Mockup = MOCKUPS[c.id];
        return (
          <StoryScene
            key={c.id}
            id={`capitulo-${c.id}`}
            image={c.image}
            alt={c.alt}
            labelledBy={`titulo-${c.id}`}
            strongScrim={c.strongScrim}
            header={
              <>
                <Eyebrow number={c.number} upcoming={c.upcoming}>
                  {c.eyebrow}
                </Eyebrow>
                <Title id={`titulo-${c.id}`} title={c.title} accent={c.accent} />
              </>
            }
          >
            <Lede>{c.lede}</Lede>
            <Mockup />
          </StoryScene>
        );
      })}

      {/* Epilogue: offer */}
      <section aria-labelledby="titulo-oferta" className="px-5 py-24 md:px-12">
        <div className="story-reveal mx-auto max-w-xl rounded-3xl border border-border bg-surface p-6 text-center shadow-lg sm:p-10">
          <Eyebrow>Empieza hoy</Eyebrow>
          <h2 id="titulo-oferta" className="m-0 font-heading text-[clamp(1.75rem,6vw,2.75rem)] font-bold leading-tight tracking-[-0.03em]">
            Tu barbería, <span className="bg-[image:var(--gradient-text)] bg-clip-text text-transparent">en piloto automático.</span>
          </h2>
          <dl className="mb-6 mt-8 grid grid-cols-2 gap-3 text-left">
            <div className="rounded-2xl border border-border bg-surface-raised p-4">
              <dt className="text-caption uppercase tracking-[0.12em] text-primary">Primer mes</dt>
              <dd className="m-0 font-heading text-h2 font-bold">Gratis</dd>
              <dd className="m-0 text-caption text-foreground-muted">Sin compromiso</dd>
            </div>
            <div className="rounded-2xl border border-border bg-surface-raised p-4">
              <dt className="text-caption uppercase tracking-[0.12em] text-foreground-muted">Después</dt>
              <dd className="m-0 font-heading text-h2 font-bold">70 €</dd>
              <dd className="m-0 text-caption text-foreground-muted">Al mes · cancela cuando quieras</dd>
            </div>
          </dl>
          <Link href="/login" className={`${primaryCta} w-full`}>
            Crear mi cuenta <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-5 py-8 text-center text-caption text-foreground-subtle">
        © {new Date().getFullYear()} Businext
      </footer>
    </div>
  );
}
