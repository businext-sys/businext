import { describe, it, expect } from "vitest";
import {
  mapBookingRequestFromApi,
  mapBookingRequestToApi,
} from "../../src/mappers/booking-request";
import type { BookingRequest } from "../../src/booking-request";

describe("mapBookingRequestFromApi / mapBookingRequestToApi", () => {
  const bookingRequest: BookingRequest = {
    id: 1,
    businessId: "biz-1",
    clientName: "Ana",
    clientEmail: "ana@example.com",
    clientPhone: "+573001234567",
    employeeName: null,
    service: "Corte de cabello",
    requestedDate: "2026-08-01T10:00:00Z",
    status: "REQUESTED",
    expiresAt: "2026-08-01T12:00:00Z",
    createdAt: "2026-08-01T09:00:00Z",
  };

  it("mapea de API (snake_case) a frontend (camelCase)", () => {
    const raw = {
      id: 1,
      business_id: "biz-1",
      client_name: "Ana",
      client_email: "ana@example.com",
      client_phone: "+573001234567",
      employee_name: null,
      service: "Corte de cabello",
      requested_date: "2026-08-01T10:00:00Z",
      status: "REQUESTED",
      expires_at: "2026-08-01T12:00:00Z",
      created_at: "2026-08-01T09:00:00Z",
    };
    expect(mapBookingRequestFromApi(raw)).toEqual(bookingRequest);
  });

  it("round-trip: FromApi(ToApi(x)) == x", () => {
    const roundTripped = mapBookingRequestFromApi(
      mapBookingRequestToApi(bookingRequest)
    );
    expect(roundTripped).toEqual(bookingRequest);
  });

  it("lanza si el status no es valido", () => {
    expect(() =>
      mapBookingRequestFromApi({ ...bookingRequest, status: "WAT" })
    ).toThrow();
  });
});
