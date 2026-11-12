"use client";

import { useState } from "react";
import { useWeeklySummary } from "@/hooks/useWeeklySummary";
import type { WeeklySummaryKPIs, Opportunity } from "@/lib/intelligence/types";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CalendarDays,
  ShoppingBag,
  Euro,
  Lightbulb,
  Zap,
  ArrowRight,
  CircleDot,
} from "lucide-react";

/* ── Sparkline SVG ─────────────────────────────────────────────────── */
/**
 * `accentToken` es el nombre de un token de color (ej. "chart-1"), no un hex.
 *
 * El color se aplica con `style` y no con los atributos de presentacion de SVG
 * (`stroke=`, `fill=`): `var()` no se sustituye en un atributo, si en una
 * declaracion inline. Y a diferencia de leer el token con `colorToken()`, esto
 * tambien resuelve en SSR, asi que no hay salto de color al hidratar.
 */
export function Sparkline({ data, accentToken }: { data: number[]; accentToken: string }) {
  if (!data || data.length === 0 || data.every((v) => v === 0)) return null;

  const width = 80;
  const height = 28;
  const padding = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(" L ")}`;

  // Gradient fill area
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaD = `${pathD} L ${lastPoint.split(",")[0]},${height} L ${firstPoint.split(",")[0]},${height} Z`;

  const accent = `var(--color-${accentToken})`;
  /* El id sale del token (un slug valido) para que sea estable entre servidor y
     cliente: cada KPI usa un accent distinto, asi que no colisionan. */
  const gradientId = `sparkline-${accentToken}`;

  return (
    <svg width={width} height={height} className="shrink-0 opacity-60 group-hover:opacity-90 transition-opacity duration-300">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: accent, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: accent, stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path d={pathD} fill="none" style={{ stroke: accent }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Current day dot */}
      {data.length > 0 && (
        <circle
          cx={padding + ((data.length - 1) / (data.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((data[data.length - 1] - min) / range) * (height - padding * 2)}
          r="2.5"
          style={{ fill: accent }}
        />
      )}
    </svg>
  );
}

/* ── KPI Card ──────────────────────────────────────────────────────── */
function KPICard({
  label,
  value,
  change,
  icon,
  accentToken,
  sparklineData,
}: {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  /** Nombre de un token de color del theme, ej. "chart-1". */
  accentToken: string;
  sparklineData?: number[];
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="relative overflow-hidden rounded-xl bg-surface border border-border-subtle p-5 transition-all duration-300 hover:border-border hover:shadow-md group animate-fade-in-up">
      {/* Subtle corner glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-[0.06] group-hover:opacity-[0.1] transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: `var(--color-${accentToken})` }}
      />

      <div className="relative">
        {/* Icon + label + sparkline row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-foreground-subtle group-hover:text-foreground-muted transition-colors duration-300">
              {icon}
            </span>
            <span className="text-[11px] uppercase tracking-[0.08em] font-medium text-foreground-subtle">
              {label}
            </span>
          </div>
          {sparklineData && <Sparkline data={sparklineData} accentToken={accentToken} />}
        </div>

        {/* Value + change */}
        <div className="flex items-end justify-between">
          <span className="text-[28px] font-bold text-foreground tracking-tight leading-none">
            {value}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-[14px] font-semibold px-2 py-0.5 rounded-full ${
              isNeutral
                ? "text-foreground-subtle bg-foreground-muted/5"
                : isPositive
                ? "text-success bg-success/8"
                : "text-danger bg-danger/8"
            }`}
          >
            {isNeutral ? (
              <Minus className="h-3 w-3" />
            ) : isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {change > 0 ? "+" : ""}{change}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── KPIs de la semana ─────────────────────────────────────────────── */
/* Tres series de `--color-chart-*`. Se cogen 1/3/5 (turquesa, azul, rosa) y no
   1/2/3: chart-2 es un turquesa casi igual que chart-1 y las tres tarjetas se
   leen en paralelo. */
export function SummaryKpis({ kpis }: { kpis: WeeklySummaryKPIs }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KPICard
        label="Ingresos"
        value={`${kpis.total_income.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€`}
        change={kpis.income_change_pct}
        icon={<Euro className="h-4.5 w-4.5" />}
        accentToken="chart-1"
        sparklineData={kpis.daily_income}
      />
      <KPICard
        label="Reservas"
        value={String(kpis.total_reservations)}
        change={kpis.reservations_change_pct}
        icon={<CalendarDays className="h-4.5 w-4.5" />}
        accentToken="chart-3"
        sparklineData={kpis.daily_reservations}
      />
      <KPICard
        label="Productos"
        value={String(kpis.total_product_sales)}
        change={kpis.product_sales_change_pct}
        icon={<ShoppingBag className="h-4.5 w-4.5" />}
        accentToken="chart-5"
        sparklineData={kpis.daily_products}
      />
    </div>
  );
}

