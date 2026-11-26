import type {
  LoyaltyCardParsed,
  LoyaltyProgramParsed,
  LoyaltyProgramSettingsParsed,
  LoyaltyPassSentParsed,
  LoyaltyScanResultParsed,
  LoyaltyVisitParsed,
  PublicLoyaltyInfoParsed,
} from "../schemas/loyalty";

export type LoyaltyProgram = LoyaltyProgramParsed;
/** Lo que el owner cambia con `PUT /loyalty/program` (la regla entera). */
export type LoyaltyProgramSettings = LoyaltyProgramSettingsParsed;
export type LoyaltyVisit = LoyaltyVisitParsed;
export type LoyaltyCard = LoyaltyCardParsed;
export type PublicLoyaltyInfo = PublicLoyaltyInfoParsed;
export type LoyaltyScanResult = LoyaltyScanResultParsed;
export type LoyaltyPassSent = LoyaltyPassSentParsed;

/**
 * Lo que lleva el QR del pase es el `scan_token` de la tarjeta, sin más. Se
 * acepta también una URL que lo lleve como último segmento, por si el QR
 * cambia a un enlace. `null` si el texto no puede ser un token.
 */
export function parseLoyaltyQr(raw: string): string | null {
  const text = raw.trim();
  if (!text) return null;
  let token = text;
  if (/^https?:\/\//i.test(text)) {
    const segments = text.split(/[?#]/)[0].split("/").filter(Boolean);
    token = segments[segments.length - 1] ?? "";
  }
  return /^[A-Za-z0-9_-]{8,128}$/.test(token) ? token : null;
}

/** Cómo buscar la tarjeta de un cliente: por email o, sin él, por nombre. */
export type LoyaltyCardLookup = { email?: string | null; name?: string | null };

/** Sellos que faltan para el premio (0 si ya lo tiene). */
export const stampsLeft = (card: Pick<LoyaltyCard, "stamps" | "stampsRequired">) =>
  Math.max(0, card.stampsRequired - card.stamps);
