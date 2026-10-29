"use client";

import { useVoiceAgentCall } from "@/hooks/useVoiceAgentCalls";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { callOutcome, formatCallDateTime, formatDuration, sentimentLabel } from "./format";

export function VoiceCallDetailDrawer({
  callId,
  onClose,
}: {
  callId: number | null;
  onClose: () => void;
}) {
  const { call, loading, error } = useVoiceAgentCall(callId);

  return (
    <Drawer open={callId !== null} onClose={onClose} className="max-w-md">
      <div className="space-y-6 px-6 pb-8">
        {loading || (!call && !error) ? (
          <SectionSkeleton />
        ) : error || !call ? (
          <p className="text-body-sm text-danger">No se pudo cargar la llamada.</p>
        ) : (
          <>
            <div className="space-y-2">
              <p className="text-caption font-medium uppercase text-secondary">
                {formatCallDateTime(call.startedAt)}
              </p>
              <h2 className="font-heading text-h3 font-bold text-foreground">
                {call.fromNumber ?? "Número oculto"}
              </h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant={callOutcome(call).variant}>{callOutcome(call).label}</Badge>
                {sentimentLabel(call.sentiment) && (
                  <Badge variant="muted">Tono {sentimentLabel(call.sentiment)?.toLowerCase()}</Badge>
                )}
              </div>
              <p className="text-body-sm text-foreground-muted">
                Duración: {formatDuration(call.durationSeconds)}
              </p>
            </div>

            {call.summary && (
              <section className="space-y-1">
                <h3 className="text-label font-semibold text-foreground-muted">Resumen</h3>
                <p className="text-body-sm text-foreground">{call.summary}</p>
              </section>
            )}

            {call.recordingUrl && (
              <section className="space-y-2">
                <h3 className="text-label font-semibold text-foreground-muted">Grabación</h3>
                <audio controls src={call.recordingUrl} className="w-full" />
              </section>
            )}

            <section className="space-y-1">
              <h3 className="text-label font-semibold text-foreground-muted">Transcripción</h3>
              {call.transcript ? (
                <p className="whitespace-pre-line text-body-sm text-foreground">
                  {call.transcript.replace(/^Agent:/gm, "Agente:").replace(/^User:/gm, "Cliente:")}
                </p>
              ) : (
                <p className="text-body-sm text-foreground-muted">
                  {call.status === "rejected"
                    ? "La llamada se rechazó porque el agente estaba desactivado."
                    : "Aún no hay transcripción."}
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </Drawer>
  );
}
