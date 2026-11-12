"use client";

import { useAccessContext } from "@/hooks/useAccessContext";
import { TrendsOverview } from "@/components/trends/TrendsOverview";
import { PageContainer, PageHeader } from "@/components/common/PageLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { ShieldAlert, TrendingUp } from "lucide-react";

export default function TrendsPage() {
  const { capabilities, loading: authLoading } = useAccessContext();

  if (authLoading) {
    return (
      <PageContainer>
        <SectionSkeleton />
        <SectionSkeleton />
      </PageContainer>
    );
  }

  if (!capabilities.canViewTrends) {
    return (
      <PageContainer>
        <EmptyState
          icon={<ShieldAlert />}
          title="Acceso restringido"
          description="Solo el propietario y los encargados del negocio pueden ver las tendencias."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        icon={TrendingUp}
        title="Tendencias"
        description="Lo que funciona en tus redes y las ideas de contenido para tu negocio"
      />
      <TrendsOverview />
    </PageContainer>
  );
}
