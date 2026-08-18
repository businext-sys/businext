"use client";

import { useMemo } from "react";
import { Star } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { darkChartOptions } from "@/lib/chartjs-dark-theme";
import { colorToken } from "@/lib/theme-tokens";
import type { GoogleBusinessProfile } from "@/lib/google-reviews/types";

ChartJS.register(ArcElement, Tooltip, Legend);

type ReviewMetricsProps = {
  profile: GoogleBusinessProfile;
};

/**
 * Rampa de la distribucion de estrellas, de 5 a 1.
 *
 * No usa la paleta categorica `--color-chart-*` de corrido porque la escala es
 * ordinal: los tokens de estado dan la direccion bueno -> malo y `chart-1` /
 * `chart-3` cubren el tramo medio con hues distintos de sus vecinos (las cinco
 * series de la paleta incluyen dos turquesas casi identicos, ilegibles como
 * porciones contiguas de un donut).
 *
 * Se guardan los nombres de token, no los colores: el canvas los necesita
 * resueltos (`colorToken`) y el DOM como `var(--color-*)`.
 */
const RATING_SCALE_TOKENS = [
  "success", // 5 estrellas
  "chart-1", // 4 estrellas
  "chart-3", // 3 estrellas
  "warning", // 2 estrellas
  "danger", // 1 estrella
] as const;

export function ReviewMetrics({ profile }: ReviewMetricsProps) {
  const scores = profile.reviewsPerScore || {};
  const total = profile.totalReviews || 0;
  const starLevels = [5, 4, 3, 2, 1];

  /* Los tokens se leen dentro de los memos: solo existen en el navegador, y el
     primer render de cliente (donde se pinta el canvas) ya los resuelve. */
  const chartData = useMemo(() => ({
    labels: starLevels.map((s) => `${s} estrellas`),
    datasets: [
      {
        data: starLevels.map((s) => scores[String(s)] ?? 0),
        backgroundColor: RATING_SCALE_TOKENS.map((token) => colorToken(token)),
        borderColor: "transparent",
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [scores]);

  const chartOptions = useMemo(() => {
    const baseOptions = darkChartOptions();
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      animation: baseOptions.animation,
      plugins: {
        ...baseOptions.plugins,
        legend: { display: false },
      },
    };
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <h3 className="text-h4 font-heading font-semibold text-foreground">
          Distribución de calificaciones
        </h3>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-6 items-center">
          {/* Left: Donut chart */}
          <div className="relative h-44">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-h3 font-bold text-foreground">{total}</span>
              <span className="text-caption text-foreground-muted">Total</span>
            </div>
          </div>

          {/* Right: Bar list */}
          <div className="space-y-2.5">
            {starLevels.map((star, idx) => {
              const count = scores[String(star)] ?? 0;
              const pct = total > 0 ? (count / total) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-10 justify-end shrink-0">
                    <span className="text-body-sm font-semibold text-foreground">
                      {star}
                    </span>
                    <Star className="w-4 h-4 text-warning fill-warning" />
                  </div>
                  <div className="flex-1 h-2.5 bg-surface-raised rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: `var(--color-${RATING_SCALE_TOKENS[idx]})`,
                      }}
                    />
                  </div>
                  <span className="text-caption font-medium text-foreground-muted w-14 text-right shrink-0">
                    {count} <span className="text-foreground-subtle">({pct.toFixed(0)}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
