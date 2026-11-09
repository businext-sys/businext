import { describe, it, expect } from "vitest";
import { ContentPreferencesFormSchema } from "../../src/schemas/trends";

const VALID = {
  enabled: true,
  networks: ["instagram"],
  maxPerDay: 2,
  quietFrom: "21:00",
  quietTo: "09:00",
  timezone: "Europe/Madrid",
  niche: "barberia",
  language: "es",
  country: "ES",
};

describe("ContentPreferencesFormSchema (#169)", () => {
  it("acepta unas preferencias validas", () => {
    expect(ContentPreferencesFormSchema.safeParse(VALID).success).toBe(true);
  });

  it("exige al menos una red", () => {
    expect(ContentPreferencesFormSchema.safeParse({ ...VALID, networks: [] }).success).toBe(false);
  });

  it("limita maxPerDay entre 1 y 3", () => {
    expect(ContentPreferencesFormSchema.safeParse({ ...VALID, maxPerDay: 0 }).success).toBe(false);
    expect(ContentPreferencesFormSchema.safeParse({ ...VALID, maxPerDay: 4 }).success).toBe(false);
  });

  it("exige horas HH:mm", () => {
    expect(ContentPreferencesFormSchema.safeParse({ ...VALID, quietFrom: "9:00" }).success).toBe(false);
    expect(ContentPreferencesFormSchema.safeParse({ ...VALID, quietTo: "24:00" }).success).toBe(false);
  });

  it("el silencio no puede empezar y acabar a la misma hora", () => {
    const result = ContentPreferencesFormSchema.safeParse({ ...VALID, quietTo: "21:00" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["quietTo"]);
  });
});
