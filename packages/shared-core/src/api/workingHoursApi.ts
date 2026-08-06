import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { WorkingHoursBlock } from "../working-hours";
import {
  mapWorkingHoursFromApi,
  mapWorkingHoursToApi,
} from "../working-hours";

function buildPath(memberUserId?: string | null) {
  return memberUserId
    ? `/api/working-hours?member_user_id=${memberUserId}`
    : "/api/working-hours";
}

export const workingHoursApi = {
  list: (
    memberUserId: string | null | undefined,
    client: ApiClient = apiClient
  ): Promise<WorkingHoursBlock[]> =>
    client
      .get<Record<string, unknown>[]>(buildPath(memberUserId))
      .then((data) => data.map(mapWorkingHoursFromApi)),

  update: async (
    hours: WorkingHoursBlock[],
    memberUserId: string | null | undefined,
    client: ApiClient = apiClient
  ): Promise<WorkingHoursBlock[]> => {
    const data = await client.put<Record<string, unknown>[]>(
      buildPath(memberUserId),
      hours.map(mapWorkingHoursToApi)
    );
    return data.map(mapWorkingHoursFromApi);
  },
};
