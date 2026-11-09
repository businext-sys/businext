import type { ContentFormat, ContentSuggestion, SocialNetwork } from "@businext/shared-core/trends";
import { formatDayLabel, formatHour, isSameDay } from "@/lib/date";

export const networkLabels: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
};

export const formatLabels: Record<ContentFormat, string> = {
  reel: "Reel",
  short: "Short",
  carrusel: "Carrusel",
  story: "Story",
};

export function isActiveSuggestion(suggestion: ContentSuggestion): boolean {
  return suggestion.status !== "dismissed" && suggestion.status !== "published";
}

export function formatPublishAt(publishAt: string): string {
  const hour = formatHour(publishAt);
  return isSameDay(publishAt, new Date())
    ? `Hoy, ${hour}`
    : `${formatDayLabel(new Date(publishAt))}, ${hour}`;
}
