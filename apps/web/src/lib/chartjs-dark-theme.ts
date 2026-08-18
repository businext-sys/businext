/**
 * Chart.js 4.x dark theme para Businext.
 *
 * Todos los colores salen de los tokens de `globals.css` leidos en runtime
 * (ver `theme-tokens.ts`): aqui no hay ningun hex, asi que un cambio de paleta
 * en el theme se refleja en los graficos sin tocar este archivo.
 *
 * Como los tokens solo existen en el navegador, los defaults globales se
 * aplican de forma diferida (`applyChartTheme`) y las opciones se construyen en
 * cada render (`darkChartOptions()`) en vez de ser constantes de modulo.
 */

import { Chart, type ChartOptions } from "chart.js";
import { chartPalette, colorToken } from "@/lib/theme-tokens";

/* ── Reduced-motion detection ── */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
  );
}

let applied = false;

/**
 * Aplica los defaults globales de Chart.js con los tokens del theme.
 * Idempotente y no-op en servidor; `darkChartOptions()` ya lo invoca.
 */
export function applyChartTheme(): void {
  if (applied || typeof document === "undefined") return;
  applied = true;

  const foreground = colorToken("foreground");
  const foregroundMuted = colorToken("foreground-muted");
  const borderSubtle = colorToken("border-subtle");
  const surfaceRaised = colorToken("surface-raised");

  Chart.defaults.color = foregroundMuted;
  Chart.defaults.borderColor = borderSubtle;

  /* Disable chart animations when reduced motion is preferred */
  if (prefersReducedMotion()) {
    Chart.defaults.animation = false;
  }

  /* ── Tooltip ── */
  const tooltip: NonNullable<ChartOptions["plugins"]>["tooltip"] = {
    backgroundColor: surfaceRaised,
    titleColor: foreground,
    bodyColor: foregroundMuted,
    borderColor: borderSubtle,
    borderWidth: 1,
    padding: 10,
    cornerRadius: 8,
    caretSize: 6,
    displayColors: true,
    boxPadding: 4,
    titleFont: { weight: "bold" as const },
  };

  /* ── Legend ── */
  const legend: NonNullable<ChartOptions["plugins"]>["legend"] = {
    labels: {
      color: foregroundMuted,
      padding: 12,
      font: { size: 12 },
      usePointStyle: true,
      pointStyleWidth: 8,
    },
  };

  Chart.defaults.plugins.tooltip = {
    ...Chart.defaults.plugins.tooltip,
    ...tooltip,
  } as typeof Chart.defaults.plugins.tooltip;

  Chart.defaults.plugins.legend = {
    ...Chart.defaults.plugins.legend,
    ...legend,
  } as typeof Chart.defaults.plugins.legend;

  /* ── Grid & Ticks ── */
  Chart.defaults.scale.grid.color = borderSubtle;
  Chart.defaults.scale.ticks.color = foregroundMuted;
}

/**
 * Color de la serie `index` de la paleta de charts, ciclando la paleta.
 * Devuelve "" en servidor (el canvas solo se pinta en cliente).
 */
export function paletteColor(index: number): string {
  const palette = chartPalette();
  if (!palette.length) return "";
  return palette[index % palette.length];
}

/** Opciones comunes de los charts (merge con las opciones de cada chart). */
export function darkChartOptions() {
  applyChartTheme();

  const foreground = colorToken("foreground");
  const foregroundMuted = colorToken("foreground-muted");
  const borderSubtle = colorToken("border-subtle");
  const surfaceRaised = colorToken("surface-raised");

  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: prefersReducedMotion()
      ? (false as const)
      : { duration: 400, easing: "easeOutQuart" as const },
    plugins: {
      tooltip: {
        backgroundColor: surfaceRaised,
        titleColor: foreground,
        bodyColor: foregroundMuted,
        borderColor: borderSubtle,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        caretSize: 6,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { color: "transparent" },
        ticks: { color: foregroundMuted, font: { size: 11 } },
      },
      y: {
        grid: { color: borderSubtle },
        ticks: {
          color: foregroundMuted,
          font: { size: 11 },
        },
      },
    },
  };
}
