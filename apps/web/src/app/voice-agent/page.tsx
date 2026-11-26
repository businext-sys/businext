"use client";

import Link from "next/link";
import { PhoneCall, Settings, ShieldAlert } from "lucide-react";
import { useAccessContext } from "@/hooks/useAccessContext";
import { PageContainer, PageHeader } from "@/components/common/PageLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/tabs";
import { VoiceCallKpis } from "@/components/voice-agent/VoiceCallKpis";
import { VoiceCallList } from "@/components/voice-agent/VoiceCallList";

export default function VoiceAgentPage() {
  const { context, loading } = useAccessContext();

  return (
    <PageContainer>
        <PageHeader
          icon={PhoneCall}
          title="Agente de voz"
          description="Las llamadas que atiende tu asistente telefónico y sus resultados"
          action={
            context?.role === "owner" && (
              <Link
                href="/configuration?section=asistente#bloque-voiceAgent"
                className="inline-flex h-11 items-center gap-2 self-start rounded-md border border-border px-4 text-body-sm font-medium text-foreground transition-colors hover:bg-surface-raised"
              >
                <Settings className="h-4 w-4" />
                Ajustes del agente
              </Link>
            )
          }
        />

        {loading ? (
          <SectionSkeleton />
        ) : context?.role !== "owner" ? (
          <EmptyState
            icon={<ShieldAlert />}
            title="Acceso restringido"
            description="Solo el propietario del negocio puede ver el agente de voz."
          />
        ) : (
          <TabGroup>
            <TabList>
              <Tab>Resumen</Tab>
              <Tab>Llamadas</Tab>
            </TabList>
            <TabPanels className="mt-6">
              <TabPanel>
                <VoiceCallKpis />
              </TabPanel>
              <TabPanel>
                <VoiceCallList />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        )}
    </PageContainer>
  );
}
