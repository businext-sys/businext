import type { ApiClient } from "./client";
import { apiClient } from "./client";

/**
 * Borrado de la cuenta propia (requisito de App Store y Google Play).
 *
 * `DELETE /users/me` en el backend. Si es el owner, cancela la suscripción y
 * borra el negocio con todos sus datos; si es un miembro, solo su usuario y
 * su acceso. Como `pushTokenApi`, va directo a la ruta del backend: no hay
 * BFF en apps/web para este endpoint.
 */
export const accountApi = {
  deleteMe: (client: ApiClient = apiClient): Promise<void> =>
    client.delete("/users/me"),
};
