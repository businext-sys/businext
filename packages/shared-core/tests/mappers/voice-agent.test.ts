import { describe, it, expect } from "vitest";
import {
  mapVoiceAgentConfigFromApi,
  mapVoiceAgentConfigUpdateToApi,
} from "../../src/mappers/voice-agent";

describe("mapVoiceAgentConfigFromApi (issue #118)", () => {
  it("mapea de API (snake_case) a frontend (camelCase)", () => {
    expect(
      mapVoiceAgentConfigFromApi({
        enabled: true,
        booking_mode: "confirm",
        phone_numbers: ["+34910000000"],
      })
    ).toEqual({
      enabled: true,
      bookingMode: "confirm",
      phoneNumbers: ["+34910000000"],
    });
  });

  it("sin numeros devuelve una lista vacia", () => {
    expect(
      mapVoiceAgentConfigFromApi({ enabled: false, booking_mode: "request" })
        .phoneNumbers
    ).toEqual([]);
  });

  it("lanza con un modo de reserva desconocido", () => {
    expect(() =>
      mapVoiceAgentConfigFromApi({
        enabled: true,
        booking_mode: "otro",
        phone_numbers: [],
      })
    ).toThrow();
  });
});

describe("mapVoiceAgentConfigUpdateToApi", () => {
  it("solo envia los campos que cambian", () => {
    expect(mapVoiceAgentConfigUpdateToApi({ bookingMode: "confirm" })).toEqual({
      booking_mode: "confirm",
    });
    expect(mapVoiceAgentConfigUpdateToApi({ enabled: false })).toEqual({
      enabled: false,
    });
  });
});
