"use client";
import useSWR from "swr";
import type {
  ContentPreferences,
  ContentSuggestion,
  SuggestionStatus,
  SuggestionStatusUpdate,
  TrendInsight,
} from "../trends";
import { trendsApi } from "../api/trendsApi";

const INSIGHT_KEY = "/api/trends/insight";
const SUGGESTIONS_KEY = "/api/trends/suggestions";
const PREFERENCES_KEY = "/api/trends/preferences";

/** Ultimo analisis de tendencias; cambia una vez al dia, sin revalidar al foco. */
export function useTrendInsight(enabled = true) {
  const { data, isLoading: loading, error, mutate } = useSWR<TrendInsight | null>(
    enabled ? INSIGHT_KEY : null,
    () => trendsApi.getInsight(),
    { revalidateOnFocus: false }
  );

  /** Devuelve el mensaje de error del backend, o `null` si fue bien. */
  const refresh = async (): Promise<string | null> => {
    try {
      await mutate(() => trendsApi.refreshInsight(), { revalidate: false });
      return null;
    } catch (err) {
      return err instanceof Error ? err.message : "Error al actualizar el análisis";
    }
  };

  return { insight: data ?? null, loading, error, refresh };
}

/** Sugerencias de contenido del negocio, por hora de publicacion. */
export function useContentSuggestions(status?: SuggestionStatus, enabled = true) {
  const { data, isLoading: loading, error, mutate } = useSWR<ContentSuggestion[]>(
    enabled ? `${SUGGESTIONS_KEY}${status ? `?status=${status}` : ""}` : null,
    () => trendsApi.listSuggestions(status)
  );
  const suggestions = data ?? [];

  const setStatus = async (id: number, next: SuggestionStatusUpdate): Promise<boolean> => {
    try {
      await mutate(
        async () => {
          const updated = await trendsApi.updateSuggestion(id, next);
          return suggestions.map((s) => (s.id === id ? updated : s));
        },
        {
          optimisticData: suggestions.map((s) => (s.id === id ? { ...s, status: next } : s)),
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return true;
    } catch {
      return false;
    }
  };

  return {
    suggestions,
    loading,
    error,
    markOpened: (id: number) => setStatus(id, "opened"),
    dismiss: (id: number) => setStatus(id, "dismissed"),
    markPublished: (id: number) => setStatus(id, "published"),
    refresh: () => mutate(),
  };
}

/** Preferencias de contenido del negocio, con guardado optimista. */
export function useContentPreferences(enabled = true) {
  const { data: preferences, isLoading: loading, error, mutate } = useSWR<ContentPreferences>(
    enabled ? PREFERENCES_KEY : null,
    () => trendsApi.getPreferences()
  );

  const savePreferences = async (next: ContentPreferences): Promise<ContentPreferences | null> => {
    try {
      return (
        (await mutate(() => trendsApi.savePreferences(next), {
          optimisticData: next,
          rollbackOnError: true,
          revalidate: false,
        })) ?? null
      );
    } catch {
      return null;
    }
  };

  return { preferences, loading, error, savePreferences };
}
