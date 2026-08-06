import { describe, it, expect } from "vitest";
import { mapFinanceFromApi, mapFinanceToApi } from "../../src/mappers/finances";
import type { Finances } from "../../src/finances";

describe("mapFinanceFromApi / mapFinanceToApi", () => {
  const finance: Finances = {
    id: 1,
    concept: "Venta de producto",
    amount: 25000,
    type: "INCOME",
    creator: "Ana",
    created_at: "2026-08-01T10:00:00Z",
    reservation_id: null,
    product_id: 5,
    customer_name: "Ana Perez",
    commission_rate: 0.1,
    commission_amount: 2500,
  };

  it("valida y devuelve la forma tal cual (ya es snake_case)", () => {
    expect(mapFinanceFromApi(finance)).toEqual(finance);
  });

  it("round-trip: FromApi(ToApi(x)) == x", () => {
    expect(mapFinanceFromApi(mapFinanceToApi(finance))).toEqual(finance);
  });

  it("lanza si falta un campo requerido", () => {
    expect(() => mapFinanceFromApi({ amount: 100 })).toThrow();
  });
});
