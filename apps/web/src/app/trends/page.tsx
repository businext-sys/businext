"use client";

import { useAccessContext } from "@/hooks/useAccessContext";
import { TrendsOverview } from "@/components/trends/TrendsOverview";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { ShieldAlert, TrendingUp } from "lucide-react";

export default function TrendsPage() {
  const { capabilities, loading: authLoading } = useAccessContext();

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

  if (!capabilities.canViewTrends) {
    return (
      <div className="min-h-screen w-full pt-14 md:pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <EmptyState
            icon={<ShieldAlert />}
            title="Acceso restringido"
            description="Solo el propietario y los encargados del negocio pueden ver las tendencias."
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
            <TrendingUp className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h1 className="font-heading text-h3 font-bold text-foreground">Tendencias</h1>
            <p className="text-body-sm text-foreground-muted">
              Lo que funciona en tus redes y las ideas de contenido para tu negocio
            </p>
          </div>
        </div>
        <TrendsOverview />
      </div>
    </div>
  );
}
