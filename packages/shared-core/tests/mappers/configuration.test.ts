import { describe, it, expect } from "vitest";
import {
  mapConfigurationFromApi,
  mapConfigurationToApi,
} from "../../src/mappers/configuration";
import type { Configuration } from "../../src/configuration";

describe("mapConfigurationFromApi / mapConfigurationToApi", () => {
  const configuration: Configuration = {
    id: 1,
    businessName: "Barberia Central",
    businessPhone: "+573001234567",
    businessEmail: "contacto@barberiacentral.com",
    commissionProduct: 0.1,
    commissionService: 0.2,
  };

  it("mapea de API (snake_case) a frontend (camelCase)", () => {
    const raw = {
      id: 1,
      business_name: "Barberia Central",
      business_phone: "+573001234567",
      business_email: "contacto@barberiacentral.com",
      commission_product: 0.1,
      commission_service: 0.2,
    };
    expect(mapConfigurationFromApi(raw)).toEqual(configuration);
  });

  it("round-trip: FromApi(ToApi(x)) == x", () => {
    const roundTripped = mapConfigurationFromApi(
      mapConfigurationToApi(configuration)
    );
    expect(roundTripped).toEqual(configuration);
  });

  it("lanza si falta businessName", () => {
    expect(() => mapConfigurationFromApi({ id: 1 })).toThrow();
  });
});
