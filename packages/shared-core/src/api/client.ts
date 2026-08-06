import { fetcher } from "./fetcher";

export type ApiClientConfig = {
  /**
   * Prefijo de todas las rutas. En web (BFF de Next.js) se deja vacio (las
   * rutas ya son relativas: `/api/...`). En mobile sera la URL absoluta del
   * backend (ej. `https://api.businext.app`).
   */
  baseURL?: string;
  /**
   * Funcion que obtiene el token de autenticacion a inyectar como header
   * `Authorization: Bearer <token>`. En web no hace falta (la sesion viaja
   * por cookies, gestionadas por el middleware de Next.js) — se deja sin
   * configurar. En mobile se le pasa una funcion que lee de SecureStore.
   */
  getAuthToken?: () => Promise<string | null> | string | null;
};

export type ApiClient = {
  /** GET con reintentos automaticos (via fetcher) + parseo JSON. */
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
  const { baseURL = "", getAuthToken } = config;

  const buildUrl = (path: string) => `${baseURL}${path}`;

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

  const get = async <T>(path: string): Promise<T> => {
    // Nota: fetcher() no soporta headers custom hoy; en web no hacen falta
    // (cookies). Si mobile requiere headers en GET, se debe extender fetcher
    // o usar raw() + parseo manual — no bloqueante para esta issue.
    return fetcher<T>(buildUrl(path));
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
    get,
    raw,
    post: <T>(path: string, body?: unknown) => mutate<T>("POST", path, body),
    patch: <T>(path: string, body?: unknown) => mutate<T>("PATCH", path, body),
    put: <T>(path: string, body?: unknown) => mutate<T>("PUT", path, body),
    delete: <T = void>(path: string) => mutate<T>("DELETE", path),
  };
}

/**
 * Instancia por defecto usada por todos los hooks de packages/shared-core
 * cuando no se les inyecta un cliente explicito. Configurada para el caso
 * de apps/web (baseURL vacio, sin token — la sesion viaja por cookies).
 *
 * apps/mobile (Fase 5) creara su propia instancia con
 * `createApiClient({ baseURL: ..., getAuthToken: ... })` y la pasara a los
 * hooks que la acepten como parametro.
 */
export const apiClient = createApiClient();
