import type { ApiClient } from "./client";
import { apiClient, resourcePath } from "./client";
import type { Reservation } from "../reservation";
import { mapReservationFromApi, mapReservationToApi } from "../mappers/reservation";

const PATH = "/reservations";

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
      resourcePath(client, PATH, id),
      updateData
    );
    return mapReservationFromApi(data);
  },

  remove: (id: number, client: ApiClient = apiClient): Promise<void> =>
    client.delete(resourcePath(client, PATH, id)),

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
