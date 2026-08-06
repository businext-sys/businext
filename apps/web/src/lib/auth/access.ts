import type { AccessRole } from "@/lib/employee/types";
import type {
  AccessCapabilities,
  BackendAccessContext,
} from "@businext/shared-core/access";

// ---------------------------------------------------------------------------
// Backend-driven access context
//
// Los tipos (AccessCapabilities, BackendAccessContext) viven en
// @businext/shared-core/access (unica fuente de verdad). Las funciones de
// este archivo hacen fetch a rutas especificas de la plataforma Next.js
// (BFF) y por eso permanecen aqui, no en shared-core.
// Ver specs/001-extraer-core-compartido/research.md (Decision 1, FR-008).
// ---------------------------------------------------------------------------

export type { AccessCapabilities, BackendAccessContext };
// Re-exportado por compatibilidad: algunos consumidores importan AccessRole
// desde este mismo archivo.
export type { AccessRole };

/**
 * Fetches the access context from the backend using a JWT token.
 * Use this in server actions and API routes where the JWT is available.
 * Returns null if the token is invalid or the request fails.
 */
export async function getServerAccessContextFromJwt(
  jwt: string
): Promise<BackendAccessContext | null> {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE;
    const res = await fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * Fetches the access context through the frontend API route.
 * Use this from client components/hooks where JWT headers are not available.
 *
 * Returns null if unauthenticated (401) or access is denied (403).
 * Throws on network errors.
 */
export async function getClientAccessContextFromApi(): Promise<BackendAccessContext | null> {
  const response = await fetch("/api/auth/me");
  if (response.status === 401 || response.status === 403) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch access context: ${response.status}`);
  }
  return response.json();
}
