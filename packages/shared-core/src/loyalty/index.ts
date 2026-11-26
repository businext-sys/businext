import type {
  LoyaltyCardParsed,
  LoyaltyProgramParsed,
  LoyaltyProgramSettingsParsed,
  LoyaltyVisitParsed,
  PublicLoyaltyInfoParsed,
} from "../schemas/loyalty";

export type LoyaltyProgram = LoyaltyProgramParsed;
/** Lo que el owner cambia con `PUT /loyalty/program` (la regla entera). */
export type LoyaltyProgramSettings = LoyaltyProgramSettingsParsed;
export type LoyaltyVisit = LoyaltyVisitParsed;
export type LoyaltyCard = LoyaltyCardParsed;
export type PublicLoyaltyInfo = PublicLoyaltyInfoParsed;

/** Cómo buscar la tarjeta de un cliente: por email o, sin él, por nombre. */
export type LoyaltyCardLookup = { email?: string | null; name?: string | null };

/** Sellos que faltan para el premio (0 si ya lo tiene). */
export const stampsLeft = (card: Pick<LoyaltyCard, "stamps" | "stampsRequired">) =>
  Math.max(0, card.stampsRequired - card.stamps);
