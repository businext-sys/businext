"use client";

import { useAccessContext } from "@/hooks/useAccessContext";
import { useWeeklySummary } from "@/hooks/useWeeklySummary";
import { ClientAnalysis } from "@/components/intelligence/ClientAnalysis";
import { AiNote } from "@/components/intelligence/AiNote";
import { PageContainer, PageHeader } from "@/components/common/PageLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { ShieldAlert, Users } from "lucide-react";

export default function ClientsPage() {
  const { context, loading: authLoading } = useAccessContext();
  const isOwnerOrManager = context?.role === "owner" || context?.role === "manager";

  if (authLoading) {
    return (
      <PageContainer>
        <SectionSkeleton />
        <SectionSkeleton />
      </PageContainer>
    );
  }

  if (!isOwnerOrManager) {
    return (
      <PageContainer>
        <EmptyState
          icon={<ShieldAlert />}
          title="Acceso restringido"
          description="Solo el propietario y los encargados del negocio pueden ver el análisis de clientes."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        icon={Users}
        title="Clientes"
        description="Quién vuelve, quién es nuevo y a quién conviene escribir"
      />
      <ClientInsights />
    </PageContainer>
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
