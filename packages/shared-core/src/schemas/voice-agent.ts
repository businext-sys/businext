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
