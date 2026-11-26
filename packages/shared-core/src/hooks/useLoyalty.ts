"use client";
import { useCallback, useRef, useState } from "react";
import useSWR from "swr";
import type {
  LoyaltyCard,
  LoyaltyCardLookup,
  LoyaltyProgram,
  LoyaltyProgramSettings,
  LoyaltyScanResult,
  PublicLoyaltyInfo,
} from "../loyalty";
import type { LoyaltyLogoFile } from "../api/loyaltyApi";
import { LoyaltyError, loyaltyApi, loyaltyLookupQuery } from "../api/loyaltyApi";

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

  const replaceWith = async (action: () => Promise<LoyaltyProgram>) => {
    const updated = await action();
    await mutate(updated, { revalidate: false });
    return updated;
  };

  const updateProgram = (settings: LoyaltyProgramSettings): Promise<LoyaltyProgram> =>
    replaceWith(() => loyaltyApi.updateProgram(settings));

  return {
    program,
    loading,
    error,
    updateProgram,
    uploadLogo: (file: LoyaltyLogoFile) => replaceWith(() => loyaltyApi.uploadLogo(file)),
    deleteLogo: () => replaceWith(() => loyaltyApi.deleteLogo()),
    refresh: () => mutate(),
  };
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
    /** Reenvía el enlace del pase al email del cliente. */
    sendPass: () => {
      if (!card) throw new Error("Este cliente aún no tiene tarjeta");
      return loyaltyApi.sendPass(card.serialNumber);
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

export type LoyaltyScanAction = "scan" | "stamp" | "redeem";

/**
 * Estado de la pantalla «Escanear tarjeta» (web y mobile): `scan(token)` con
 * lo que lleva el QR, luego `stamp()` (sello manual, uno al día) o
 * `redeem()`. `error` es el texto para enseñar; `notFound` distingue un QR
 * que no es de este negocio. Ignora un segundo `scan` mientras otro está en
 * curso (la cámara lee el mismo QR varias veces por segundo).
 */
export function useLoyaltyScan() {
  const [result, setResult] = useState<LoyaltyScanResult | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState<LoyaltyScanAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const inFlight = useRef(false);

  const run = useCallback(
    async (action: LoyaltyScanAction, task: () => Promise<LoyaltyScanResult>) => {
      if (inFlight.current) return null;
      inFlight.current = true;
      setBusy(action);
      setError(null);
      setNotFound(false);
      try {
        const next = await task();
        setResult(next);
        return next;
      } catch (err) {
        setNotFound(action === "scan" && err instanceof LoyaltyError && err.status === 404);
        setError(err instanceof Error ? err.message : "Algo ha fallado. Inténtalo de nuevo");
        return null;
      } finally {
        inFlight.current = false;
        setBusy(null);
      }
    },
    []
  );

  const scan = useCallback(
    (scanned: string) => {
      setToken(scanned);
      return run("scan", () => loyaltyApi.scan(scanned));
    },
    [run]
  );

  const stamp = useCallback(() => {
    if (!token) return Promise.resolve(null);
    return run("stamp", () => loyaltyApi.stampScanned(token));
  }, [run, token]);

  const redeem = useCallback(() => {
    if (!result) return Promise.resolve(null);
    const current = result;
    return run("redeem", async () => ({
      ...(await loyaltyApi.redeem(current.serialNumber)),
      stampedToday: current.stampedToday,
      stampAdded: false,
    }));
  }, [run, result]);

  const reset = useCallback(() => {
    setResult(null);
    setToken(null);
    setError(null);
    setNotFound(false);
  }, []);

  return { result, busy, error, notFound, scan, stamp, redeem, reset };
}
