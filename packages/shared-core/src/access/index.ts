import type { AccessRole } from "../employee";

// ---------------------------------------------------------------------------
// Backend-driven access context (forma de los datos unicamente).
//
// Las funciones que obtienen este contexto via red (getServerAccessContextFromJwt,
// getClientAccessContextFromApi) NO viven aqui: dependen de un mecanismo de
// transporte especifico de la plataforma (rutas BFF de Next.js, JWT en header).
// Esas funciones permanecen en apps/web/src/lib/auth/access.ts.
// Ver specs/001-extraer-core-compartido/research.md (Decision 1 y FR-008).
// ---------------------------------------------------------------------------

export type AccessCapabilities = {
  canAccessApp: boolean;
  canManageConfiguration: boolean;
  canManageProducts: boolean;
  canManageFinances: boolean;
  canManageReservations: boolean;
  canManageReviews: boolean;
};

export type BackendAccessContext = {
  userId: string;
  businessId: string;
  role: AccessRole;
  accountType: "owner" | "member";
  memberStatus: string | null;
  subscriptionActive: boolean;
  capabilities: AccessCapabilities;
};
