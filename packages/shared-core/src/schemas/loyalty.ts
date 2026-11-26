import { z } from "zod";

/**
 * Tarjeta de fidelidad (ADR 0003 de businext-backend, `/loyalty/*`): N sellos
 * dan un premio y cada reserva completada suma uno. Los colores del pase son
 * `#RRGGBB` opcionales; sin ellos el pase usa los de DESIGN.md.
 */
const HexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Usa un color #RRGGBB");

export const LoyaltyProgramSettingsSchema = z.object({
  enabled: z.boolean(),
  stampsRequired: z.number().int().min(1).max(50),
  reward: z.string().trim().min(1).max(40),
  backgroundColor: HexColorSchema.nullable(),
  foregroundColor: HexColorSchema.nullable(),
  labelColor: HexColorSchema.nullable(),
});

export const LoyaltyProgramSchema = LoyaltyProgramSettingsSchema.extend({
  /** El servidor tiene los certificados para firmar pases de Apple Wallet. */
  appleWalletAvailable: z.boolean(),
  /** Logo propio del pase (URL pública); `null` = el de Businext. */
  logoUrl: z.string().nullable(),
});

export const LoyaltyVisitSchema = z.object({
  visitDate: z.string(),
  service: z.string(),
  redeemed: z.boolean(),
});

export const LoyaltyCardSchema = z.object({
  serialNumber: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  /** Sellos sin canjear. */
  stamps: z.number(),
  stampsRequired: z.number(),
  reward: z.string(),
  rewardReady: z.boolean(),
  visits: z.array(LoyaltyVisitSchema),
  /** Enlace al `.pkpass`; `null` si Wallet no está configurado en el servidor. */
  passUrl: z.string().nullable(),
});

/** `GET /loyalty/scan/{token}`: la tarjeta del QR del pase, para sellar o canjear en el local. */
export const LoyaltyScanResultSchema = LoyaltyCardSchema.extend({
  /** La tarjeta ya tiene un sello de hoy (de reserva o manual): no se puede añadir otro. */
  stampedToday: z.boolean(),
  /** Solo tras `POST .../stamp`: si esta petición añadió el sello. */
  stampAdded: z.boolean(),
});

/** `POST /loyalty/cards/{serial}/send-pass`. */
export const LoyaltyPassSentSchema = z.object({
  sentTo: z.string(),
  passUrl: z.string(),
});

/** `GET /public/loyalty/{business_id}`: lo que ve la página pública de reservas. */
export const PublicLoyaltyInfoSchema = z.object({
  enabled: z.boolean(),
  stampsRequired: z.number(),
  reward: z.string(),
  appleWalletAvailable: z.boolean(),
});

export type LoyaltyProgramSettingsParsed = z.infer<typeof LoyaltyProgramSettingsSchema>;
export type LoyaltyProgramParsed = z.infer<typeof LoyaltyProgramSchema>;
export type LoyaltyVisitParsed = z.infer<typeof LoyaltyVisitSchema>;
export type LoyaltyCardParsed = z.infer<typeof LoyaltyCardSchema>;
export type LoyaltyScanResultParsed = z.infer<typeof LoyaltyScanResultSchema>;
export type LoyaltyPassSentParsed = z.infer<typeof LoyaltyPassSentSchema>;
export type PublicLoyaltyInfoParsed = z.infer<typeof PublicLoyaltyInfoSchema>;
