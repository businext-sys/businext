"use client";

import { PhoneCall, ShieldAlert } from "lucide-react";
import { useAccessContext } from "@/hooks/useAccessContext";
import { PageContainer, PageHeader } from "@/components/common/PageLayout";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/tabs";
import { VoiceCallKpis } from "@/components/voice-agent/VoiceCallKpis";
import { VoiceCallList } from "@/components/voice-agent/VoiceCallList";
import { VoiceAgentSettings } from "@/components/voice-agent/VoiceAgentSettings";

export default function VoiceAgentPage() {
  const { context, loading } = useAccessContext();

  return (
    <PageContainer>
        <PageHeader
          icon={PhoneCall}
          title="Agente de voz"
          description="Las llamadas que atiende tu asistente telefónico, sus resultados y su configuración"
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
              <Tab>Configuración</Tab>
            </TabList>
            <TabPanels className="mt-6">
              <TabPanel>
                <VoiceCallKpis />
              </TabPanel>
              <TabPanel>
                <VoiceCallList />
              </TabPanel>
              <TabPanel>
                <VoiceAgentSettings />
              </TabPanel>
            </TabPanels>
          </TabGroup>
        )}
    </PageContainer>
  );
}
