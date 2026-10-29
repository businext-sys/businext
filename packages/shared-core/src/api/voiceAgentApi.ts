import type { ApiClient } from "./client";
import { apiClient, resourcePath } from "./client";
import type {
  VoiceAgentConfig,
  VoiceAgentConfigUpdate,
  VoiceCallDetail,
  VoiceCallFilters,
  VoiceCallPage,
  VoiceCallStats,
} from "../voice-agent";
import {
  mapVoiceAgentConfigFromApi,
  mapVoiceAgentConfigUpdateToApi,
  mapVoiceCallDetailFromApi,
  mapVoiceCallPageFromApi,
  mapVoiceCallStatsFromApi,
  voiceCallFiltersToQuery,
} from "../mappers/voice-agent";

const PATH = "/voice-agent/config";
const CALLS_PATH = "/voice-agent/calls";
const STATS_PATH = "/voice-agent/stats";

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

  /** Llamadas del negocio, de la mas reciente a la mas antigua. Solo owner. */
  listCalls: (
    filters: VoiceCallFilters = {},
    client: ApiClient = apiClient
  ): Promise<VoiceCallPage> =>
    client
      .get<Record<string, unknown>>(`${CALLS_PATH}${voiceCallFiltersToQuery(filters)}`)
      .then(mapVoiceCallPageFromApi),

  /** Una llamada con su transcripcion y grabacion. */
  getCall: (id: number, client: ApiClient = apiClient): Promise<VoiceCallDetail> =>
    client
      .get<Record<string, unknown>>(resourcePath(client, CALLS_PATH, id))
      .then(mapVoiceCallDetailFromApi),

  /** KPIs de las llamadas de los ultimos `days` dias. */
  stats: (days = 30, client: ApiClient = apiClient): Promise<VoiceCallStats> =>
    client
      .get<Record<string, unknown>>(`${STATS_PATH}?days=${days}`)
      .then(mapVoiceCallStatsFromApi),
};
