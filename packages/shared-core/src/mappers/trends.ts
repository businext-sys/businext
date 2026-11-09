import type { ContentPreferences, ContentSuggestion, TrendInsight } from "../trends";
import {
  ContentPreferencesSchema,
  ContentSuggestionSchema,
  TrendInsightSchema,
} from "../schemas/trends";

export const mapTrendInsightFromApi = (data: Record<string, unknown>): TrendInsight =>
  TrendInsightSchema.parse({
    id: data.id,
    day: data.day,
    analysis: data.analysis,
    matchedServices: data.matched_services ?? [],
    trends: data.trends ?? [],
    createdAt: data.created_at,
    refreshedAt: data.refreshed_at ?? null,
  });

export const mapContentSuggestionFromApi = (
  data: Record<string, unknown>
): ContentSuggestion =>
  ContentSuggestionSchema.parse({
    id: data.id,
    network: data.network,
    format: data.format,
    idea: data.idea,
    script: data.script ?? [],
    captionHint: data.caption_hint,
    audioHint: data.audio_hint ?? null,
    publishAt: data.publish_at,
    sourceTrendIds: data.source_trend_ids ?? [],
    status: data.status,
    sentAt: data.sent_at ?? null,
  });

/** El backend devuelve las horas como `HH:mm:ss`; la UI trabaja con `HH:mm`. */
const toHourMinute = (value: unknown) => String(value ?? "").slice(0, 5);

export const mapContentPreferencesFromApi = (
  data: Record<string, unknown>
): ContentPreferences =>
  ContentPreferencesSchema.parse({
    enabled: data.enabled,
    networks: data.networks ?? [],
    maxPerDay: data.max_per_day,
    quietFrom: toHourMinute(data.quiet_from),
    quietTo: toHourMinute(data.quiet_to),
    timezone: data.timezone,
    niche: data.niche,
    language: data.language,
    country: data.country,
  });

export const mapContentPreferencesToApi = (preferences: ContentPreferences) => ({
  enabled: preferences.enabled,
  networks: preferences.networks,
  max_per_day: preferences.maxPerDay,
  quiet_from: preferences.quietFrom,
  quiet_to: preferences.quietTo,
  timezone: preferences.timezone,
  niche: preferences.niche,
  language: preferences.language,
  country: preferences.country,
});
