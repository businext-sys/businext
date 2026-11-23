import type { ApiClient } from "./client";
import { apiClient } from "./client";

/** Cliente que ya ha reservado en el negocio, para autocompletar formularios. */
export type KnownCustomer = {
  name: string;
  phone: string | null;
  email: string | null;
  lastVisit: string | null;
};

export type CustomerReservation = {
  id: number;
  start: string;
  service: string;
  inCharge: string;
  status: string;
};

/** Ficha de un cliente: contacto, historial y próxima cita. */
export type CustomerDetail = {
  name: string;
  phone: string | null;
  email: string | null;
  visits: number;
  noShows: number;
  totalSpent: number;
  lastVisit: string | null;
  nextReservation: CustomerReservation | null;
  reservations: CustomerReservation[];
};

const PATH = "/customers";

const text = (value: unknown) => (typeof value === "string" && value ? value : null);

function mapCustomerReservation(data: Record<string, unknown>): CustomerReservation {
  return {
    id: Number(data.id),
    start: String(data.start ?? ""),
    service: String(data.service ?? ""),
    inCharge: String(data.in_charge ?? ""),
    status: String(data.status ?? ""),
  };
}

function mapCustomerDetail(data: Record<string, unknown>): CustomerDetail {
  const next = data.next_reservation as Record<string, unknown> | null | undefined;
  const reservations = Array.isArray(data.reservations) ? data.reservations : [];
  return {
    name: String(data.name ?? ""),
    phone: text(data.phone),
    email: text(data.email),
    visits: Number(data.visits ?? 0),
    noShows: Number(data.no_shows ?? 0),
    totalSpent: Number(data.total_spent ?? 0),
    lastVisit: text(data.last_visit),
    nextReservation: next && typeof next === "object" ? mapCustomerReservation(next) : null,
    reservations: reservations.map((r) => mapCustomerReservation(r as Record<string, unknown>)),
  };
}

function mapKnownCustomer(data: Record<string, unknown>): KnownCustomer {
  return {
    name: String(data.name ?? ""),
    phone: text(data.phone),
    email: text(data.email),
    lastVisit: text(data.last_visit),
  };
}

export const customersApi = {
  /** `GET /customers?q=&limit=`. Devuelve `[]` si el backend aún no tiene el endpoint (404). */
  search: async (
    query: string,
    limit = 10,
    client: ApiClient = apiClient
  ): Promise<KnownCustomer[]> => {
    const params = `q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await client.raw(`${PATH}/?${params}`);
    if (response.status === 404) return [];
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as Record<string, unknown>[];
    return Array.isArray(data) ? data.map(mapKnownCustomer).filter((c) => c.name) : [];
  },

  /** `GET /customers/detail?name=`. `null` si no existe o el backend aún no lo tiene (404). */
  detail: async (name: string, client: ApiClient = apiClient): Promise<CustomerDetail | null> => {
    const response = await client.raw(`${PATH}/detail?name=${encodeURIComponent(name)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return mapCustomerDetail((await response.json()) as Record<string, unknown>);
  },
};
