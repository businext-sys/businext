import { z } from "zod";

/** Schema de la forma "frontend" (camelCase) de un Finances. */
export const FinancesSchema = z.object({
  id: z.number().optional(),
  concept: z.string(),
  amount: z.number(),
  type: z.string(),
  creator: z.string(),
  created_at: z.string().optional(),
  reservation_id: z.number().nullable().optional(),
  product_id: z.number().nullable().optional(),
  customer_name: z.string().nullable().optional(),
  commission_rate: z.number().optional(),
  commission_amount: z.number().optional(),
});

export type FinancesParsed = z.infer<typeof FinancesSchema>;
