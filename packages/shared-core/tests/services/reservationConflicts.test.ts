import { describe, it, expect } from "vitest";
import { detectReservationConflict } from "../../src/services/reservationConflicts";
import type { ReservationForConflictCheck } from "../../src/services/reservationConflicts";

const existing: ReservationForConflictCheck = {
  id: 1,
  inCharge: "Carlos",
  status: "PENDING",
  reservationStartDate: "2026-08-01T10:00:00",
  reservationEndDate: "2026-08-01T10:30:00",
  customerName: "Ana Perez",
  service: "Corte de cabello",
};

describe("detectReservationConflict", () => {
  it("detecta un solape total (misma franja exacta)", () => {
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-01T10:00:00",
      durationMinutes: 30,
      inCharge: "Carlos",
      reservations: [existing],
    });
    expect(conflict).toEqual({
      customerName: "Ana Perez",
      time: "10:00 - 10:30",
      service: "Corte de cabello",
    });
  });

  it("detecta un solape parcial (empieza antes, termina dentro)", () => {
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-01T09:45:00",
      durationMinutes: 30, // termina 10:15, dentro del rango existente
      inCharge: "Carlos",
      reservations: [existing],
    });
    expect(conflict).not.toBeNull();
  });

  it("detecta un solape parcial (empieza dentro, termina despues)", () => {
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-01T10:15:00",
      durationMinutes: 30,
      inCharge: "Carlos",
      reservations: [existing],
    });
    expect(conflict).not.toBeNull();
  });

  it("NO detecta conflicto si la nueva reserva termina justo cuando empieza la existente", () => {
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-01T09:30:00",
      durationMinutes: 30, // termina exactamente 10:00
      inCharge: "Carlos",
      reservations: [existing],
    });
    expect(conflict).toBeNull();
  });

  it("NO detecta conflicto si la nueva reserva empieza justo cuando termina la existente", () => {
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-01T10:30:00",
      durationMinutes: 30,
      inCharge: "Carlos",
      reservations: [existing],
    });
    expect(conflict).toBeNull();
  });

  it("ignora reservas de otra persona a cargo", () => {
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-01T10:00:00",
      durationMinutes: 30,
      inCharge: "Maria",
      reservations: [existing],
    });
    expect(conflict).toBeNull();
  });

  it("ignora reservas cuyo status no es activo (ej. CANCELLED)", () => {
    const cancelled = { ...existing, status: "CANCELLED" };
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-01T10:00:00",
      durationMinutes: 30,
      inCharge: "Carlos",
      reservations: [cancelled],
    });
    expect(conflict).toBeNull();
  });

  it("excluye la propia reserva al editar (excludeId)", () => {
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-01T10:00:00",
      durationMinutes: 30,
      inCharge: "Carlos",
      reservations: [existing],
      excludeId: 1,
    });
    expect(conflict).toBeNull();
  });

  it("detecta conflicto que cruza medianoche (cambio de dia)", () => {
    const overnight: ReservationForConflictCheck = {
      ...existing,
      reservationStartDate: "2026-08-01T23:45:00",
      reservationEndDate: "2026-08-02T00:15:00",
    };
    const conflict = detectReservationConflict({
      newStartDate: "2026-08-02T00:00:00",
      durationMinutes: 30,
      inCharge: "Carlos",
      reservations: [overnight],
    });
    expect(conflict).not.toBeNull();
  });

  it("devuelve null si falta la fecha o el inCharge", () => {
    expect(
      detectReservationConflict({
        newStartDate: "",
        durationMinutes: 30,
        inCharge: "Carlos",
        reservations: [existing],
      })
    ).toBeNull();
    expect(
      detectReservationConflict({
        newStartDate: "2026-08-01T10:00:00",
        durationMinutes: 30,
        inCharge: "",
        reservations: [existing],
      })
    ).toBeNull();
  });

  it("devuelve null si la fecha no es valida", () => {
    expect(
      detectReservationConflict({
        newStartDate: "fecha-invalida",
        durationMinutes: 30,
        inCharge: "Carlos",
        reservations: [existing],
      })
    ).toBeNull();
  });
});
