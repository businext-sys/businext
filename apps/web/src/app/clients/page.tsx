"use client";

import { useAccessContext } from "@/hooks/useAccessContext";
import { useWeeklySummary } from "@/hooks/useWeeklySummary";
import { ClientAnalysis } from "@/components/intelligence/ClientAnalysis";
import { AiNote } from "@/components/intelligence/AiNote";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Users } from "lucide-react";

export default function ClientsPage() {
  const { context, loading: authLoading } = useAccessContext();
  const isOwnerOrManager = context?.role === "owner" || context?.role === "manager";

  if (authLoading) {
    return (
      <div className="min-h-screen w-full pt-14 md:pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      </div>
    );
  }

  if (!isOwnerOrManager) {
    return (
      <div className="min-h-screen w-full pt-14 md:pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <EmptyState
            icon={<ShieldAlert />}
            title="Acceso restringido"
            description="Solo el propietario y los encargados del negocio pueden ver el análisis de clientes."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pt-14 md:pt-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface-raised">
            <Users className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-heading text-h3 font-bold text-foreground">Clientes</h1>
            <p className="text-body-sm text-foreground-muted">
              Quién vuelve, quién es nuevo y a quién conviene escribir
            </p>
          </div>
        </div>
        <ClientInsights />
      </div>
    </div>
  );
}

function ClientInsights() {
  const { summary } = useWeeklySummary();

  return (
    <>
      {summary?.client_narrative && <AiNote text={summary.client_narrative} />}
      <ClientAnalysis />
    </>
  );
}
