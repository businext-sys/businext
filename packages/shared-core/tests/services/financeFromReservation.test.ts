import { describe, it, expect } from "vitest";
import { buildFinanceRecordFromReservation } from "../../src/services/financeFromReservation";
import type { Product } from "../../src/product";

const products: Product[] = [
  { id: 10, name: "Corte de cabello", price: 25000 },
  { id: 11, name: "Barba", price: 15000 },
];

describe("buildFinanceRecordFromReservation", () => {
  it("construye el registro con el precio del producto encontrado", () => {
    const record = buildFinanceRecordFromReservation(
      { id: 1, service: "Corte de cabello", inCharge: "Carlos", customerName: "Ana" },
      products
    );
    expect(record).toEqual({
      concept: "Corte de cabello",
      amount: 25000,
      type: "INCOME",
      creator: "Carlos",
      reservation_id: 1,
      product_id: 10,
      customer_name: "Ana",
    });
  });

  it("usa amount 0 y product_id null si el servicio no coincide con ningun producto", () => {
    const record = buildFinanceRecordFromReservation(
      { id: 2, service: "Servicio inexistente", inCharge: "Carlos", customerName: "Ana" },
      products
    );
    expect(record.amount).toBe(0);
    expect(record.product_id).toBeNull();
  });

  it("usa reservation_id null si la reserva no tiene id (creacion)", () => {
    const record = buildFinanceRecordFromReservation(
      { service: "Barba", inCharge: "Carlos", customerName: "Ana" },
      products
    );
    expect(record.reservation_id).toBeNull();
  });
});
