"use client";
import useSWR from "swr";
import { accessApi, ACCESS_CONTEXT_PATH } from "../api/accessApi";
import type { AccessContext, AccessCapabilitiesFull as Capabilities, UserProfile } from "../api/accessApi";

export type { Capabilities, UserProfile, AccessContext };

const DEFAULT_CAPABILITIES: Capabilities = {
  canAccessApp: false,
  canManageConfiguration: false,
  canManageTeam: false,
  canManageProducts: false,
  canManageFinances: false,
  canManageReservations: false,
  canManageReviews: false,
};

export const ACCESS_CONTEXT_SWR_KEY = ACCESS_CONTEXT_PATH;

/**
 * Returns the current user's access context.
 *
 * Uses SWR so every component calling this hook shares ONE cached network
 * request. Requests are deduplicated within a 60-second window, so
 * AppShell + Sidebar + any page component → still only 1 call to /api/auth/me.
 */
export function useAccessContext({ enabled = true }: { enabled?: boolean } = {}) {
  const { data, isLoading, isValidating } = useSWR<AccessContext | null>(
    enabled ? ACCESS_CONTEXT_SWR_KEY : null,
    () => accessApi.getContext(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
      shouldRetryOnError: true,
      errorRetryCount: 3,
    }
  );

  const context = data ?? null;
  const capabilities = context?.capabilities ?? DEFAULT_CAPABILITIES;

  // Loading = true until we have a valid context.
  // Covers: first fetch, stale null cache being revalidated after login, retries.
  const loading = isLoading || (!context && isValidating);

  return { context, capabilities, loading };
}
