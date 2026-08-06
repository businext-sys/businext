import { describe, it, expect } from "vitest";
import { mapReservationFromApi, mapReservationToApi } from "../../src/mappers/reservation";
import type { Reservation } from "../../src/reservation";

describe("mapReservationFromApi / mapReservationToApi", () => {
  const reservation: Reservation = {
    id: 1,
    customerName: "Ana Perez",
    inCharge: "Carlos",
    reservationStartDate: "2026-08-01T10:00:00Z",
    reservationEndDate: "2026-08-01T11:00:00Z",
    timePerReservation: 60,
    status: "PENDING",
    service: "Corte de cabello",
  };

  it("mapea de API (snake_case) a frontend (camelCase)", () => {
    const raw = {
      id: 1,
      customer_name: "Ana Perez",
      in_charge: "Carlos",
      reservation_start_date: "2026-08-01T10:00:00Z",
      reservation_end_date: "2026-08-01T11:00:00Z",
      time_per_reservation: 60,
      status: "PENDING",
      service: "Corte de cabello",
    };
    expect(mapReservationFromApi(raw)).toEqual(reservation);
  });

  it("round-trip: FromApi(ToApi(x)) == x", () => {
    const roundTripped = mapReservationFromApi(mapReservationToApi(reservation));
    expect(roundTripped).toEqual(reservation);
  });

  it("lanza si el backend envia una forma invalida", () => {
    expect(() => mapReservationFromApi({ id: 1 })).toThrow();
  });
});
