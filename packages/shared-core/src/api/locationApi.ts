import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { LocationData, LocationCreate, LocationUpdate } from "../location";

const PATH = "/api/locations";

export const locationApi = {
  list: (client: ApiClient = apiClient): Promise<LocationData[]> =>
    client.get<LocationData[]>(PATH),

  create: async (
    input: LocationCreate,
    client: ApiClient = apiClient
  ): Promise<LocationData> => {
    const response = await client.raw(PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Error al crear el local");
    }
    return response.json() as Promise<LocationData>;
  },

  update: async (
    id: number,
    input: LocationUpdate,
    client: ApiClient = apiClient
  ): Promise<LocationData> => {
    const response = await client.raw(`${PATH}?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Error al actualizar el local");
    }
    return response.json() as Promise<LocationData>;
  },

  remove: async (id: number, client: ApiClient = apiClient): Promise<void> => {
    const response = await client.raw(`${PATH}?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Error al eliminar el local");
    }
  },
};
