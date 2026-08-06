import { describe, it, expect } from "vitest";
import { ConfigurationSchema, BusinessSchema } from "../../src/schemas/configuration";

describe("ConfigurationSchema (Business)", () => {
  it("parsea una configuracion valida", () => {
    const valid = {
      id: 1,
      businessName: "Barberia Central",
      businessPhone: "+573001234567",
      businessEmail: "contacto@barberiacentral.com",
      commissionProduct: 0.1,
      commissionService: 0.2,
    };
    expect(ConfigurationSchema.parse(valid).businessName).toBe(
      "Barberia Central"
    );
  });

  it("permite campos opcionales ausentes", () => {
    const valid = { businessName: "Barberia Central" };
    expect(() => ConfigurationSchema.parse(valid)).not.toThrow();
  });

  it("rechaza sin businessName", () => {
    expect(() => ConfigurationSchema.parse({ id: 1 })).toThrow();
  });

  it("BusinessSchema es el mismo schema que ConfigurationSchema", () => {
    expect(BusinessSchema).toBe(ConfigurationSchema);
  });
});
