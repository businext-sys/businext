import { describe, it, expect } from "vitest";
import { ReservationSchema } from "../../src/schemas/reservation";

describe("ReservationSchema", () => {
  it("parsea una reserva valida", () => {
    const valid = {
      id: 1,
      customerName: "Ana Perez",
      inCharge: "Carlos",
      reservationStartDate: "2026-08-01T10:00:00Z",
      reservationEndDate: "2026-08-01T11:00:00Z",
      timePerReservation: 60,
      status: "PENDING",
      service: "Corte de cabello",
    };
    const result = ReservationSchema.parse(valid);
    expect(result.customerName).toBe("Ana Perez");
    expect(result.timePerReservation).toBe(60);
  });

  it("permite id opcional (creacion)", () => {
    const valid = {
      customerName: "Ana Perez",
      inCharge: "Carlos",
      reservationStartDate: "2026-08-01T10:00:00Z",
      reservationEndDate: "2026-08-01T11:00:00Z",
      timePerReservation: 60,
      status: "PENDING",
      service: "Corte de cabello",
    };
    expect(() => ReservationSchema.parse(valid)).not.toThrow();
  });

  it("rechaza una reserva invalida (faltan campos requeridos)", () => {
    const invalid = { customerName: "Ana Perez" };
    expect(() => ReservationSchema.parse(invalid)).toThrow();
  });

  it("rechaza tipos incorrectos (timePerReservation como string)", () => {
    const invalid = {
      customerName: "Ana Perez",
      inCharge: "Carlos",
      reservationStartDate: "2026-08-01T10:00:00Z",
      reservationEndDate: "2026-08-01T11:00:00Z",
      timePerReservation: "60",
      status: "PENDING",
      service: "Corte de cabello",
    };
    expect(() => ReservationSchema.parse(invalid)).toThrow();
  });
});
