"use client";

import type { ReactNode } from "react";
import { Gift } from "lucide-react";
import { stampsLeft, type LoyaltyCard } from "@businext/shared-core/loyalty";
import { cn } from "@/lib/utils";

const MAX_DOTS = 20;
const VISITS_SHOWN = 3;

const visitDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

/** Sellos X/N, el premio y las últimas visitas de una tarjeta. Las acciones van en `children`. */
export function LoyaltyCardSummary({ card, children }: { card: LoyaltyCard; children?: ReactNode }) {
  const left = stampsLeft(card);
  const shownStamps = Math.min(card.stamps, card.stampsRequired);
  const visits = card.visits.slice(0, VISITS_SHOWN);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-caption font-bold uppercase tracking-widest text-secondary">
          Tarjeta de fidelidad
        </p>
        <p className="text-body-sm text-foreground-muted truncate">
          {card.customerName} · {card.customerEmail}
        </p>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-heading text-h1 font-bold text-foreground leading-none">
            {card.stamps}/{card.stampsRequired}
          </p>
          <p className="mt-1 text-caption text-foreground-muted">sellos</p>
        </div>
        {card.stampsRequired <= MAX_DOTS && (
          <div className="flex flex-wrap justify-end gap-1.5 max-w-[60%]" aria-hidden>
            {Array.from({ length: card.stampsRequired }, (_, i) => (
              <span
                key={i}
                className={cn(
                  "h-3 w-3 rounded-full border",
                  i < shownStamps ? "bg-primary border-primary" : "border-border"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {card.rewardReady ? (
        <div className="flex items-center gap-2 rounded-md bg-success px-3 py-2 text-body-sm font-medium text-success-foreground">
          <Gift className="h-4 w-4 shrink-0" aria-hidden />
          Premio disponible: {card.reward}
        </div>
      ) : (
        <p className="text-body-sm text-foreground-muted">
          {card.reward}: le {left === 1 ? "falta 1 sello" : `faltan ${left} sellos`}
        </p>
      )}

      {visits.length > 0 && (
        <div>
          <p className="text-caption text-foreground-subtle mb-1">Últimas visitas</p>
          <ul className="space-y-1">
            {visits.map((v, i) => (
              <li key={`${v.visitDate}-${i}`} className="flex justify-between gap-3 text-body-sm">
                <span className="truncate text-foreground">{v.service}</span>
                <span className="shrink-0 text-foreground-muted">
                  {visitDate(v.visitDate)}
                  {v.redeemed && " · canjeado"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {children}
    </div>
  );
}
