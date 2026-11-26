"use client";
import useSWR from "swr";
import type {
  LoyaltyCard,
  LoyaltyCardLookup,
  LoyaltyProgram,
  LoyaltyProgramSettings,
  PublicLoyaltyInfo,
} from "../loyalty";
import { loyaltyApi, loyaltyLookupQuery } from "../api/loyaltyApi";

const PROGRAM_KEY = "/api/loyalty/program";

/**
 * Regla de la tarjeta de fidelidad del negocio. `updateProgram` (solo owner)
 * lanza un `LoyaltyError` con el `detail` del backend si falla, para que el
 * formulario lo enseñe.
 */
export function useLoyaltyProgram(enabled = true) {
  const {
    data: program,
    isLoading: loading,
    error,
    mutate,
  } = useSWR<LoyaltyProgram>(enabled ? PROGRAM_KEY : null, () => loyaltyApi.getProgram());

  const updateProgram = async (settings: LoyaltyProgramSettings): Promise<LoyaltyProgram> => {
    const updated = await loyaltyApi.updateProgram(settings);
    await mutate(updated, { revalidate: false });
    return updated;
  };

  return { program, loading, error, updateProgram, refresh: () => mutate() };
}

/**
 * Tarjeta de un cliente, por email o nombre. `card` es `null` si aún no tiene
 * (todavía no ha completado ninguna reserva con la tarjeta activa). Las
 * acciones devuelven la tarjeta actualizada y lanzan `LoyaltyError` si fallan.
 */
export function useLoyaltyCard(lookup: LoyaltyCardLookup | null) {
  const query = lookup ? loyaltyLookupQuery(lookup) : null;
  const {
    data: card,
    isLoading: loading,
    error,
    mutate,
  } = useSWR<LoyaltyCard | null>(query ? `/api/loyalty/cards?${query}` : null, () =>
    loyaltyApi.getCard(lookup ?? {})
  );

  const apply = async (action: () => Promise<LoyaltyCard>): Promise<LoyaltyCard> => {
    const updated = await action();
    await mutate(updated, { revalidate: false });
    return updated;
  };

  return {
    card: card ?? null,
    loading,
    error,
    refresh: () => mutate(),
    redeem: () => {
      if (!card) throw new Error("Este cliente aún no tiene tarjeta");
      return apply(() => loyaltyApi.redeem(card.serialNumber));
    },
    createCard: (customer: { customerName: string; customerEmail: string }) =>
      apply(() => loyaltyApi.createCard(customer)),
  };
}

/** Página pública de reservas: si el negocio tiene la tarjeta activa. */
export function usePublicLoyalty(businessId: string | null | undefined) {
  const { data: info, isLoading: loading } = useSWR<PublicLoyaltyInfo | null>(
    businessId ? `/api/public/loyalty/${businessId}` : null,
    () => loyaltyApi.getPublicInfo(businessId as string).catch(() => null)
  );
  return { info: info ?? null, loading };
}
