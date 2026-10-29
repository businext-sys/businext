"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useVoiceAgentStats } from "@/hooks/useVoiceAgentCalls";
import { useThemeMode } from "@/hooks/useThemeMode";
import { darkChartOptions } from "@/lib/chartjs-dark-theme";
import { colorToken } from "@/lib/theme-tokens";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatDuration } from "./format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PERIODS = [7, 30, 90];

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-surface p-4">
      <p className="text-caption font-medium uppercase text-foreground-muted">{label}</p>
      <p className="mt-2 font-heading text-h1 font-bold text-foreground">{value}</p>
      {hint && <p className="mt-1 text-caption text-secondary">{hint}</p>}
    </div>
  );
}

export function VoiceCallKpis() {
  const [days, setDays] = useState(30);
  const { stats, loading, error } = useVoiceAgentStats(days);
  useThemeMode();

  if (loading && !stats) return <SectionSkeleton />;
  if (error || !stats) {
    return (
      <p className="text-body-sm text-danger">No se pudieron cargar las métricas de llamadas.</p>
    );
  }

  const baseOptions = darkChartOptions();
  const labels = stats.daily.map((d) =>
    new Date(`${d.date}T00:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {PERIODS.map((period) => (
          <button
            key={period}
            onClick={() => setDays(period)}
            className={cn(
              "h-8 rounded-full px-3 text-caption font-medium transition-colors",
              days === period
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {period} días
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        <Kpi
          label="Llamadas atendidas"
          value={String(stats.answeredCalls)}
          hint={stats.rejectedCalls ? `${stats.rejectedCalls} rechazadas` : undefined}
        />
        <Kpi
          label="Reservas por teléfono"
          value={String(stats.bookings)}
          hint={`${Math.round(stats.bookingRate * 100)}% de conversión`}
        />
        <Kpi
          label="Duración media"
          value={formatDuration(stats.avgDurationSeconds)}
          hint={`${stats.totalMinutes.toLocaleString("es-ES")} min en total`}
        />
        <Kpi
          label="Clientes satisfechos"
          value={String(stats.positiveCalls)}
          hint={stats.negativeCalls ? `${stats.negativeCalls} con tono negativo` : undefined}
        />
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-heading text-h4 font-semibold text-foreground">
            Llamadas y reservas por día
          </h3>
        </CardHeader>
        <CardContent>
          <div className="relative h-[220px] w-full sm:h-[260px]">
            <Bar
              data={{
                labels,
                datasets: [
                  {
                    label: "Llamadas",
                    data: stats.daily.map((d) => d.calls),
                    backgroundColor: colorToken("chart-1"),
                    borderRadius: 4,
                  },
                  {
                    label: "Reservas",
                    data: stats.daily.map((d) => d.bookings),
                    backgroundColor: colorToken("chart-2"),
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                ...baseOptions,
                plugins: { ...baseOptions.plugins, title: { display: false } },
                scales: {
                  ...baseOptions.scales,
                  y: {
                    ...baseOptions.scales.y,
                    ticks: { ...baseOptions.scales.y.ticks, precision: 0 },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
