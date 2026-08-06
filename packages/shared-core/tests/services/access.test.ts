import { describe, it, expect } from "vitest";
import {
  hasCapability,
  hasAnyCapability,
  hasAllCapabilities,
  getMissingCapabilities,
} from "../../src/services/access";
import type { AccessCapabilitiesFull } from "../../src/services/access";

const capabilities: AccessCapabilitiesFull = {
  canAccessApp: true,
  canManageConfiguration: false,
  canManageTeam: true,
  canManageProducts: false,
  canManageFinances: true,
  canManageReservations: false,
  canManageReviews: false,
};

describe("hasCapability", () => {
  it("devuelve true si la capacidad esta activa", () => {
    expect(hasCapability(capabilities, "canAccessApp")).toBe(true);
  });
  it("devuelve false si la capacidad no esta activa", () => {
    expect(hasCapability(capabilities, "canManageProducts")).toBe(false);
  });
});

describe("hasAnyCapability", () => {
  it("devuelve true si al menos una esta activa", () => {
    expect(
      hasAnyCapability(capabilities, ["canManageProducts", "canManageFinances"])
    ).toBe(true);
  });
  it("devuelve false si ninguna esta activa", () => {
    expect(
      hasAnyCapability(capabilities, ["canManageProducts", "canManageConfiguration"])
    ).toBe(false);
  });
});

describe("hasAllCapabilities", () => {
  it("devuelve true si todas estan activas", () => {
    expect(hasAllCapabilities(capabilities, ["canAccessApp", "canManageTeam"])).toBe(
      true
    );
  });
  it("devuelve false si alguna falta", () => {
    expect(
      hasAllCapabilities(capabilities, ["canAccessApp", "canManageProducts"])
    ).toBe(false);
  });
});

describe("getMissingCapabilities", () => {
  it("devuelve solo las capacidades no activas del subconjunto pedido", () => {
    expect(
      getMissingCapabilities(capabilities, [
        "canAccessApp",
        "canManageProducts",
        "canManageConfiguration",
      ])
    ).toEqual(["canManageProducts", "canManageConfiguration"]);
  });

  it("devuelve un array vacio si todas estan activas", () => {
    expect(
      getMissingCapabilities(capabilities, ["canAccessApp", "canManageTeam"])
    ).toEqual([]);
  });
});
