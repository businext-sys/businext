import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { CustomerMessage, CustomerMessageDraft } from "../intelligence";
import {
  mapCustomerMessageDraftFromApi,
  mapCustomerMessageFromApi,
} from "../mappers/customer-message";

const PATH = "/customer-messages";

export class CustomerMessageError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

async function errorFrom(response: Response, fallback: string) {
  const err = await response.json().catch(() => ({}));
  return new CustomerMessageError(err.detail || err.error || fallback, response.status);
}

/** Mensaje por email a un cliente en riesgo (issue #186). Owner y manager. */
export const customerMessageApi = {
  getDraft: async (
    customerEmail: string,
    client: ApiClient = apiClient
  ): Promise<CustomerMessageDraft> => {
    const response = await client.raw(
      `${PATH}/draft?email=${encodeURIComponent(customerEmail)}`
    );
    if (!response.ok) throw await errorFrom(response, "No se pudo preparar el mensaje");
    return mapCustomerMessageDraftFromApi(await response.json());
  },

  /** El error lleva el `status` del backend: 404, 429 (ya se le escribió esta semana) o 502. */
  send: async (
    customerEmail: string,
    message: string,
    client: ApiClient = apiClient
  ): Promise<CustomerMessage> => {
    const response = await client.raw(PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_email: customerEmail, message }),
    });
    if (!response.ok) throw await errorFrom(response, "No se pudo enviar el mensaje");
    return mapCustomerMessageFromApi(await response.json());
  },
};
