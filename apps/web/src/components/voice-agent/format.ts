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
