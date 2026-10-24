import type { AccessCapabilitiesFull } from "../services/access";

export type QuickAction = {
  id: string;
  label: string;
  message: string;
  requires?: keyof AccessCapabilitiesFull;
  roles?: string[];
};

const MANAGEMENT_ROLES = ["owner", "manager"];

export const QUICK_ACTIONS: QuickAction[] = [
  { id: "today-reservations", label: "Reservas de hoy", message: "¿Qué reservas tengo hoy?" },
  {
    id: "cash",
    label: "¿Cómo va mi caja?",
    message: "¿Cómo va mi caja hoy?",
    roles: MANAGEMENT_ROLES,
  },
  {
    id: "pending-requests",
    label: "Solicitudes pendientes",
    message: "¿Qué solicitudes de reserva tengo pendientes?",
    requires: "canManageReservations",
  },
  {
    id: "new-reservation",
    label: "Nueva reserva",
    message: "Quiero crear una reserva nueva.",
    requires: "canManageReservations",
  },
  {
    id: "weekly-summary",
    label: "Resumen de la semana",
    message: "Dame el resumen de esta semana.",
    roles: MANAGEMENT_ROLES,
  },
  {
    id: "recent-reviews",
    label: "Reseñas recientes",
    message: "¿Qué reseñas recientes tengo?",
    requires: "canManageReviews",
  },
];

export function quickActionsFor(
  context: { role: string; capabilities: AccessCapabilitiesFull } | null
): QuickAction[] {
  return QUICK_ACTIONS.filter(
    (action) =>
      (!action.requires || Boolean(context?.capabilities[action.requires])) &&
      (!action.roles || (context !== null && action.roles.includes(context.role)))
  );
}
