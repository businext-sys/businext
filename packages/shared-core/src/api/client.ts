export type ApiClientConfig = {
  /**
   * Prefijo de todas las rutas. En web (BFF de Next.js) se deja vacio (las
   * rutas ya son relativas: `/api/...`). En mobile sera la URL absoluta del
   * backend (ej. `https://api.businext.app`).
   */
  baseURL?: string;
  /**
   * Segmento insertado entre `baseURL` y cada `path` de dominio (issue
   * #028). Los `*Api.ts` de este paquete definen sus rutas relativas al
   * backend REAL (ej. `/reservations`, sin `/api`). En web, ese backend
   * se consume a traves del BFF de Next.js, cuyas rutas proxy viven bajo
   * `/api/...` — por eso el default es `"/api"` (preserva el
   * comportamiento historico). En mobile, que llama directo al backend
   * sin BFF, se debe pasar `apiPrefix: ""`.
   */
  apiPrefix?: string;
  /**
   * Funcion que obtiene el token de autenticacion a inyectar como header
   * `Authorization: Bearer <token>`. En web no hace falta (la sesion viaja
   * por cookies, gestionadas por el middleware de Next.js) — se deja sin
   * configurar. En mobile se le pasa una funcion que lee de SecureStore.
   */
  getAuthToken?: () => Promise<string | null> | string | null;
};

export type ApiClient = {
  /**
   * Prefijo activo de este cliente (`"/api"` para web-via-BFF, `""` para
   * backend directo). Expuesto para los pocos casos donde el nombre de la
   * ruta diverge entre el BFF y el backend real (no solo el prefijo
   * `/api`) — ver `financesApi.listAnual` para un ejemplo.
   */
  readonly apiPrefix: string;
  /** GET con reintentos automaticos + parseo JSON. Incluye el header de auth. */
  get<T>(path: string): Promise<T>;
  /** Devuelve el Response crudo (sin parsear), para manejo de status codes especificos (401, 409, etc.). */
  raw(path: string, init?: RequestInit): Promise<Response>;
  /** POST con body JSON. Si `!response.ok`, lanza un Error generico. */
  post<T>(path: string, body?: unknown): Promise<T>;
  /** PATCH con body JSON. Si `!response.ok`, lanza un Error generico. */
  patch<T>(path: string, body?: unknown): Promise<T>;
  /** PUT con body JSON. Si `!response.ok`, lanza un Error generico. */
  put<T>(path: string, body?: unknown): Promise<T>;
  /** DELETE. Si `!response.ok`, lanza un Error generico. */
  delete<T = void>(path: string): Promise<T>;
};

const MAX_GET_RETRIES = 3;

async function resolveAuthHeaders(
  getAuthToken?: ApiClientConfig["getAuthToken"]
): Promise<Record<string, string>> {
  if (!getAuthToken) return {};
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Crea un cliente HTTP con baseURL y obtencion de token inyectables, para
 * que la misma logica de negocio (hooks en packages/shared-core/src/hooks)
 * sirva tanto a apps/web (BFF de Next.js, baseURL vacio) como a apps/mobile
 * (URL directa del backend + token de SecureStore), segun el hint tecnico
 * de la issue #16.
 */
export function createApiClient(config: ApiClientConfig = {}): ApiClient {
  const { baseURL = "", apiPrefix = "/api", getAuthToken } = config;

  const buildUrl = (path: string) => `${baseURL}${apiPrefix}${path}`;

  const raw = async (path: string, init: RequestInit = {}): Promise<Response> => {
    const authHeaders = await resolveAuthHeaders(getAuthToken);
    return fetch(buildUrl(path), {
      ...init,
      headers: {
        ...authHeaders,
        ...(init.headers as Record<string, string> | undefined),
      },
    });
  };

  /**
   * GET con reintentos (backoff exponencial), incluyendo el header de auth
   * en cada intento. Corrige un bug de la version anterior (issue #028):
   * `get()` usaba `fetcher()` directo sin pasar por `raw()`, por lo que
   * nunca enviaba el token de auth en peticiones GET — invisible en web
   * (usa cookies) pero critico en mobile (usa Authorization header).
   */
  const get = async <T>(path: string): Promise<T> => {
    let lastError: Error = new Error("Max retries exceeded");

    for (let attempt = 0; attempt < MAX_GET_RETRIES; attempt++) {
      try {
        const response = await raw(path);

        if (response.ok) {
          return response.json() as Promise<T>;
        }

        if (response.status < 500) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (err) {
        if (err instanceof Error && /^HTTP 4/.test(err.message)) throw err;
        lastError = err instanceof Error ? err : new Error(String(err));
      }

      if (attempt < MAX_GET_RETRIES - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 500)
        );
      }
    }

    throw lastError;
  };

  const mutate = async <T>(
    method: "POST" | "PATCH" | "PUT" | "DELETE",
    path: string,
    body?: unknown
  ): Promise<T> => {
    const response = await raw(path, {
      method,
      ...(body !== undefined
        ? {
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          }
        : {}),
    });
    if (!response.ok) {
      throw new Error(`Failed ${method} ${path}: ${response.status}`);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return response.json() as Promise<T>;
  };

  return {
    apiPrefix,
    get,
    raw,
    post: <T>(path: string, body?: unknown) => mutate<T>("POST", path, body),
    patch: <T>(path: string, body?: unknown) => mutate<T>("PATCH", path, body),
    put: <T>(path: string, body?: unknown) => mutate<T>("PUT", path, body),
    delete: <T = void>(path: string) => mutate<T>("DELETE", path),
  };
}

/**
 * Instancia compartida usada por todos los hooks de packages/shared-core
 * cuando no se les inyecta un cliente explicito. Por defecto configurada
 * para el caso de apps/web (baseURL vacio, sin token — la sesion viaja por
 * cookies).
 *
 * apps/mobile (issue #028) la reconfigura UNA VEZ al arrancar la app via
 * `configureApiClient({ baseURL, getAuthToken })`, antes de que se monte
 * cualquier componente que use los hooks. Como los `*Api.ts` usan
 * `client: ApiClient = apiClient` como valor por defecto de parametro,
 * y los parametros por defecto de JS se evaluan en cada llamada (no una
 * sola vez), reasignar esta variable es suficiente para que todos los
 * hooks empiecen a usar el nuevo cliente sin cambiar su firma.
 */
export let apiClient: ApiClient = createApiClient();

/**
 * Reconfigura la instancia compartida de `apiClient`. Pensado para
 * llamarse una unica vez al arrancar la app (ver
 * `apps/mobile/src/lib/bootstrapApiClient.ts`).
 */
export function configureApiClient(config: ApiClientConfig): void {
  apiClient = createApiClient(config);
}
