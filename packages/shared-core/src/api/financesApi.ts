import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { Finances, AnualBalances } from "../finances";
import { mapFinanceFromApi } from "../mappers/finances";

const PATH = "/api/finances";

export const financesApi = {
  list: (client: ApiClient = apiClient): Promise<Finances[]> =>
    client
      .get<Record<string, unknown>[]>(PATH)
      .then((data) => data.map(mapFinanceFromApi)),

  listAnual: (year: number, client: ApiClient = apiClient): Promise<AnualBalances[]> =>
    client.get<AnualBalances[]>(`${PATH}/anual/${year}`),

  create: (
    finance: Omit<Finances, "id">,
    client: ApiClient = apiClient
  ): Promise<Finances> => client.post<Finances>(PATH, finance),

  update: (finance: Finances, client: ApiClient = apiClient): Promise<Finances> => {
    const { id, ...updateData } = finance;
    return client.patch<Finances>(`${PATH}?id=${id}`, updateData);
  },

  /** Lanza `Error("LINKED_TO_RESERVATION")` si el backend responde 409. */
  remove: async (id: number, client: ApiClient = apiClient): Promise<void> => {
    const response = await client.raw(`${PATH}?id=${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 409) {
      throw new Error("LINKED_TO_RESERVATION");
    }
    if (!response.ok) {
      throw new Error("Failed to delete finance");
    }
  },
};
