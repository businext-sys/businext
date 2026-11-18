import type { ApiClient } from "./client";
import { apiClient } from "./client";

/** Qué avisos push recibe la persona y cuándo. */
export type NotificationPreferences = {
  upcoming: boolean;
  upcomingMinutes: number;
  dailySummary: boolean;
  dailySummaryHour: number;
  reservationChanges: boolean;
  dayClose: boolean;
};

const PATH = "/notification-preferences";

function fromApi(data: Record<string, unknown>): NotificationPreferences {
  return {
    upcoming: Boolean(data.upcoming),
    upcomingMinutes: Number(data.upcoming_minutes ?? 15),
    dailySummary: Boolean(data.daily_summary),
    dailySummaryHour: Number(data.daily_summary_hour ?? 9),
    reservationChanges: Boolean(data.reservation_changes),
    dayClose: Boolean(data.day_close),
  };
}

function toApi(preferences: NotificationPreferences) {
  return {
    upcoming: preferences.upcoming,
    upcoming_minutes: preferences.upcomingMinutes,
    daily_summary: preferences.dailySummary,
    daily_summary_hour: preferences.dailySummaryHour,
    reservation_changes: preferences.reservationChanges,
    day_close: preferences.dayClose,
  };
}

export const notificationPreferencesApi = {
  /** `null` si el backend aún no tiene el endpoint (404). */
  get: async (client: ApiClient = apiClient): Promise<NotificationPreferences | null> => {
    const response = await client.raw(PATH);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return fromApi((await response.json()) as Record<string, unknown>);
  },

  update: async (
    preferences: NotificationPreferences,
    client: ApiClient = apiClient
  ): Promise<NotificationPreferences> =>
    fromApi(await client.put<Record<string, unknown>>(PATH, toApi(preferences))),
};
