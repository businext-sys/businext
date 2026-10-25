import type { VoiceAgentConfig, VoiceAgentConfigUpdate } from "../voice-agent";
import { VoiceAgentConfigSchema } from "../schemas/voice-agent";

export const mapVoiceAgentConfigFromApi = (
  data: Record<string, unknown>
): VoiceAgentConfig =>
  VoiceAgentConfigSchema.parse({
    enabled: data.enabled,
    bookingMode: data.booking_mode,
    phoneNumbers: data.phone_numbers ?? [],
  });

export const mapVoiceAgentConfigUpdateToApi = (
  update: VoiceAgentConfigUpdate
) => ({
  ...(update.enabled !== undefined ? { enabled: update.enabled } : {}),
  ...(update.bookingMode !== undefined
    ? { booking_mode: update.bookingMode }
    : {}),
});
