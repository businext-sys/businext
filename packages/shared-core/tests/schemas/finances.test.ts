import { describe, it, expect } from "vitest";
import { FinancesSchema } from "../../src/schemas/finances";

describe("FinancesSchema", () => {
  it("parsea un registro financiero valido", () => {
    const valid = {
      id: 1,
      concept: "Venta de producto",
      amount: 25000,
      type: "INCOME",
      creator: "Ana",
      created_at: "2026-08-01T10:00:00Z",
    };
    const result = FinancesSchema.parse(valid);
    expect(result.amount).toBe(25000);
  });

  it("permite campos opcionales nulos", () => {
    const valid = {
      concept: "Venta",
      amount: 1000,
      type: "INCOME",
      creator: "Ana",
      reservation_id: null,
      product_id: null,
      customer_name: null,
    };
    expect(() => FinancesSchema.parse(valid)).not.toThrow();
  });

  it("rechaza un registro sin campos requeridos", () => {
    const invalid = { amount: 1000 };
    expect(() => FinancesSchema.parse(invalid)).toThrow();
  });

  it("rechaza amount con tipo incorrecto", () => {
    const invalid = {
      concept: "Venta",
      amount: "1000",
      type: "INCOME",
      creator: "Ana",
    };
    expect(() => FinancesSchema.parse(invalid)).toThrow();
  });
});
