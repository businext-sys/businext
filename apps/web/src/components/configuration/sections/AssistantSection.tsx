"use client";

import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { SettingsBlockId } from "@businext/shared-core/services";
import { VoiceAgentSettings } from "@/components/voice-agent/VoiceAgentSettings";
import { ContentPreferencesSection } from "@/components/trends/ContentPreferencesSection";
import { SettingsCard } from "@/components/configuration/SettingsCard";

/** «Asistente y redes»: agente de voz, ideas para redes y reseñas de Google. */
export function AssistantSection({ blocks }: { blocks: SettingsBlockId[] }) {
  return (
    <>
      {blocks.includes("voiceAgent") && (
        <div id="bloque-voiceAgent" className="scroll-mt-24">
          <VoiceAgentSettings />
        </div>
      )}
      {blocks.includes("contentPreferences") && (
        <div id="bloque-contentPreferences" className="scroll-mt-24">
          <ContentPreferencesSection />
        </div>
      )}
      {blocks.includes("reviews") && (
        <SettingsCard
          id="reviews"
          icon={Star}
          title="Reseñas de Google"
          description="Conecta tu ficha de Google Maps para ver tus reseñas y responderlas con ayuda."
          action={
            <Link
              href="/reviews"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-body-sm font-medium text-foreground transition-colors hover:bg-surface-raised"
            >
              Ir a Reseñas
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      )}
    </>
  );
}
