import * as SecureStore from "expo-secure-store";
import type { AuthSession } from "./supabaseAuth";

/**
 * Persistencia de la sesion de Supabase (access + refresh token) en el
 * almacenamiento seguro del dispositivo (Keychain en iOS, Keystore en
 * Android via expo-secure-store). Issues #028 (mecanismo base) y #029
 * (sesion completa con refresh token, en vez de solo el access token).
 *
 * Este modulo es intencionalmente el UNICO punto de la app que toca
 * SecureStore para la sesion — cualquier otro codigo (incluido
 * `@businext/shared-core` y las pantallas) pasa por `./session.ts`, que
 * expone operaciones de mas alto nivel (login/logout/getValidAccessToken)
 * sin conocer el mecanismo de almacenamiento concreto.
 */
const SESSION_KEY = "businext.supabase.session";

export async function getStoredSession(): Promise<AuthSession | null> {
  try {
    const raw = await SecureStore.getItemAsync(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    // SecureStore puede fallar en simulador/entornos sin Keychain
    // configurado, o el JSON puede estar corrupto; se trata como
    // "no autenticado" en vez de crashear.
    return null;
  }
}

export async function setStoredSession(session: AuthSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
