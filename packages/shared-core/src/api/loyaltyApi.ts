import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type {
  LoyaltyCard,
  LoyaltyCardLookup,
  LoyaltyProgram,
  LoyaltyProgramSettings,
  PublicLoyaltyInfo,
} from "../loyalty";
import {
  mapLoyaltyCardFromApi,
  mapLoyaltyProgramFromApi,
  mapLoyaltyProgramSettingsToApi,
  mapPublicLoyaltyInfoFromApi,
} from "../mappers/loyalty";

/**
 * Las rutas son las mismas en web y en mobile: el BFF de apps/web las sirve
 * con un catch-all (`/api/loyalty/[...path]`, `/api/public/loyalty/[...path]`).
 */
const PATH = "/loyalty";
const PUBLIC_PATH = "/public/loyalty";

/** Error con el `detail` del backend y su `status` (404, 409, 422, 503...). */
export class LoyaltyError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

async function errorFrom(response: Response, fallback: string) {
  const err = await response.json().catch(() => ({}));
  const detail = typeof err.detail === "string" ? err.detail : undefined;
  return new LoyaltyError(detail || err.error || fallback, response.status);
}

async function send(
  client: ApiClient,
  path: string,
  fallback: string,
  init: { method?: "GET" | "POST" | "PUT"; body?: unknown } = {}
): Promise<Record<string, unknown>> {
  const response = await client.raw(path, {
    method: init.method ?? "GET",
    ...(init.body !== undefined
      ? { body: JSON.stringify(init.body), headers: { "Content-Type": "application/json" } }
      : {}),
  });
  if (!response.ok) throw await errorFrom(response, fallback);
  return response.json();
}

const cardPath = (serialNumber: string, action = "") =>
  `${PATH}/cards/${encodeURIComponent(serialNumber)}${action}`;

export function loyaltyLookupQuery(lookup: LoyaltyCardLookup): string | null {
  const email = lookup.email?.trim();
  if (email) return `email=${encodeURIComponent(email)}`;
  const name = lookup.name?.trim();
  if (name) return `name=${encodeURIComponent(name)}`;
  return null;
}

/** Tarjeta de fidelidad (ADR 0003 de businext-backend). */
export const loyaltyApi = {
  /** Regla del negocio. Cualquier rol. Sin configurar: desactivada, 10 sellos, «Corte gratis». */
  getProgram: async (client: ApiClient = apiClient): Promise<LoyaltyProgram> =>
    mapLoyaltyProgramFromApi(
      await send(client, `${PATH}/program`, "No se pudo cargar la tarjeta de fidelidad")
    ),

  /** Activa la tarjeta y fija la regla y los colores. Solo owner (403 al resto). */
  updateProgram: async (
    settings: LoyaltyProgramSettings,
    client: ApiClient = apiClient
  ): Promise<LoyaltyProgram> =>
    mapLoyaltyProgramFromApi(
      await send(client, `${PATH}/program`, "No se pudo guardar la tarjeta de fidelidad", {
        method: "PUT",
        body: mapLoyaltyProgramSettingsToApi(settings),
      })
    ),

  /** Tarjeta de un cliente por email o nombre. `null` si aún no tiene (404). */
  getCard: async (
    lookup: LoyaltyCardLookup,
    client: ApiClient = apiClient
  ): Promise<LoyaltyCard | null> => {
    const query = loyaltyLookupQuery(lookup);
    if (!query) return null;
    const response = await client.raw(`${PATH}/cards?${query}`);
    if (response.status === 404) return null;
    if (!response.ok) throw await errorFrom(response, "No se pudo cargar la tarjeta");
    return mapLoyaltyCardFromApi(await response.json());
  },

  /** Crea (o devuelve) la tarjeta de un cliente. 409 si la tarjeta está desactivada. */
  createCard: async (
    customer: { customerName: string; customerEmail: string },
    client: ApiClient = apiClient
  ): Promise<LoyaltyCard> =>
    mapLoyaltyCardFromApi(
      await send(client, `${PATH}/cards`, "No se pudo crear la tarjeta", {
        method: "POST",
        body: { customer_name: customer.customerName, customer_email: customer.customerEmail },
      })
    ),

  /** Entrega el premio: gasta los sellos más antiguos. 409 si no tiene suficientes. */
  redeem: async (serialNumber: string, client: ApiClient = apiClient): Promise<LoyaltyCard> =>
    mapLoyaltyCardFromApi(
      await send(client, cardPath(serialNumber, "/redeem"), "No se pudo canjear el premio", {
        method: "POST",
      })
    ),

  /** Para la página pública de reservas: si el negocio tiene la tarjeta activa. Sin auth. */
  getPublicInfo: async (
    businessId: string,
    client: ApiClient = apiClient
  ): Promise<PublicLoyaltyInfo> =>
    mapPublicLoyaltyInfoFromApi(
      await send(
        client,
        `${PUBLIC_PATH}/${encodeURIComponent(businessId)}`,
        "No se pudo cargar la tarjeta de fidelidad"
      )
    ),
};
