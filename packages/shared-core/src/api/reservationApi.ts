import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { Reservation } from "../reservation";
import { mapReservationFromApi, mapReservationToApi } from "../mappers/reservation";

const PATH = "/api/reservations";

export const reservationApi = {
  list: (client: ApiClient = apiClient): Promise<Reservation[]> =>
    client.get<Record<string, unknown>[]>(PATH).then((data) => data.map(mapReservationFromApi)),

  create: async (
    reservation: Omit<Reservation, "id">,
    client: ApiClient = apiClient
  ): Promise<Reservation> => {
    const data = await client.post<Record<string, unknown>>(
      PATH,
      mapReservationToApi(reservation as Reservation)
    );
    return mapReservationFromApi(data);
  },

  update: async (
    reservation: Reservation,
    client: ApiClient = apiClient
  ): Promise<Reservation> => {
    const { id, ...updateData } = mapReservationToApi(reservation);
    const data = await client.patch<Record<string, unknown>>(
      `${PATH}?id=${id}`,
      updateData
    );
    return mapReservationFromApi(data);
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.delete(`${PATH}?id=${id}`),

  revert: async (
    id: number,
    client: ApiClient = apiClient
  ): Promise<Reservation> => {
    const data = await client.post<Record<string, unknown>>(
      `${PATH}/${id}/revert`
    );
    return mapReservationFromApi(data);
  },
};
