import type {
  VoiceAgentConfigParsed,
  VoiceCallDetailParsed,
  VoiceCallPageParsed,
  VoiceCallParsed,
  VoiceCallStatsParsed,
} from "../schemas/voice-agent";

export type VoiceAgentConfig = VoiceAgentConfigParsed;
export type VoiceAgentBookingMode = VoiceAgentConfig["bookingMode"];

/** Lo que se puede cambiar desde la UI: los numeros los asigna Businext. */
export type VoiceAgentConfigUpdate = Partial<
  Pick<VoiceAgentConfig, "enabled" | "bookingMode">
>;

export type VoiceCall = VoiceCallParsed;
export type VoiceCallStatus = VoiceCall["status"];
export type VoiceCallDetail = VoiceCallDetailParsed;
export type VoiceCallPage = VoiceCallPageParsed;
export type VoiceCallStats = VoiceCallStatsParsed;

export type VoiceCallFilters = {
  limit?: number;
  offset?: number;
  status?: VoiceCallStatus;
  /** `true`: solo las que reservaron; `false`: solo las que no. */
  booked?: boolean;
};
