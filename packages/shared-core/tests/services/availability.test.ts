import { describe, it, expect } from "vitest";
import { getAvailableSlots, isDayClosed } from "../../src/services/availability";
import type { WorkingHoursBlock } from "../../src/working-hours";
import type { Reservation } from "../../src/reservation";
import type { BookingRequest } from "../../src/booking-request";

// 2026-11-18 es miércoles (dayOfWeek 2).
const DAY = new Date(2026, 10, 18);
const BEFORE = new Date(2026, 10, 17, 12, 0);
const hours: WorkingHoursBlock[] = [
  { dayOfWeek: 2, startTime: "09:00", endTime: "11:00", enabled: true },
  { dayOfWeek: 2, startTime: "16:00", endTime: "17:00", enabled: true },
  { dayOfWeek: 3, startTime: "09:00", endTime: "18:00", enabled: false },
];

const reservation = (start: string, end: string, extra: Partial<Reservation> = {}): Reservation =>
  ({
    customerName: "Ana",
    service: "Corte",
    inCharge: "Luis",
    reservationStartDate: start,
    reservationEndDate: end,
    timePerReservation: 30,
    status: "PENDING",
    ...extra,
  }) as Reservation;

describe("getAvailableSlots", () => {
  it("genera huecos de 30 min de todos los bloques del día", () => {
    expect(getAvailableSlots(DAY, hours, [], "Luis", [], BEFORE)).toEqual([
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "16:00",
      "16:30",
    ]);
  });

  it("quita los huecos que pisa una reserva pendiente del mismo encargado", () => {
    const reservations = [
      reservation("2026-11-18T09:30:00", "2026-11-18T10:30:00"),
      reservation("2026-11-18T16:00:00", "2026-11-18T16:30:00", { inCharge: "Eva" }),
      reservation("2026-11-18T16:30:00", "2026-11-18T17:00:00", { status: "COMPLETED" }),
    ];
    expect(getAvailableSlots(DAY, hours, reservations, "Luis", [], BEFORE)).toEqual([
      "09:00",
      "10:30",
      "16:00",
      "16:30",
    ]);
  });

  it("trata como ocupadas las solicitudes por aceptar", () => {
    const requests = [
      { status: "REQUESTED", employeeName: null, requestedDate: "2026-11-18T09:00:00" },
      { status: "REJECTED", employeeName: "Luis", requestedDate: "2026-11-18T09:30:00" },
    ] as BookingRequest[];
    expect(getAvailableSlots(DAY, hours, [], "Luis", requests, BEFORE)).not.toContain("09:00");
    expect(getAvailableSlots(DAY, hours, [], "Luis", requests, BEFORE)).toContain("09:30");
  });

  it("hoy no ofrece huecos ya pasados", () => {
    const now = new Date(2026, 10, 18, 10, 10);
    expect(getAvailableSlots(DAY, hours, [], "Luis", [], now)).toEqual(["10:00", "10:30", "16:00", "16:30"]);
  });

  it("un día sin bloques activos no tiene huecos y está cerrado", () => {
    const thursday = new Date(2026, 10, 19);
    expect(getAvailableSlots(thursday, hours, [], "Luis", [], BEFORE)).toEqual([]);
    expect(isDayClosed(thursday, hours)).toBe(true);
    expect(isDayClosed(DAY, hours)).toBe(false);
  });

  it("con la duración del servicio ofrece inicios cada 15 min donde cabe entero", () => {
    const reservations = [reservation("2026-11-18T10:00:00", "2026-11-18T10:30:00")];
    expect(
      getAvailableSlots(DAY, hours, reservations, "Luis", [], BEFORE, { durationMinutes: 45, stepMinutes: 15 })
    ).toEqual(["09:00", "09:15", "16:00", "16:15"]);
  });
});
