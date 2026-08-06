import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { Configuration } from "../configuration";
import {
  mapConfigurationFromApi,
  mapConfigurationToApi,
} from "../mappers/configuration";

const PATH = "/api/configuration";

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
      `${PATH}?id=${id}`,
      updateData
    );
    return mapConfigurationFromApi(data);
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.delete(`${PATH}?id=${id}`),
};

export { mapConfigurationToApi };
