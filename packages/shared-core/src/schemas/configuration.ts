import { z } from "zod";

/**
 * Schema del "Business" / Configuration del negocio.
 *
 * Nota: el codigo actual no tiene una entidad `Business` separada de
 * `Configuration` (nombre, contacto, comisiones del negocio) — se valida
 * aqui la misma forma que ya existe en `../configuration`. Si en el futuro
 * aparece una entidad `Business` con mas campos (ej. plan de suscripcion,
 * timezone, etc.), se debe crear un schema separado en este mismo archivo.
 */
export const ConfigurationSchema = z.object({
  id: z.number().optional(),
  businessName: z.string(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().optional(),
  commissionProduct: z.number().optional(),
  commissionService: z.number().optional(),
});

export type ConfigurationParsed = z.infer<typeof ConfigurationSchema>;

/** Alias explicito pedido por la issue #14 ("schemas para... Business"). */
export const BusinessSchema = ConfigurationSchema;
export type BusinessParsed = ConfigurationParsed;
