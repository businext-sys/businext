import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type {
  LoyaltyCard,
  LoyaltyCardLookup,
  LoyaltyPassSent,
  LoyaltyProgram,
  LoyaltyProgramSettings,
  LoyaltyScanResult,
  PublicLoyaltyInfo,
} from "../loyalty";
import {
  mapLoyaltyCardFromApi,
  mapLoyaltyPassSentFromApi,
  mapLoyaltyProgramFromApi,
  mapLoyaltyProgramSettingsToApi,
  mapLoyaltyScanResultFromApi,
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
  init: { method?: "GET" | "POST" | "PUT" | "DELETE"; body?: unknown } = {}
): Promise<Record<string, unknown>> {
  const { body } = init;
  const response = await client.raw(path, {
    method: init.method ?? "GET",
    // FormData lleva su propio Content-Type (multipart con boundary).
    ...(body instanceof FormData
      ? { body }
      : body !== undefined
        ? { body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }
        : {}),
  });
  if (!response.ok) throw await errorFrom(response, fallback);
  return response.json();
}

const cardPath = (serialNumber: string, action = "") =>
  `${PATH}/cards/${encodeURIComponent(serialNumber)}${action}`;

const scanPath = (token: string, action = "") =>
  `${PATH}/scan/${encodeURIComponent(token)}${action}`;

/** Lo que acepta `uploadLogo`: el `File`/`Blob` de web o el `{ uri, name, type }` de React Native. */
export type LoyaltyLogoFile = Blob | { uri: string; name: string; type: string };

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

  /**
   * (Re)envía al email del cliente el enlace para añadir el pase a Apple Wallet.
   * 503 si Wallet no está configurado; 502 si el email no salió.
   */
  sendPass: async (serialNumber: string, client: ApiClient = apiClient): Promise<LoyaltyPassSent> =>
    mapLoyaltyPassSentFromApi(
      await send(client, cardPath(serialNumber, "/send-pass"), "No se pudo reenviar la tarjeta", {
        method: "POST",
      })
    ),

  /** Tarjeta del QR del pase (`token` = lo que lleva el QR). 404 si no es de este negocio. */
  scan: async (token: string, client: ApiClient = apiClient): Promise<LoyaltyScanResult> =>
    mapLoyaltyScanResultFromApi(
      await send(client, scanPath(token), "No se pudo leer la tarjeta")
    ),

  /**
   * Sello manual (visita sin reserva) a la tarjeta escaneada. Uno al día como
   * mucho: si ya tenía sello de hoy, `stampAdded` es `false`. 409 si la tarjeta
   * está desactivada.
   */
  stampScanned: async (token: string, client: ApiClient = apiClient): Promise<LoyaltyScanResult> =>
    mapLoyaltyScanResultFromApi(
      await send(client, scanPath(token, "/stamp"), "No se pudo añadir el sello", {
        method: "POST",
      })
    ),

  /** Sube el logo del pase (PNG, JPG o WebP, hasta 2 MB). Solo owner. 422 si no vale. */
  uploadLogo: async (file: LoyaltyLogoFile, client: ApiClient = apiClient): Promise<LoyaltyProgram> => {
    const form = new FormData();
    form.append("file", file as Blob);
    return mapLoyaltyProgramFromApi(
      await send(client, `${PATH}/program/logo`, "No se pudo subir el logo", {
        method: "PUT",
        body: form,
      })
    );
  },

  /** Quita el logo propio: los pases vuelven a llevar el de Businext. Solo owner. */
  deleteLogo: async (client: ApiClient = apiClient): Promise<LoyaltyProgram> =>
    mapLoyaltyProgramFromApi(
      await send(client, `${PATH}/program/logo`, "No se pudo quitar el logo", { method: "DELETE" })
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
