import { describe, it, expect } from "vitest";
import {
  toTimezoneWallClock,
  addMinutesToWallClock,
  computeReservationWindow,
  DEFAULT_RESERVATION_TIMEZONE,
} from "../../src/services/reservationTime";

describe("toTimezoneWallClock", () => {
  it("convierte un instante UTC a la hora de pared de Europe/Madrid (verano, CEST=+2)", () => {
    expect(toTimezoneWallClock("2026-08-01T08:00:00.000Z", "Europe/Madrid")).toBe(
      "2026-08-01T10:00:00"
    );
  });

  it("convierte un instante UTC a la hora de pared de Europe/Madrid (invierno, CET=+1)", () => {
    expect(toTimezoneWallClock("2026-01-15T08:00:00.000Z", "Europe/Madrid")).toBe(
      "2026-01-15T09:00:00"
    );
  });

  it("soporta otros timezones (parametrizable, no hardcodeado)", () => {
    expect(toTimezoneWallClock("2026-08-01T08:00:00.000Z", "America/Bogota")).toBe(
      "2026-08-01T03:00:00"
    );
  });
});

describe("addMinutesToWallClock", () => {
  it("suma minutos dentro del mismo dia", () => {
    expect(addMinutesToWallClock("2026-08-01T10:00:00", 30)).toBe(
      "2026-08-01T10:30:00"
    );
  });

  it("suma minutos cruzando la medianoche (cambio de dia)", () => {
    expect(addMinutesToWallClock("2026-08-01T23:45:00", 30)).toBe(
      "2026-08-02T00:15:00"
    );
  });
});

describe("computeReservationWindow", () => {
  it("usa Europe/Madrid por defecto (comportamiento actual preservado)", () => {
    const result = computeReservationWindow({
      startDateTimeISO: "2026-08-01T08:00:00.000Z",
      durationMinutes: 60,
    });
    expect(result).toEqual({
      reservationStartDate: "2026-08-01T10:00:00",
      reservationEndDate: "2026-08-01T11:00:00",
    });
    expect(DEFAULT_RESERVATION_TIMEZONE).toBe("Europe/Madrid");
  });

  it("acepta un timezone distinto (parametrizable, issue #17)", () => {
    const result = computeReservationWindow({
      startDateTimeISO: "2026-08-01T08:00:00.000Z",
      durationMinutes: 60,
      timezone: "America/Bogota",
    });
    expect(result).toEqual({
      reservationStartDate: "2026-08-01T03:00:00",
      reservationEndDate: "2026-08-01T04:00:00",
    });
  });
});
