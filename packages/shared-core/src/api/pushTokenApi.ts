import type { ApiClient } from "./client";
import { apiClient } from "./client";

/**
 * Registro de tokens de Expo Push Notifications (issue #031).
 *
 * NOTA: a diferencia de la mayoria de dominios, este SI corresponde 1:1
 * con la ruta real del backend (`/users/{userId}/push-tokens`, sin
 * prefijo `/api` en ningun lado porque no existe un BFF equivalente en
 * apps/web para este endpoint — se anadio directamente pensando en
 * mobile). Por eso no usa `client.apiPrefix` para elegir sufijo.
 */
export const pushTokenApi = {
  register: (
    userId: string,
    token: string,
    client: ApiClient = apiClient
  ): Promise<void> => client.post(`/users/${userId}/push-tokens`, { token }),

  unregister: (
    userId: string,
    token: string,
    client: ApiClient = apiClient
  ): Promise<void> => client.delete(`/users/${userId}/push-tokens`, { token }),
};
