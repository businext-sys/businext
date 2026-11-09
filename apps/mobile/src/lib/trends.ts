import type { ContentFormat, SocialNetwork } from "@businext/shared-core/trends";
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

export function formatPublishAt(publishAt: string): string {
  const hour = formatHour(publishAt);
  return isSameDay(publishAt, new Date())
    ? `Hoy, ${hour}`
    : `${formatDayLabel(new Date(publishAt))}, ${hour}`;
}
