"use client";
import useSWR from "swr";
import type { RemindersSetting } from "../configuration";
import { configurationApi } from "../api/configurationApi";

const KEY = "/api/configuration/reminders";

export function useRemindersSetting(enabled = true) {
  const {
    data: setting,
    isLoading: loading,
    error,
    mutate,
  } = useSWR<RemindersSetting>(enabled ? KEY : null, () =>
    configurationApi.getReminders()
  );

  const updateRemindersSetting = async (
    update: RemindersSetting
  ): Promise<RemindersSetting | null> => {
    try {
      return (
        (await mutate(() => configurationApi.updateReminders(update), {
          optimisticData: update,
          rollbackOnError: true,
          revalidate: false,
        })) ?? null
      );
    } catch {
      return null;
    }
  };

  return { setting, loading, error, updateRemindersSetting };
}
