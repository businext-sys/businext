import type { ApiClient } from "./client";
import { apiClient, resourcePath } from "./client";
import type {
  ContentPreferences,
  ContentSuggestion,
  SuggestionStatus,
  SuggestionStatusUpdate,
  TrendInsight,
} from "../trends";
import {
  mapContentPreferencesFromApi,
  mapContentPreferencesToApi,
  mapContentSuggestionFromApi,
  mapTrendInsightFromApi,
} from "../mappers/trends";

const INSIGHT_PATH = "/trends/insight";
const SUGGESTIONS_PATH = "/trends/suggestions";
const PREFERENCES_PATH = "/trends/preferences";

/** Radar de tendencias del negocio (fase #161). Owner y manager. */
export const trendsApi = {
  /** Ultimo analisis; `null` si todavia no hay ninguno (404). */
  getInsight: async (client: ApiClient = apiClient): Promise<TrendInsight | null> => {
    const response = await client.raw(INSIGHT_PATH);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Trends insight fetch failed: ${response.status}`);
    return mapTrendInsightFromApi(await response.json());
  },

  /** Regenera el analisis de hoy (1 vez al dia); el error trae el `detail` del backend. */
  refreshInsight: async (client: ApiClient = apiClient): Promise<TrendInsight> => {
    const response = await client.raw(`${INSIGHT_PATH}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || err.error || "Error al actualizar el análisis");
    }
    return mapTrendInsightFromApi(await response.json());
  },

  listSuggestions: (
    status?: SuggestionStatus,
    client: ApiClient = apiClient
  ): Promise<ContentSuggestion[]> =>
    client
      .get<Record<string, unknown>[]>(
        status ? `${SUGGESTIONS_PATH}?status=${status}` : SUGGESTIONS_PATH
      )
      .then((items) => items.map(mapContentSuggestionFromApi)),

  updateSuggestion: (
    id: number,
    status: SuggestionStatusUpdate,
    client: ApiClient = apiClient
  ): Promise<ContentSuggestion> =>
    client
      .patch<Record<string, unknown>>(resourcePath(client, SUGGESTIONS_PATH, id), { status })
      .then(mapContentSuggestionFromApi),

  getPreferences: (client: ApiClient = apiClient): Promise<ContentPreferences> =>
    client.get<Record<string, unknown>>(PREFERENCES_PATH).then(mapContentPreferencesFromApi),

  savePreferences: (
    preferences: ContentPreferences,
    client: ApiClient = apiClient
  ): Promise<ContentPreferences> =>
    client
      .put<Record<string, unknown>>(PREFERENCES_PATH, mapContentPreferencesToApi(preferences))
      .then(mapContentPreferencesFromApi),
};
