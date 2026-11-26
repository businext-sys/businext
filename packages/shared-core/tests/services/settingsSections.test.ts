import { describe, it, expect } from "vitest";
import {
  LEGACY_SETTINGS_BLOCKS,
  LEGACY_SETTINGS_SECTIONS,
  SETTINGS_SECTIONS,
  resolveSettingsSection,
  visibleSettingsSections,
} from "../../src/services/settingsSections";
import type { AccessCapabilitiesFull } from "../../src/services/access";

const ownerCaps: AccessCapabilitiesFull = {
  canAccessApp: true,
  canManageConfiguration: true,
  canManageTeam: true,
  canManageProducts: true,
  canManageFinances: true,
  canManageReservations: true,
  canManageReviews: true,
  canViewTrends: true,
};

const employeeCaps: AccessCapabilitiesFull = {
  ...ownerCaps,
  canManageTeam: false,
  canManageProducts: false,
  canManageFinances: false,
  canManageReviews: false,
  canViewTrends: false,
};

const ids = (sections: { id: string }[]) => sections.map((section) => section.id);

describe("settingsSections", () => {
  it("agrupa la configuracion en seis apartados", () => {
    expect(SETTINGS_SECTIONS).toHaveLength(6);
  });

  it("cada bloque esta en un solo apartado", () => {
    const blocks = SETTINGS_SECTIONS.flatMap((section) => section.blocks);
    expect(new Set(blocks).size).toBe(blocks.length);
  });

  it("todos los apartados de antes tienen destino y bloque", () => {
    const sectionIds = ids(SETTINGS_SECTIONS);
    const blocks = SETTINGS_SECTIONS.flatMap((section) => section.blocks);
    for (const [legacy, target] of Object.entries(LEGACY_SETTINGS_SECTIONS)) {
      expect(sectionIds).toContain(target);
      const block = LEGACY_SETTINGS_BLOCKS[legacy];
      expect(SETTINGS_SECTIONS.find((s) => s.id === target)?.blocks).toContain(block);
    }
    expect(Object.keys(LEGACY_SETTINGS_BLOCKS).sort()).toEqual(
      Object.keys(LEGACY_SETTINGS_SECTIONS).sort()
    );
    expect(blocks).toContain("loyalty");
  });

  it("el owner lo ve todo", () => {
    const visible = visibleSettingsSections({ role: "owner", capabilities: ownerCaps });
    expect(ids(visible)).toEqual(ids(SETTINGS_SECTIONS));
    expect(visible.flatMap((s) => s.blocks)).toEqual(SETTINGS_SECTIONS.flatMap((s) => s.blocks));
  });

  it("el empleado solo ve su negocio (lectura) y su cuenta, sin suscripcion", () => {
    const visible = visibleSettingsSections({ role: "employee", capabilities: employeeCaps });
    expect(ids(visible)).toEqual(["negocio", "cuenta"]);
    expect(visible[0].blocks).toEqual(["businessInfo"]);
    expect(visible[1].blocks).toEqual(["profile", "appearance"]);
  });

  it("el manager ve recordatorios y fidelidad pero no el enlace de reservas ni el agente de voz", () => {
    const visible = visibleSettingsSections({
      role: "manager",
      capabilities: { ...ownerCaps, canManageTeam: true },
    });
    const reservas = visible.find((s) => s.id === "reservas");
    expect(reservas?.blocks).toEqual(["reminders", "loyalty"]);
    const asistente = visible.find((s) => s.id === "asistente");
    expect(asistente?.blocks).toEqual(["contentPreferences", "reviews"]);
    const equipo = visible.find((s) => s.id === "equipo");
    expect(equipo?.blocks).toEqual(["team"]);
  });

  it("resuelve los apartados nuevos y los de antes", () => {
    const visible = visibleSettingsSections({ role: "owner", capabilities: ownerCaps });
    expect(resolveSettingsSection("reservas", visible)).toBe("reservas");
    expect(resolveSettingsSection("content", visible)).toBe("asistente");
    expect(resolveSettingsSection("products", visible)).toBe("servicios");
    expect(resolveSettingsSection("hours", visible)).toBe("equipo");
  });

  it("si el apartado no existe o no se ve, abre el primero visible", () => {
    const visible = visibleSettingsSections({ role: "employee", capabilities: employeeCaps });
    expect(resolveSettingsSection("nada", visible)).toBe("negocio");
    expect(resolveSettingsSection("booking", visible)).toBe("negocio");
    expect(resolveSettingsSection(null, visible)).toBe("negocio");
    expect(resolveSettingsSection("x", [])).toBeNull();
  });
});
