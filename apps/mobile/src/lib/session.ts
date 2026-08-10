import {
  getStoredSession,
  setStoredSession,
  clearStoredSession,
} from "./secureAuth";
import {
  signInWithPassword,
  refreshSession,
  signOutRemote,
} from "./supabaseAuth";

/**
 * Operaciones de sesion de alto nivel para apps/mobile (issue #029).
 *
 * Es la unica pieza que conoce tanto el almacenamiento (`./secureAuth`)
 * como la red (`./supabaseAuth`) — las pantallas y el `apiClient` solo
 * usan las funciones de este archivo.
 */

// Margen de seguridad: se considera "expirado" 60s antes del vencimiento
// real, para evitar usar un token que expire a mitad de una peticion.
const EXPIRY_SAFETY_MARGIN_MS = 60_000;

export async function login(
  email: string,
  password: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await signInWithPassword(email, password);
  if (!result.ok) return result;
  await setStoredSession(result.session);
  return { ok: true };
}

export async function logout(): Promise<void> {
  const session = await getStoredSession();
  if (session) {
    await signOutRemote(session.accessToken);
  }
  await clearStoredSession();
}

/**
 * Devuelve un access token valido, refrescandolo automaticamente si esta
 * proximo a expirar. Devuelve `null` si no hay sesion o si el refresh
 * falla (sesion realmente terminada — ej. refresh token revocado).
 *
 * Esta es la funcion que se inyecta como `getAuthToken` al `apiClient`
 * compartido (ver `bootstrapApiClient.ts`).
 */
export async function getValidAccessToken(): Promise<string | null> {
  const session = await getStoredSession();
  if (!session) return null;

  const isExpiringSoon = Date.now() >= session.expiresAt - EXPIRY_SAFETY_MARGIN_MS;
  if (!isExpiringSoon) {
    return session.accessToken;
  }

  const refreshed = await refreshSession(session.refreshToken);
  if (!refreshed.ok) {
    // Refresh token invalido/revocado: la sesion realmente termino.
    await clearStoredSession();
    return null;
  }
  await setStoredSession(refreshed.session);
  return refreshed.session.accessToken;
}

/**
 * Chequeo rapido de sesion para decidir si mostrar login o la app
 * (issue #029: "al reabrir la app, si hay token valido, saltar login").
 * Reutiliza `getValidAccessToken` (que ya intenta refrescar si hace
 * falta), por lo que un token expirado pero con refresh token vigente
 * SI cuenta como sesion activa.
 */
export async function hasActiveSession(): Promise<boolean> {
  const token = await getValidAccessToken();
  return token !== null;
}
