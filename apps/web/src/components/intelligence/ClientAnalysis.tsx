"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { useReservation } from "@/hooks/useReservation";
import { useFinances } from "@/hooks/useFinances";
import { useProduct } from "@/hooks/useProduct";
import { computeClientProfiles } from "@/lib/intelligence/client-scoring";
import type { ClientProfile } from "@/lib/intelligence/types";
import { CustomerMessageAction } from "@/components/intelligence/CustomerMessageAction";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  Clock,
  AlertTriangle,
  Heart,
  UserPlus,
} from "lucide-react";

/* ── Client row ──────────────────────────────────────────────────── */
function ClientRow({ client }: { client: ClientProfile }) {
  const trendIcon =
    client.trend === "up" ? (
      <TrendingUp className="h-3 w-3 text-success" />
    ) : client.trend === "down" ? (
      <TrendingDown className="h-3 w-3 text-danger" />
    ) : (
      <Minus className="h-3 w-3 text-foreground-subtle" />
    );

  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface-raised/20">
      {/* Status dot */}
      <span
        className={`h-2 w-2 rounded-full shrink-0 ${
          client.loyaltyStatus === "fiel"
            ? "bg-success/80"
            : client.loyaltyStatus === "en_riesgo"
            ? "bg-danger/80"
            : "bg-foreground-muted/70"
        }`}
      />

      {/* Name + services */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium text-foreground/90 truncate">
          {client.customerName}
        </p>
        <p className="text-[14px] text-foreground-subtle truncate mt-0.5">
          {client.services.slice(0, 2).join(", ")}
          {client.services.length > 2 && ` +${client.services.length - 2}`}
        </p>
        {client.loyaltyStatus === "en_riesgo" && <CustomerMessageAction client={client} />}
      </div>

      {/* Stats — desktop */}
      <div className="hidden sm:flex items-center gap-4 text-[14px] text-foreground-subtle shrink-0">
        <span className="font-medium">{client.visitCount} visitas</span>
        <span>{client.totalSpend.toLocaleString("es-ES", { minimumFractionDigits: 2 })}€</span>
        <span className="flex items-center gap-1">
          <Clock className="h-2.5 w-2.5" />
          hace {client.daysSinceLastVisit}d
        </span>
      </div>

      {/* Mobile stats */}
      <div className="sm:hidden text-right shrink-0">
        <p className="text-[14px] font-medium text-foreground/90">
          {client.visitCount} vis.
        </p>
        <p className="text-[14px] text-foreground-subtle">
          hace {client.daysSinceLastVisit}d
        </p>
      </div>

      {/* Trend */}
      <span className="shrink-0">{trendIcon}</span>
    </div>
  );
}

/* ── Collapsible category ────────────────────────────────────────── */
function ClientCategory({
  title,
  icon,
  count,
  clients,
  defaultOpen,
  accentColor,
  badgeClasses,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  clients: ClientProfile[];
  defaultOpen: boolean;
  accentColor: string;
  badgeClasses: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const shown = clients.slice(0, 5);

  if (count === 0) return null;

  return (
    <div className="rounded-xl border border-border-subtle bg-surface overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-surface-raised/20"
      >
        <span className={accentColor}>{icon}</span>
        <span className="text-[14px] font-medium text-foreground/90">{title}</span>
        <span className={`inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full text-[14px] font-bold ${badgeClasses}`}>
          {count}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-foreground-subtle ml-auto transition-transform duration-250 ease-out ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable list */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-border-subtle/40 divide-y divide-border-subtle/20">
          {shown.map((c) => (
            <ClientRow key={c.customerName} client={c} />
          ))}
          {clients.length > 5 && (
            <p className="text-center text-[14px] text-foreground-subtle py-2.5 font-medium">
              +{clients.length - 5} más
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Summary counter ─────────────────────────────────────────────── */
function ClientCount({ label, count, dotClass }: { label: string; count: number; dotClass: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="font-heading text-h1 font-bold text-foreground">{count}</p>
        <p className="mt-1 flex items-center gap-2 text-caption text-foreground-muted">
          <span className={`h-2 w-2 rounded-full ${dotClass}`} />
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

/* ── Main component ──────────────────────────────────────────────── */
export function ClientAnalysis() {
  const { reservationData } = useReservation();
  const { financesData } = useFinances();
  const { productData } = useProduct();

  const profiles = useMemo(
    () => computeClientProfiles(reservationData, financesData, productData),
    [reservationData, financesData, productData]
  );

  if (profiles.length === 0) {
    return (
      <Card>
        <CardContent>
          <EmptyState
            icon={<Users />}
            title="Sin datos de clientes"
            description="Completa reservas para ver el análisis de fidelización."
          />
        </CardContent>
      </Card>
    );
  }

  const loyal = profiles.filter((p) => p.loyaltyStatus === "fiel");
  const atRisk = profiles.filter((p) => p.loyaltyStatus === "en_riesgo");
  const fresh = profiles.filter((p) => p.loyaltyStatus === "nuevo");

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <ClientCount label="En riesgo" count={atRisk.length} dotClass="bg-danger" />
        <ClientCount label="Fieles" count={loyal.length} dotClass="bg-success" />
        <ClientCount label="Nuevos" count={fresh.length} dotClass="bg-foreground-subtle" />
      </div>

      {/* Collapsible categories */}
      <div className="space-y-2.5">
        <ClientCategory
          title="En riesgo de perder"
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          count={atRisk.length}
          clients={atRisk}
          defaultOpen={true}
          accentColor="text-danger"
          badgeClasses="text-danger bg-danger/10"
        />
        <ClientCategory
          title="Clientes fieles"
          icon={<Heart className="h-3.5 w-3.5" />}
          count={loyal.length}
          clients={loyal}
          defaultOpen={false}
          accentColor="text-success"
          badgeClasses="text-success bg-success/10"
        />
        <ClientCategory
          title="Nuevos"
          icon={<UserPlus className="h-3.5 w-3.5" />}
          count={fresh.length}
          clients={fresh}
          defaultOpen={false}
          accentColor="text-foreground-subtle"
          badgeClasses="text-foreground-subtle bg-foreground-muted/8"
        />
      </div>
    </section>
  );
}
