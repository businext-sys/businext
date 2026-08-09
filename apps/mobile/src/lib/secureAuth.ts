import * as SecureStore from "expo-secure-store";

/**
 * Persistencia del JWT de Supabase en el almacenamiento seguro del
 * dispositivo (Keychain en iOS, Keystore en Android via expo-secure-store).
 * Issue #028.
 *
 * Este modulo es intencionalmente el UNICO punto de la app que toca
 * SecureStore para el token de sesion — cualquier otro codigo (incluido
 * `@businext/shared-core`) solo conoce la funcion `getAuthToken` que se le
 * inyecta al `apiClient`, nunca el mecanismo de almacenamiento concreto
 * (mismo principio de separacion que se uso para `apps/web`, que guarda la
 * sesion en cookies via Supabase SSR).
 */
const SUPABASE_TOKEN_KEY = "businext.supabase.access_token";

export async function getStoredAuthToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(SUPABASE_TOKEN_KEY);
  } catch {
    // SecureStore puede fallar en simulador/entornos sin Keychain
    // configurado; se trata como "no autenticado" en vez de crashear.
    return null;
  }
}

export async function setStoredAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SUPABASE_TOKEN_KEY, token);
}

export async function clearStoredAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(SUPABASE_TOKEN_KEY);
}
