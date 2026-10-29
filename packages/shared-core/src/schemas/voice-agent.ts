import { z } from "zod";

/**
 * Configuracion del agente de voz de un negocio (businext-sys/businext#118),
 * `GET`/`PATCH /voice-agent/config` del backend (#117). Solo el owner la ve y
 * la cambia. `bookingMode`: "request" crea una solicitud de reserva;
 * "confirm" crea la reserva directamente en la agenda.
 */
export const VoiceAgentBookingModeSchema = z.enum(["request", "confirm"]);

export const VoiceAgentConfigSchema = z.object({
  enabled: z.boolean(),
  bookingMode: VoiceAgentBookingModeSchema,
  phoneNumbers: z.array(z.string()),
});

export type VoiceAgentConfigParsed = z.infer<typeof VoiceAgentConfigSchema>;

/**
 * Llamada del agente de voz (`GET /voice-agent/calls`). `status`:
 * "rejected" (agente desactivado), "inProgress" o "ended". `bookingMode` +
 * `bookingId`: la solicitud o reserva que creo la llamada, si creo alguna.
 */
export const VoiceCallStatusSchema = z.enum(["rejected", "inProgress", "ended"]);

export const VoiceCallSchema = z.object({
  id: z.number(),
  fromNumber: z.string().nullable(),
  status: VoiceCallStatusSchema,
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  durationSeconds: z.number().nullable(),
  disconnectionReason: z.string().nullable(),
  summary: z.string().nullable(),
  sentiment: z.string().nullable(),
  successful: z.boolean().nullable(),
  bookingMode: VoiceAgentBookingModeSchema.nullable(),
  bookingId: z.number().nullable(),
});

export const VoiceCallDetailSchema = VoiceCallSchema.extend({
  transcript: z.string().nullable(),
  recordingUrl: z.string().nullable(),
});

export const VoiceCallPageSchema = z.object({
  items: z.array(VoiceCallSchema),
  total: z.number(),
});

/** KPIs de los ultimos `days` dias (`GET /voice-agent/stats`). */
export const VoiceCallStatsSchema = z.object({
  days: z.number(),
  totalCalls: z.number(),
  answeredCalls: z.number(),
  rejectedCalls: z.number(),
  bookings: z.number(),
  bookingRate: z.number(),
  totalMinutes: z.number(),
  avgDurationSeconds: z.number(),
  positiveCalls: z.number(),
  negativeCalls: z.number(),
  daily: z.array(
    z.object({ date: z.string(), calls: z.number(), bookings: z.number() })
  ),
});

export type VoiceCallParsed = z.infer<typeof VoiceCallSchema>;
export type VoiceCallDetailParsed = z.infer<typeof VoiceCallDetailSchema>;
export type VoiceCallPageParsed = z.infer<typeof VoiceCallPageSchema>;
export type VoiceCallStatsParsed = z.infer<typeof VoiceCallStatsSchema>;
