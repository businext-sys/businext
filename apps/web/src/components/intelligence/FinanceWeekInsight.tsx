"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AiNote } from "@/components/intelligence/AiNote";
import {
  Sparkline,
  SummaryChips,
  useWeeklySummaryData,
} from "@/components/intelligence/WeeklySummary";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function FinanceWeekInsight() {
  const { summary, kpis } = useWeeklySummaryData();

  if (!summary || !kpis) return null;

  const change = kpis.income_change_pct;

  return (
    <Card>
      <CardContent className="space-y-3 p-4 sm:p-6">
        <p className="flex items-center gap-2 text-caption font-bold uppercase tracking-widest text-secondary">
          <Sparkles className="h-3.5 w-3.5" />
          Tu semana · {summary.week_start} — {summary.week_end}
        </p>
        <div className="group flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-heading text-h1 font-bold text-foreground">
            {kpis.total_income.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€
          </span>
          <span
            className={cn(
              "text-body-sm font-semibold",
              change > 0 ? "text-success" : change < 0 ? "text-danger" : "text-foreground-muted"
            )}
          >
            {change > 0 ? "+" : ""}
            {change}% vs. semana anterior
          </span>
          {kpis.daily_income && <Sparkline data={kpis.daily_income} accentToken="chart-1" />}
        </div>
        <SummaryChips kpis={kpis} />
        <AiNote text={summary.narrative} />
      </CardContent>
    </Card>
  );
}
