"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SummaryChips,
  SummaryKpis,
  SummaryOpportunities,
  useWeeklySummaryData,
} from "@/components/intelligence/WeeklySummary";
import { cn } from "@/lib/utils";
import { ChevronDown, RefreshCw, Sparkles } from "lucide-react";

function WeekStat({ label, value, change }: { label: string; value: string; change: number }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-caption text-foreground-muted">{label}</span>
      <span className="font-heading text-h4 font-bold text-foreground">{value}</span>
      <span
        className={cn(
          "text-caption font-semibold",
          change > 0 ? "text-success" : change < 0 ? "text-danger" : "text-foreground-muted"
        )}
      >
        {change > 0 ? "+" : ""}
        {change}%
      </span>
    </span>
  );
}

export function ReservationWeekSummary() {
  const { summary, kpis, loading, generating, genError, handleGenerate } = useWeeklySummaryData();
  const [open, setOpen] = useState(false);

  if (loading) return <Skeleton className="h-16 rounded-2xl" />;

  if (!summary || !kpis) {
    return (
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 shrink-0 text-secondary" />
            <div>
              <p className="text-body-sm font-semibold text-foreground">Tu semana</p>
              <p className="text-caption text-foreground-muted">
                Aún no hay resumen de la semana pasada.
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleGenerate} loading={generating}>
            Generar resumen
          </Button>
          {genError && <p className="w-full text-caption text-danger">{genError}</p>}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex min-h-11 w-full flex-wrap items-center gap-x-6 gap-y-2 p-4 text-left"
      >
        <span className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 shrink-0 text-secondary" />
          <span>
            <span className="block text-body-sm font-semibold text-foreground">Tu semana</span>
            <span className="block text-caption text-foreground-muted">
              {summary.week_start} — {summary.week_end}
            </span>
          </span>
        </span>
        <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <WeekStat
            label="Ingresos"
            value={`${kpis.total_income.toLocaleString("es-ES")}€`}
            change={kpis.income_change_pct}
          />
          <WeekStat
            label="Reservas"
            value={String(kpis.total_reservations)}
            change={kpis.reservations_change_pct}
          />
          <WeekStat
            label="Productos"
            value={String(kpis.total_product_sales)}
            change={kpis.product_sales_change_pct}
          />
        </span>
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <CardContent className="space-y-4 border-t border-border-subtle p-4">
          <SummaryKpis kpis={kpis} />
          <SummaryChips kpis={kpis} />
          <SummaryOpportunities kpis={kpis} />
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleGenerate} loading={generating}>
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerar
            </Button>
            {genError && <p className="text-caption text-danger">{genError}</p>}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
