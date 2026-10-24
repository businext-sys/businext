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

const labels = (capabilities: AccessCapabilitiesFull | null) =>
  quickActionsFor(capabilities).map((action) => action.label);

describe("quickActionsFor", () => {
  it("un owner ve todas las acciones rapidas", () => {
    expect(quickActionsFor(all)).toEqual(QUICK_ACTIONS);
  });

  it("un employee sin finanzas no ve la caja ni el resumen", () => {
    const employee = { ...none, canManageReservations: true };
    expect(labels(employee)).not.toContain("¿Cómo va mi caja?");
    expect(labels(employee)).not.toContain("Resumen de la semana");
    expect(labels(employee)).toContain("Solicitudes pendientes");
  });

  it("sin capacidades (o sin contexto aun) solo queda Reservas de hoy", () => {
    expect(labels(none)).toEqual(["Reservas de hoy"]);
    expect(labels(null)).toEqual(["Reservas de hoy"]);
  });

  it("las resenas dependen de canManageReviews", () => {
    expect(labels({ ...none, canManageReviews: true })).toContain("Reseñas recientes");
  });
});
