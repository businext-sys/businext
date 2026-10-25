import type { ApiClient } from "./client";
import { apiClient } from "./client";
import type { VoiceAgentConfig, VoiceAgentConfigUpdate } from "../voice-agent";
import {
  mapVoiceAgentConfigFromApi,
  mapVoiceAgentConfigUpdateToApi,
} from "../mappers/voice-agent";

const PATH = "/voice-agent/config";

/** Configuracion del agente de voz del negocio (issue #118). Solo owner. */
export const voiceAgentApi = {
  get: (client: ApiClient = apiClient): Promise<VoiceAgentConfig> =>
    client
      .get<Record<string, unknown>>(PATH)
      .then(mapVoiceAgentConfigFromApi),

  update: async (
    update: VoiceAgentConfigUpdate,
    client: ApiClient = apiClient
  ): Promise<VoiceAgentConfig> => {
    const data = await client.patch<Record<string, unknown>>(
      PATH,
      mapVoiceAgentConfigUpdateToApi(update)
    );
    return mapVoiceAgentConfigFromApi(data);
  },
};
