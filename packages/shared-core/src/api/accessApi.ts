import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { AccessCapabilitiesFull } from "../services/access";

export type { AccessCapabilitiesFull };

export type UserProfile = {
  displayName: string | null;
  email: string | null;
  phone: string | null;
};

export type AccessContext = {
  userId: string;
  businessId: string;
  role: string;
  accountType: string;
  memberStatus: string | null;
  subscriptionActive: boolean;
  profile: UserProfile | null;
  capabilities: AccessCapabilitiesFull;
};

export const ACCESS_CONTEXT_PATH = "/auth/me";

export const accessApi = {
  /** Devuelve `null` si es 401 (no autenticado); lanza en otros errores. */
  getContext: async (
    client: ApiClient = apiClient
  ): Promise<AccessContext | null> => {
    const response = await client.raw(ACCESS_CONTEXT_PATH);
    if (response.status === 401) return null;
    if (!response.ok) throw new Error(`Auth fetch failed: ${response.status}`);
    return response.json() as Promise<AccessContext>;
  },
};
