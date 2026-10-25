import type { VoiceAgentConfigParsed } from "../schemas/voice-agent";

export type VoiceAgentConfig = VoiceAgentConfigParsed;
export type VoiceAgentBookingMode = VoiceAgentConfig["bookingMode"];

/** Lo que se puede cambiar desde la UI: los numeros los asigna Businext. */
export type VoiceAgentConfigUpdate = Partial<
  Pick<VoiceAgentConfig, "enabled" | "bookingMode">
>;
