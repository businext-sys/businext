import type { ApiClient } from "./client";
import { apiClient, resourcePath } from "./client";
import type { Configuration, RemindersSetting } from "../configuration";
import {
  mapConfigurationFromApi,
  mapConfigurationToApi,
  mapRemindersSettingFromApi,
  mapRemindersSettingToApi,
} from "../mappers/configuration";

const PATH = "/configuration";
const REMINDERS_PATH = "/configuration/reminders";

export const configurationApi = {
  list: (client: ApiClient = apiClient): Promise<Configuration[]> =>
    client
      .get<Record<string, unknown>[]>(PATH)
      .then((data) => data.map(mapConfigurationFromApi)),

  create: async (
    configuration: Omit<Configuration, "id">,
    client: ApiClient = apiClient
  ): Promise<Configuration> => {
    const data = await client.post<Record<string, unknown>>(
      PATH,
      configuration
    );
    return mapConfigurationFromApi(data);
  },

  update: async (
    configuration: Configuration,
    client: ApiClient = apiClient
  ): Promise<Configuration> => {
    const { id, ...updateData } = configuration;
    const data = await client.patch<Record<string, unknown>>(
      resourcePath(client, PATH, id),
      updateData
    );
    return mapConfigurationFromApi(data);
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.delete(resourcePath(client, PATH, id)),

  getReminders: (client: ApiClient = apiClient): Promise<RemindersSetting> =>
    client
      .get<Record<string, unknown>>(REMINDERS_PATH)
      .then(mapRemindersSettingFromApi),

  updateReminders: async (
    setting: RemindersSetting,
    client: ApiClient = apiClient
  ): Promise<RemindersSetting> => {
    const data = await client.put<Record<string, unknown>>(
      REMINDERS_PATH,
      mapRemindersSettingToApi(setting)
    );
    return mapRemindersSettingFromApi(data);
  },
};

export { mapConfigurationToApi };
