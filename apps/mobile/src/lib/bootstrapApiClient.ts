import Constants from "expo-constants";
import { configureApiClient } from "@businext/shared-core/api";
import { getStoredAuthToken } from "./secureAuth";

/**
 * Configura la instancia compartida de `apiClient` de shared-core para
 * que apps/mobile hable DIRECTO con el backend (sin el BFF de Next.js
 * que usa apps/web) y envie el JWT de Supabase guardado en SecureStore
 * en cada request. Issue #028.
 *
 * Debe llamarse UNA VEZ, lo antes posible al arrancar la app (ver
 * `app/_layout.tsx`), antes de que se monte cualquier componente que use
 * los hooks de `@businext/shared-core/hooks`.
 */
export function bootstrapApiClient(): void {
  const apiBaseUrl =
    (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
    "http://localhost:8000";

  configureApiClient({
    baseURL: apiBaseUrl,
    // Mobile llama directo al backend real, sin las rutas proxy /api/...
    // del BFF de Next.js que usa apps/web.
    apiPrefix: "",
    getAuthToken: getStoredAuthToken,
  });
}
