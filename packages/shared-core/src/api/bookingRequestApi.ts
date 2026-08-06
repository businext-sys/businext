import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { BookingRequest } from "../booking-request";
import { mapBookingRequestFromApi } from "../mappers/booking-request";

const PATH = "/api/booking-requests";

export const bookingRequestApi = {
  list: (client: ApiClient = apiClient): Promise<BookingRequest[]> =>
    client
      .get<Record<string, unknown>[]>(PATH)
      .then((data) => data.map(mapBookingRequestFromApi)),

  accept: (id: number, client: ApiClient = apiClient): Promise<boolean> =>
    client
      .raw(`${PATH}/${id}/accept`, { method: "POST" })
      .then((r) => r.ok),

  reject: (
    id: number,
    reason: string | undefined,
    client: ApiClient = apiClient
  ): Promise<boolean> =>
    client
      .raw(`${PATH}/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      .then((r) => r.ok),
};
