import { describe, it, expect } from "vitest";
import {
  mapContentPreferencesFromApi,
  mapContentPreferencesToApi,
  mapContentSuggestionFromApi,
  mapTrendInsightFromApi,
} from "../../src/mappers/trends";

const INSIGHT = {
  id: 7,
  day: "2026-11-09",
  analysis: "Los degradados con transicion funcionan.",
  matched_services: ["Corte degradado"],
  trends: [{ title: "Antes y despues", network: "tiktok", url: "https://tiktok.com/@x/video/1" }],
  created_at: "2026-11-09T04:10:00Z",
  refreshed_at: null,
};

const SUGGESTION = {
  id: 13,
  network: "instagram",
  format: "reel",
  idea: "Transicion antes y despues",
  script: ["Plano del antes", "Corte", "Resultado"],
  caption_hint: "Del antes al despues en 30 segundos",
  audio_hint: null,
  publish_at: "2026-11-09T15:00:00Z",
  source_trend_ids: ["https://tiktok.com/@x/video/1"],
  status: "sent",
  sent_at: "2026-11-09T14:15:00Z",
};

const PREFERENCES = {
  enabled: true,
  networks: ["instagram", "tiktok"],
  max_per_day: 1,
  quiet_from: "21:00:00",
  quiet_to: "09:00:00",
  timezone: "Europe/Madrid",
  niche: "barberia",
  language: "es",
  country: "ES",
};

describe("mappers de tendencias (#169)", () => {
  it("mapea el analisis a camelCase", () => {
    expect(mapTrendInsightFromApi(INSIGHT)).toEqual({
      id: 7,
      day: "2026-11-09",
      analysis: "Los degradados con transicion funcionan.",
      matchedServices: ["Corte degradado"],
      trends: INSIGHT.trends,
      createdAt: "2026-11-09T04:10:00Z",
      refreshedAt: null,
    });
  });

  it("mapea la sugerencia con su guion", () => {
    const suggestion = mapContentSuggestionFromApi(SUGGESTION);
    expect(suggestion.captionHint).toBe("Del antes al despues en 30 segundos");
    expect(suggestion.script).toHaveLength(3);
    expect(suggestion.publishAt).toBe("2026-11-09T15:00:00Z");
    expect(suggestion.sentAt).toBe("2026-11-09T14:15:00Z");
  });

  it("rechaza una red desconocida", () => {
    expect(() => mapContentSuggestionFromApi({ ...SUGGESTION, network: "youtube" })).toThrow();
  });

  it("las horas de silencio pasan a HH:mm y vuelven al backend igual", () => {
    const preferences = mapContentPreferencesFromApi(PREFERENCES);
    expect(preferences.quietFrom).toBe("21:00");
    expect(preferences.maxPerDay).toBe(1);
    expect(mapContentPreferencesToApi(preferences)).toEqual({
      ...PREFERENCES,
      quiet_from: "21:00",
      quiet_to: "09:00",
    });
  });
});
