import type { Finances } from "../finances";
import { FinancesSchema } from "../schemas/finances";

/**
 * Nota: a diferencia de Reservation/Configuration, el tipo `Finances` del
 * frontend ya usa nombres de campo snake_case identicos a los del backend
 * (`created_at`, `reservation_id`, `product_id`, `customer_name`, etc.) —
 * no existe conversion camelCase pendiente. Este mapper valida la forma con
 * zod en vez de solo transformar nombres, que es igualmente el objetivo de
 * la issue #15 (reemplazar casts ciegos).
 */
export const mapFinanceFromApi = (data: Record<string, unknown>): Finances =>
  FinancesSchema.parse(data);

export const mapFinanceToApi = (finance: Finances) => ({
  id: finance.id,
  concept: finance.concept,
  amount: finance.amount,
  type: finance.type,
  creator: finance.creator,
  created_at: finance.created_at,
  reservation_id: finance.reservation_id ?? null,
  product_id: finance.product_id ?? null,
  customer_name: finance.customer_name ?? null,
  commission_rate: finance.commission_rate,
  commission_amount: finance.commission_amount,
});
