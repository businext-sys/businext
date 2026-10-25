"use client";
import useSWR from "swr";
import type { VoiceAgentConfig, VoiceAgentConfigUpdate } from "../voice-agent";
import { voiceAgentApi } from "../api/voiceAgentApi";

const KEY = "/api/voice-agent/config";

export function useVoiceAgentConfig(enabled = true) {
  const {
    data: config,
    isLoading: loading,
    error,
    mutate,
  } = useSWR<VoiceAgentConfig>(enabled ? KEY : null, () => voiceAgentApi.get());

  const updateVoiceAgentConfig = async (
    update: VoiceAgentConfigUpdate
  ): Promise<VoiceAgentConfig | null> => {
    try {
      return (
        (await mutate(() => voiceAgentApi.update(update), {
          optimisticData: config ? { ...config, ...update } : undefined,
          rollbackOnError: true,
          revalidate: false,
        })) ?? null
      );
    } catch {
      return null;
    }
  };

  return { config, loading, error, updateVoiceAgentConfig };
}
