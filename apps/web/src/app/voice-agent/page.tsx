"use client";

import { ShieldAlert } from "lucide-react";
import { useAccessContext } from "@/hooks/useAccessContext";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/tabs";
import { VoiceCallKpis } from "@/components/voice-agent/VoiceCallKpis";
import { VoiceCallList } from "@/components/voice-agent/VoiceCallList";
import { VoiceAgentSettings } from "@/components/voice-agent/VoiceAgentSettings";

export default function VoiceAgentPage() {
  const { context, loading } = useAccessContext();

  return (
    <div className="min-h-screen w-full bg-background pt-14 md:pt-0">
      <div className="mx-auto max-w-7xl space-y-6 px-5 py-8 md:px-10">
        <div>
          <h1 className="font-heading text-h2 font-bold uppercase text-foreground">
            Agente de voz
          </h1>
          <p className="text-body-sm text-foreground-muted">
            Las llamadas que atiende tu asistente telefónico, sus resultados y su configuración.
          </p>
        </div>

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
      </div>
    </div>
  );
}
