import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { Finances, AnualBalances } from "../finances";
import { mapFinanceFromApi } from "../mappers/finances";

const PATH = "/finances";

export const financesApi = {
  list: (client: ApiClient = apiClient): Promise<Finances[]> =>
    client
      .get<Record<string, unknown>[]>(PATH)
      .then((data) => data.map(mapFinanceFromApi)),

  /**
   * NOTA (issue #028): el sufijo de esta ruta diverge entre el BFF de
   * apps/web (`/api/finances/anual/{year}`) y el backend real
   * (`/finances/annual_finances/{year}`) — no es solo el prefijo `/api`,
   * el nombre del segmento tambien cambia. Se usa `client.apiPrefix` para
   * distinguir "estoy hablando con el BFF" (truthy, web) de "estoy
   * hablando con el backend directo" (vacio, mobile) y elegir el sufijo
   * correcto en cada caso.
   */
  listAnual: (year: number, client: ApiClient = apiClient): Promise<AnualBalances[]> => {
    const suffix = client.apiPrefix ? "anual" : "annual_finances";
    return client.get<AnualBalances[]>(`${PATH}/${suffix}/${year}`);
  },

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
