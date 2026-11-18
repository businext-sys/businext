import type { ApiClient } from "./client";
import { apiClient } from "./client";

/**
 * Huecos libres que calcula el backend (`GET /public/book/{business_id}/availability`):
 * inicios cada 15 min donde cabe el servicio entero. Ruta del backend directo
 * (mobile); la web la consume por su BFF `/api/public-book/...`.
 */
export const availabilityApi = {
  /** Horas "HH:MM" libres, o `null` si el backend no responde o aún no admite el servicio. */
  slots: async (
    params: { businessId: string; date: string; employeeName?: string; service?: string },
    client: ApiClient = apiClient
  ): Promise<string[] | null> => {
    const query = new URLSearchParams({ date: params.date });
    if (params.employeeName) query.set("employee_name", params.employeeName);
    if (params.service) query.set("service", params.service);
    try {
      const response = await client.raw(
        `/public/book/${encodeURIComponent(params.businessId)}/availability?${query}`
      );
      if (!response.ok) return null;
      const data = (await response.json()) as { slots?: { time?: unknown }[] };
      if (!Array.isArray(data.slots)) return null;
      const times = data.slots
        .map((slot) => (typeof slot.time === "string" ? slot.time.slice(0, 5) : ""))
        .filter(Boolean);
      return Array.from(new Set(times)).sort();
    } catch {
      return null;
    }
  },
};
