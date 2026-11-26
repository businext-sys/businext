/**
 * Mapa de la configuracion simplificada (docs/plans/configuracion-simplificada.md):
 * seis apartados en lugar de los diez de antes, cada uno con los bloques que
 * ve cada rol. Puro, sin React ni rutas, para que web y mobile lo compartan.
 */
import type { AccessCapabilitiesFull } from "./access";
import type { AccessRole } from "../employee";

export type SettingsSectionId =
  | "negocio"
  | "equipo"
  | "servicios"
  | "reservas"
  | "asistente"
  | "cuenta";

/** Bloques de configuracion; cada uno es una tarjeta dentro de su apartado. */
export type SettingsBlockId =
  | "businessInfo"
  | "locations"
  | "businessHours"
  | "team"
  | "commissions"
  | "catalog"
  | "bookingLink"
  | "reminders"
  | "loyalty"
  | "voiceAgent"
  | "contentPreferences"
  | "reviews"
  | "profile"
  | "appearance"
  | "subscription";

export type SettingsSection = {
  id: SettingsSectionId;
  label: string;
  /** Una linea en lenguaje llano: que se decide aqui. */
  description: string;
  blocks: SettingsBlockId[];
};

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "negocio",
    label: "Tu negocio",
    description: "Nombre, contacto y locales.",
    blocks: ["businessInfo", "locations"],
  },
  {
    id: "equipo",
    label: "Equipo y horarios",
    description: "Cuándo abres, quién trabaja contigo y lo que cobra cada uno.",
    blocks: ["businessHours", "team", "commissions"],
  },
  {
    id: "servicios",
    label: "Servicios y productos",
    description: "Lo que ofreces, su precio y su duración.",
    blocks: ["catalog"],
  },
  {
    id: "reservas",
    label: "Reservas y clientes",
    description: "Tu enlace de reservas, los recordatorios y la tarjeta de fidelidad.",
    blocks: ["bookingLink", "reminders", "loyalty"],
  },
  {
    id: "asistente",
    label: "Asistente y redes",
    description: "El agente que coge el teléfono, las ideas para tus redes y tus reseñas.",
    blocks: ["voiceAgent", "contentPreferences", "reviews"],
  },
  {
    id: "cuenta",
    label: "Cuenta y plan",
    description: "Tus datos, cómo se ve la app y tu suscripción.",
    blocks: ["profile", "appearance", "subscription"],
  },
];

/** Apartados de antes (`?section=`) y a cual van ahora. */
export const LEGACY_SETTINGS_SECTIONS: Record<string, SettingsSectionId> = {
  profile: "cuenta",
  business: "negocio",
  locations: "negocio",
  products: "servicios",
  hours: "equipo",
  team: "equipo",
  booking: "reservas",
  reminders: "reservas",
  content: "asistente",
  appearance: "cuenta",
};

/** Ancla de cada apartado de antes dentro del nuevo, para hacer scroll hasta el bloque. */
export const LEGACY_SETTINGS_BLOCKS: Record<string, SettingsBlockId> = {
  profile: "profile",
  business: "businessInfo",
  locations: "locations",
  products: "catalog",
  hours: "businessHours",
  team: "team",
  booking: "bookingLink",
  reminders: "reminders",
  content: "contentPreferences",
  appearance: "appearance",
};

export type SettingsViewer = {
  role: AccessRole | null | undefined;
  capabilities: AccessCapabilitiesFull;
};

/** `true` si el rol ve ese bloque (los mismos permisos que antes de simplificar). */
export function canSeeSettingsBlock(block: SettingsBlockId, viewer: SettingsViewer): boolean {
  const isOwner = viewer.role === "owner";
  const isOwnerOrManager = isOwner || viewer.role === "manager";
  const caps = viewer.capabilities;
  switch (block) {
    case "businessInfo":
    case "profile":
    case "appearance":
      return true;
    case "locations":
    case "businessHours":
    case "bookingLink":
    case "commissions":
    case "voiceAgent":
    case "subscription":
      return isOwner;
    case "team":
      return caps.canManageTeam;
    case "catalog":
      return caps.canManageProducts;
    case "reminders":
    case "loyalty":
      return isOwnerOrManager;
    case "contentPreferences":
      return caps.canViewTrends;
    case "reviews":
      return caps.canManageReviews;
  }
}

/** Apartados con al menos un bloque visible, con solo esos bloques. */
export function visibleSettingsSections(viewer: SettingsViewer): SettingsSection[] {
  return SETTINGS_SECTIONS.map((section) => ({
    ...section,
    blocks: section.blocks.filter((block) => canSeeSettingsBlock(block, viewer)),
  })).filter((section) => section.blocks.length > 0);
}

/**
 * Apartado que abrir para un `?section=` (nuevo o de antes). Si no existe o el
 * rol no lo ve, el primero visible.
 */
export function resolveSettingsSection(
  requested: string | null | undefined,
  visible: SettingsSection[]
): SettingsSectionId | null {
  const id = requested ? LEGACY_SETTINGS_SECTIONS[requested] ?? requested : null;
  const match = visible.find((section) => section.id === id);
  return match?.id ?? visible[0]?.id ?? null;
}
