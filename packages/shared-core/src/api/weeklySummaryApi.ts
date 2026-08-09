import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { WeeklySummaryData } from "../intelligence";

const PATH = "/intelligence/summary";

export const weeklySummaryApi = {
  get: (client: ApiClient = apiClient): Promise<WeeklySummaryData> =>
    client.get<WeeklySummaryData>(PATH),

  generate: async (client: ApiClient = apiClient): Promise<WeeklySummaryData> => {
    const response = await client.raw(`${PATH}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || err.error || "Error al generar el resumen");
    }
    return response.json() as Promise<WeeklySummaryData>;
  },
};
