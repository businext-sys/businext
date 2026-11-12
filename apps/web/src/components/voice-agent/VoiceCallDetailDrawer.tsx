"use client";

import { User } from "lucide-react";
import { useVoiceAgentCall } from "@/hooks/useVoiceAgentCalls";
import { Drawer } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { AssistantBubble, AssistantMessage } from "@/components/trends/AssistantMessage";
import {
  callOutcome,
  formatCallDateTime,
  formatDuration,
  parseTranscript,
  sentimentLabel,
  type TranscriptTurn,
} from "./format";

export function VoiceCallDetailDrawer({
  callId,
  onClose,
}: {
  callId: number | null;
  onClose: () => void;
}) {
  const { call, loading, error } = useVoiceAgentCall(callId);
  const turns = call?.transcript ? parseTranscript(call.transcript) : [];
  const rejected = call?.status === "rejected";

  return (
    <Drawer open={callId !== null} onClose={onClose} className="max-w-md">
      <div className="space-y-6 px-6 pb-8">
        {loading || (!call && !error) ? (
          <SectionSkeleton />
        ) : error || !call ? (
          <p className="text-body-sm text-danger">No se pudo cargar la llamada.</p>
        ) : (
          <>
            <div className="space-y-1">
              <p className="text-caption font-medium uppercase text-secondary">
                {formatCallDateTime(call.startedAt)}
              </p>
              <h2 className="font-heading text-h3 font-bold text-foreground">
                {call.fromNumber ?? "Número oculto"}
              </h2>
            </div>

            <AssistantMessage>
              <AssistantBubble className="text-body-sm">
                {call.summary ??
                  (rejected
                    ? "No atendí esta llamada porque el agente estaba desactivado."
                    : "Aún no tengo el resumen de esta llamada.")}
              </AssistantBubble>
              <div className="flex flex-wrap gap-2">
                <Badge variant={callOutcome(call).variant}>{callOutcome(call).label}</Badge>
                {sentimentLabel(call.sentiment) && (
                  <Badge variant="muted">Tono {sentimentLabel(call.sentiment)?.toLowerCase()}</Badge>
                )}
                {call.durationSeconds !== null && (
                  <Badge variant="muted">{formatDuration(call.durationSeconds)}</Badge>
                )}
              </div>
            </AssistantMessage>

            {call.recordingUrl && (
              <section className="space-y-2">
                <h3 className="text-label font-semibold text-foreground-muted">Grabación</h3>
                <audio controls src={call.recordingUrl} className="w-full" />
              </section>
            )}

            <section className="space-y-3">
              <h3 className="text-label font-semibold text-foreground-muted">Transcripción</h3>
              {turns.length > 0 ? (
                <ol className="space-y-3">
                  {turns.map((turn, index) => (
                    <TranscriptBubble key={index} turn={turn} />
                  ))}
                </ol>
              ) : (
                <p className="rounded-[0.875rem] border border-dashed border-border-subtle px-3.5 py-3 text-body-sm text-foreground-muted">
                  {rejected
                    ? "La llamada se rechazó: no hay conversación."
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

function TranscriptBubble({ turn }: { turn: TranscriptTurn }) {
  if (turn.speaker === "agent") {
    return (
      <li className="flex items-start gap-2 pr-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- tiny static avatar */}
        <img
          src="/avatar-asistente.jpg"
          alt="Agente"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 rounded-full border-2 border-primary object-cover"
        />
        <p className="whitespace-pre-line rounded-[0.875rem] rounded-tl-[4px] border border-border-subtle bg-surface px-3.5 py-3 text-body-sm text-foreground">
          {turn.text}
        </p>
      </li>
    );
  }
  return (
    <li className="flex flex-row-reverse items-start gap-2 pl-8">
      <span
        aria-label="Cliente"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
      >
        <User className="h-4 w-4" />
      </span>
      <p className="whitespace-pre-line rounded-[0.875rem] rounded-tr-[4px] bg-surface-raised px-3.5 py-3 text-body-sm text-foreground">
        {turn.text}
      </p>
    </li>
  );
}
