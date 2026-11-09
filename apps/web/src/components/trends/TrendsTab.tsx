"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContentSuggestion, TrendInsight } from "@businext/shared-core/trends";
import { useContentPreferences, useContentSuggestions, useTrendInsight } from "@/hooks/useTrends";
import { useGlobalToast } from "@/context/ToastContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { NETWORK_LABELS, SuggestionCard } from "@/components/trends/SuggestionCard";
import { CalendarClock, ExternalLink, Radar, RefreshCw, Sparkles } from "lucide-react";

const UPCOMING_STATUSES: ContentSuggestion["status"][] = ["pending", "sent", "opened"];

export const CONTENT_PREFERENCES_HREF = "/configuration?section=content";

function formatCapturedAt(insight: TrendInsight) {
  const date = new Date(insight.refreshedAt ?? insight.createdAt);
  const day = date.toDateString() === new Date().toDateString()
    ? "hoy"
    : date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
  const time = date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
  return `Datos de ${day}, ${time}`;
}

export function TrendsTab() {
  const router = useRouter();
  const { showToast } = useGlobalToast();
  const { insight, loading: insightLoading, refresh } = useTrendInsight();
  const { preferences, loading: preferencesLoading } = useContentPreferences();
  const { suggestions, loading: suggestionsLoading, markOpened, dismiss, markPublished } =
    useContentSuggestions();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    const error = await refresh();
    setRefreshing(false);
    if (error) showToast("error", error);
    else showToast("success", "Análisis actualizado");
  };

  const handleUpdate = async (update: Promise<boolean>) => {
    if (!(await update)) showToast("error", "No se pudo actualizar la idea");
  };

  if (insightLoading || preferencesLoading) {
    return (
      <div className="space-y-6">
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    );
  }

  if (preferences && !preferences.enabled) {
    return (
      <EmptyState
        icon={<Radar />}
        title="El radar de tendencias está apagado"
        description="Actívalo en tus preferencias de contenido para recibir tendencias e ideas para tus redes."
        action={{ label: "Ir a preferencias", onClick: () => router.push(CONTENT_PREFERENCES_HREF) }}
      />
    );
  }

  const upcoming = suggestions
    .filter((s) => UPCOMING_STATUSES.includes(s.status))
    .sort((a, b) => a.publishAt.localeCompare(b.publishAt));

  return (
    <div className="space-y-6">
      {insight ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-caption font-bold uppercase tracking-[0.1em] text-secondary">
              {formatCapturedAt(insight)}
            </span>
            <Button variant="secondary" size="sm" onClick={handleRefresh} loading={refreshing}>
              <RefreshCw className="h-4 w-4" />
              Actualizar análisis
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-5 space-y-4">
                <h2 className="font-heading text-h4 font-semibold text-foreground">Radar</h2>
                {insight.trends.length === 0 ? (
                  <p className="text-body-sm text-foreground-muted">
                    Hoy no hay tendencias para tus redes.
                  </p>
                ) : (
                  <ul className="divide-y divide-border-subtle">
                    {insight.trends.map((trend) => (
                      <li key={trend.url} className="flex items-center gap-3 py-3">
                        <Badge variant="muted" className="shrink-0">
                          {NETWORK_LABELS[trend.network]}
                        </Badge>
                        <span className="flex-1 min-w-0 text-body-sm text-foreground">
                          {trend.title}
                        </span>
                        <a
                          href={trend.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ver "${trend.title}" en ${NETWORK_LABELS[trend.network]}`}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-foreground-muted hover:bg-surface-raised hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-4">
                <h2 className="font-heading text-h4 font-semibold text-foreground">
                  Para tu barbería
                </h2>
                <p className="text-body-sm text-foreground-muted whitespace-pre-line">
                  {insight.analysis}
                </p>
                {insight.matchedServices.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {insight.matchedServices.map((service) => (
                      <Badge key={service} variant="accent">
                        {service}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Radar />}
          title="Aún no hay análisis de tendencias"
          description="El radar se llena tras la primera captura de tendencias de la mañana. Si ya hay datos de hoy, puedes generar el análisis ahora."
          action={{ label: refreshing ? "Generando…" : "Generar análisis", onClick: handleRefresh }}
        />
      )}

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 font-heading text-h4 font-semibold text-foreground">
          <CalendarClock className="h-5 w-5 text-secondary" />
          Próximas publicaciones
        </h2>
        {suggestionsLoading ? (
          <SectionSkeleton />
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={<Sparkles />}
            title="Sin ideas pendientes"
            description="Te avisaremos con una idea de contenido a la hora que mejor funciona en tus redes."
            className="py-8"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {upcoming.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onOpen={markOpened}
                onDismiss={(id) => handleUpdate(dismiss(id))}
                onPublished={(id) => handleUpdate(markPublished(id))}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
