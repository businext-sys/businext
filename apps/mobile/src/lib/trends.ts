import type { ContentFormat, SocialNetwork } from "@businext/shared-core/trends";
import { formatDayLabel, formatHour, isSameDay } from "@/lib/date";

export const networkLabels: Record<SocialNetwork, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
};

export function networkIcon(network: string): "logo-tiktok" | "logo-instagram" | "logo-youtube" | "globe-outline" {
  if (network === "tiktok") return "logo-tiktok";
  if (network === "instagram") return "logo-instagram";
  if (network === "youtube") return "logo-youtube";
  return "globe-outline";
}

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
