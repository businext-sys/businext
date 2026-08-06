/**
 * Helpers puros sobre capabilities de acceso (issue #17).
 *
 * Se usa la forma "completa" de capabilities (7 campos, incluye
 * `canManageTeam`) tal como la devuelve realmente el backend en
 * `/auth/me` y como la consume `useAccessContext` — no la forma de 6
 * campos de `../access` (que quedo desactualizada respecto al contrato
 * real del backend; alinearla es trabajo de la issue #018, generacion de
 * tipos desde OpenAPI).
 */

export type AccessCapabilitiesFull = {
  canAccessApp: boolean;
  canManageConfiguration: boolean;
  canManageTeam: boolean;
  canManageProducts: boolean;
  canManageFinances: boolean;
  canManageReservations: boolean;
  canManageReviews: boolean;
};

/** `true` si la capacidad indicada esta activa. */
export function hasCapability<K extends keyof AccessCapabilitiesFull>(
  capabilities: AccessCapabilitiesFull,
  key: K
): boolean {
  return Boolean(capabilities[key]);
}

/** `true` si CUALQUIERA de las capacidades indicadas esta activa. */
export function hasAnyCapability(
  capabilities: AccessCapabilitiesFull,
  keys: (keyof AccessCapabilitiesFull)[]
): boolean {
  return keys.some((key) => capabilities[key]);
}

/** `true` si TODAS las capacidades indicadas estan activas. */
export function hasAllCapabilities(
  capabilities: AccessCapabilitiesFull,
  keys: (keyof AccessCapabilitiesFull)[]
): boolean {
  return keys.every((key) => capabilities[key]);
}

/** Subconjunto de las capacidades pedidas que NO estan activas. */
export function getMissingCapabilities(
  capabilities: AccessCapabilitiesFull,
  keys: (keyof AccessCapabilitiesFull)[]
): (keyof AccessCapabilitiesFull)[] {
  return keys.filter((key) => !capabilities[key]);
}
