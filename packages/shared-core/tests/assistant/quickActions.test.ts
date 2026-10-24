import { describe, it, expect } from "vitest";
import { QUICK_ACTIONS, quickActionsFor } from "../../src/assistant/quickActions";
import type { AccessCapabilitiesFull } from "../../src/services/access";

const none: AccessCapabilitiesFull = {
  canAccessApp: true,
  canManageConfiguration: false,
  canManageTeam: false,
  canManageProducts: false,
  canManageFinances: false,
  canManageReservations: false,
  canManageReviews: false,
};

const all: AccessCapabilitiesFull = {
  canAccessApp: true,
  canManageConfiguration: true,
  canManageTeam: true,
  canManageProducts: true,
  canManageFinances: true,
  canManageReservations: true,
  canManageReviews: true,
};

// Capacidades reales del rol employee en el backend (_build_capabilities).
const employeeCapabilities: AccessCapabilitiesFull = {
  ...none,
  canManageFinances: true,
  canManageReservations: true,
};

const labels = (context: Parameters<typeof quickActionsFor>[0]) =>
  quickActionsFor(context).map((action) => action.label);

describe("quickActionsFor", () => {
  it("un owner ve todas las acciones rapidas", () => {
    expect(quickActionsFor({ role: "owner", capabilities: all })).toEqual(QUICK_ACTIONS);
  });

  it("un employee no ve la caja ni el resumen aunque tenga canManageFinances", () => {
    const employee = labels({ role: "employee", capabilities: employeeCapabilities });
    expect(employee).not.toContain("¿Cómo va mi caja?");
    expect(employee).not.toContain("Resumen de la semana");
    expect(employee).not.toContain("Reseñas recientes");
    expect(employee).toContain("Solicitudes pendientes");
    expect(employee).toContain("Nueva reserva");
  });

  it("un manager ve la caja y el resumen", () => {
    const manager = labels({ role: "manager", capabilities: all });
    expect(manager).toContain("¿Cómo va mi caja?");
    expect(manager).toContain("Resumen de la semana");
  });

  it("sin contexto aun solo queda Reservas de hoy", () => {
    expect(labels(null)).toEqual(["Reservas de hoy"]);
  });
});