/* ── Detail chips ──────────────────────────────────────────────────── */
export function SummaryChips({ kpis }: { kpis: WeeklySummaryKPIs }) {
  return (
    <div className="flex flex-wrap gap-2">
      {kpis.best_day !== "N/A" && (
        <span className="inline-flex items-center rounded-full bg-success/8 border border-success/10 px-3 py-1 text-[14px] font-medium text-success tracking-wide">
          Mejor día: {kpis.best_day}
        </span>
      )}
      {kpis.worst_day !== "N/A" && (
        <span className="inline-flex items-center rounded-full bg-danger/8 border border-danger/10 px-3 py-1 text-[14px] font-medium text-danger tracking-wide">
          Peor día: {kpis.worst_day}
        </span>
      )}
      {kpis.top_service !== "N/A" && (
        <span className="inline-flex items-center rounded-full bg-primary/8 border border-primary/10 px-3 py-1 text-[14px] font-medium text-primary tracking-wide">
          Top: {kpis.top_service}
        </span>
      )}
    </div>
  );
}

/* ── Helper to normalize opportunity format ────────────────────────── */
function normalizeOpportunity(opp: Opportunity | string): Opportunity {
  if (typeof opp === "string") return { text: opp, impact: "medio" };
  return opp;
}

const IMPACT_STYLES: Record<string, { badge: string; icon: React.ReactNode; accent: string }> = {
  alto: {
    badge: "text-warning bg-warning/10 border border-warning/15",
    icon: <Zap className="h-3 w-3" />,
    accent: "from-warning/30 to-warning/5",
  },
  medio: {
    badge: "text-primary bg-primary/8 border border-primary/10",
    icon: <ArrowRight className="h-3 w-3" />,
    accent: "from-primary/20 to-primary/5",
  },
  bajo: {
    badge: "text-foreground-subtle bg-foreground-muted/8 border border-foreground-muted/10",
    icon: <CircleDot className="h-3 w-3" />,
    accent: "from-foreground-muted/15 to-foreground-muted/5",
  },
};

/* ── Opportunities section ─────────────────────────────────────────── */
export function SummaryOpportunities({ kpis }: { kpis: WeeklySummaryKPIs }) {
  const rawOpps = kpis.opportunities ?? [];
  if (rawOpps.length === 0) return null;
  const opps = rawOpps.map(normalizeOpportunity);

  return (
    <section className="h-full flex flex-col animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      <h2 className="text-[16px] font-semibold text-foreground mb-3 flex items-center gap-2.5 tracking-tight">
        <div className="h-6 w-6 rounded-lg bg-warning/10 border border-warning/10 flex items-center justify-center">
          <Lightbulb className="h-3 w-3 text-warning" />
        </div>
        Oportunidades
      </h2>
      <div className="space-y-2.5 flex-1">
        {opps.map((opp, i) => {
          const style = IMPACT_STYLES[opp.impact] || IMPACT_STYLES.medio;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl border border-border-subtle bg-surface px-5 py-4 transition-all duration-200 hover:border-border group"
            >
              {/* Left accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${style.accent}`} />
              <div className="flex gap-3.5 items-start">
                <span className="text-[14px] font-bold text-foreground-subtle mt-0.5 shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] text-foreground/90 leading-[1.7]">
                    {opp.text}
                  </p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-[0.1em] ${style.badge}`}>
                  {style.icon}
                  {opp.impact}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Provider hook ─────────────────────────────────────────────────── */
export function useWeeklySummaryData() {
  const { summary, loading, error, generateSummary } = useWeeklySummary();
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError(null);
    try {
      await generateSummary();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error al generar el resumen";
      setGenError(msg);
    }
    setGenerating(false);
  };

  let kpis: WeeklySummaryKPIs | null = null;
  if (summary) {
    try {
      kpis = JSON.parse(summary.kpis);
    } catch {
      // malformed
    }
  }

  return { summary, kpis, loading, error, generating, genError, handleGenerate };
}
