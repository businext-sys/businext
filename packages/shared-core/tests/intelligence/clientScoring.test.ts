import { describe, it, expect } from "vitest";
import { computeClientProfiles } from "../../src/intelligence";
import type { Reservation } from "../../src/reservation";

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 19);

const visit = (days: number, customerEmail?: string): Reservation => ({
  customerName: "Ana",
  inCharge: "Luis",
  reservationStartDate: daysAgo(days),
  reservationEndDate: daysAgo(days),
  timePerReservation: 30,
  service: "Corte",
  status: "COMPLETED",
  customerEmail,
});

describe("computeClientProfiles (#186)", () => {
  it("marca en riesgo a quien no vuelve en el doble de su frecuencia", () => {
    const [profile] = computeClientProfiles([visit(100), visit(90), visit(80)], [], []);
    expect(profile.loyaltyStatus).toBe("en_riesgo");
  });

  it("toma el email de la reserva más reciente que lo tiene", () => {
    const [profile] = computeClientProfiles(
      [visit(100, "viejo@example.com"), visit(90, "nuevo@example.com"), visit(80)],
      [],
      []
    );
    expect(profile.customerEmail).toBe("nuevo@example.com");
  });

  it("deja el email vacío si ninguna reserva lo tiene", () => {
    const [profile] = computeClientProfiles([visit(100), visit(90)], [], []);
    expect(profile.customerEmail).toBeUndefined();
  });
});
