"use client";
import useSWR from "swr";
import type { WorkingHoursBlock } from "../working-hours";
import { workingHoursApi } from "../api/workingHoursApi";

function buildKey(memberUserId?: string | null) {
  if (memberUserId) return `/api/working-hours?member_user_id=${memberUserId}`;
  return "/api/working-hours";
}

export function useWorkingHours(memberUserId?: string | null, enabled = true) {
  const key = enabled ? buildKey(memberUserId) : null;
  const {
    data: workingHoursData = [],
    isLoading: loading,
    error,
    mutate,
  } = useSWR<WorkingHoursBlock[]>(key, () => workingHoursApi.list(memberUserId));

  const updateWorkingHours = async (
    hours: WorkingHoursBlock[]
  ): Promise<WorkingHoursBlock[] | null> => {
    try {
      await mutate(
        async () => workingHoursApi.update(hours, memberUserId),
        {
          optimisticData: hours,
          rollbackOnError: true,
          revalidate: false,
        }
      );
      return hours;
    } catch {
      return null;
    }
  };

  return {
    workingHoursData,
    loading,
    error,
    updateWorkingHours,
  };
}
