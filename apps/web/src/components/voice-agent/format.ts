import type { BadgeVariants } from "@/components/ui/badge";
import type { VoiceCall } from "@businext/shared-core";

// El backend devuelve UTC sin zona.
export function callDate(iso: string): Date {
  return new Date(/[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`);
}

export function formatCallDateTime(iso: string): string {
  return callDate(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes ? `${minutes} min ${rest.toString().padStart(2, "0")} s` : `${rest} s`;
}

type Outcome = { label: string; variant: BadgeVariants["variant"] };

export function callOutcome(call: VoiceCall): Outcome {
  if (call.status === "rejected") return { label: "Rechazada", variant: "muted" };
  if (call.status === "inProgress") return { label: "En curso", variant: "primary" };
  if (call.bookingMode === "confirm") return { label: "Cita reservada", variant: "success" };
  if (call.bookingMode === "request") return { label: "Solicitud creada", variant: "accent" };
  return { label: "Sin reserva", variant: "muted" };
}

const SENTIMENTS: Record<string, string> = {
  Positive: "Positivo",
  Neutral: "Neutral",
  Negative: "Negativo",
};

export function sentimentLabel(sentiment: string | null): string | null {
  return sentiment ? SENTIMENTS[sentiment] ?? null : null;
}

export type TranscriptTurn = { speaker: "agent" | "user"; text: string };

const SPEAKER_PREFIX = /^(Agent|User):\s*/;

// Retell manda la transcripción como líneas "Agent: …" / "User: …"; una línea sin prefijo sigue el turno anterior.
export function parseTranscript(transcript: string): TranscriptTurn[] {
  const turns: TranscriptTurn[] = [];
  for (const line of transcript.split("\n")) {
    const text = line.replace(SPEAKER_PREFIX, "").trim();
    const prefix = line.match(SPEAKER_PREFIX)?.[1];
    const last = turns[turns.length - 1];
    if (prefix) turns.push({ speaker: prefix === "Agent" ? "agent" : "user", text });
    else if (text && last) last.text = `${last.text}\n${text}`;
    else if (text) turns.push({ speaker: "agent", text });
  }
  return turns.filter((turn) => turn.text);
}
