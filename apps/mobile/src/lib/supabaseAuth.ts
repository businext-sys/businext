import Constants from "expo-constants";

/**
 * Llamadas directas a la API REST de Supabase Auth (GoTrue), issue #029.
 *
 * Se opta por `fetch` directo en vez de instalar `@supabase/supabase-js`
 * (alternativa que sugiere el hint tecnico de la issue): evita anadir el
 * SDK completo + sus polyfills de React Native (streams, WebSocket, etc.
 * necesarios para Realtime, que esta app no usa) solo para login por
 * email/password. Mismo backend de autenticacion que usa apps/web
 * (`supabase.auth.signInWithPassword` en `apps/web/src/app/login/actions.ts`),
 * solo que alli lo hace el SDK y aqui se llama al endpoint REST equivalente.
 */

type SupabaseTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number; // segundos
  token_type: string;
};

type SupabaseErrorResponse = {
  error?: string;
  error_description?: string;
  msg?: string;
};

function getSupabaseConfig(): { url: string; anonKey: string } {
  const extra = Constants.expoConfig?.extra ?? {};
  const url = (extra.supabaseUrl as string | undefined) ?? "";
  const anonKey = (extra.supabaseAnonKey as string | undefined) ?? "";
  if (!url || !anonKey) {
    throw new Error(
      "Supabase no esta configurado: define EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return { url, anonKey };
}

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  /** Epoch ms en que expira el access token. */
  expiresAt: number;
};

function toSession(data: SupabaseTokenResponse): AuthSession {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

async function parseError(response: Response): Promise<string> {
  try {
    const data: SupabaseErrorResponse = await response.json();
    return (
      data.error_description || data.msg || data.error || "Error de autenticacion"
    );
  } catch {
    return `Error de autenticacion (HTTP ${response.status})`;
  }
}

export async function signInWithPassword(
  email: string,
  password: string
): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const { url, anonKey } = getSupabaseConfig();
  try {
    const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      return { ok: false, error: await parseError(response) };
    }
    const data: SupabaseTokenResponse = await response.json();
    return { ok: true, session: toSession(data) };
  } catch {
    return { ok: false, error: "Error de conexion. Intenta de nuevo." };
  }
}

export async function refreshSession(
  refreshToken: string
): Promise<{ ok: true; session: AuthSession } | { ok: false; error: string }> {
  const { url, anonKey } = getSupabaseConfig();
  try {
    const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      return { ok: false, error: await parseError(response) };
    }
    const data: SupabaseTokenResponse = await response.json();
    return { ok: true, session: toSession(data) };
  } catch {
    return { ok: false, error: "Error de conexion. Intenta de nuevo." };
  }
}

/** Invalida el refresh token en Supabase (best-effort, no bloquea el logout local). */
export async function signOutRemote(accessToken: string): Promise<void> {
  const { url, anonKey } = getSupabaseConfig();
  try {
    await fetch(`${url}/auth/v1/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: anonKey,
      },
    });
  } catch {
    // Best-effort: si falla, el logout local (borrar SecureStore) sigue
    // adelante igual.
  }
}
