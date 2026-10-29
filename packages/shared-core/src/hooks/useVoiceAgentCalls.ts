"use client";
import useSWR from "swr";
import type {
  VoiceCallDetail,
  VoiceCallFilters,
  VoiceCallPage,
  VoiceCallStats,
} from "../voice-agent";
import { voiceAgentApi } from "../api/voiceAgentApi";
import { voiceCallFiltersToQuery } from "../mappers/voice-agent";

const CALLS_KEY = "/api/voice-agent/calls";
const STATS_KEY = "/api/voice-agent/stats";

/** Registro de llamadas del agente de voz (solo owner). */
export function useVoiceAgentCalls(filters: VoiceCallFilters = {}, enabled = true) {
  const { data, isLoading: loading, error, mutate } = useSWR<VoiceCallPage>(
    enabled ? `${CALLS_KEY}${voiceCallFiltersToQuery(filters)}` : null,
    () => voiceAgentApi.listCalls(filters),
    { keepPreviousData: true }
  );
  return {
    calls: data?.items ?? [],
    total: data?.total ?? 0,
    loading,
    error,
    refresh: () => mutate(),
  };
}

/** Una llamada con transcripcion; `id` nulo no pide nada. */
export function useVoiceAgentCall(id: number | null) {
  const { data: call, isLoading: loading, error } = useSWR<VoiceCallDetail>(
    id !== null ? `${CALLS_KEY}?id=${id}` : null,
    () => voiceAgentApi.getCall(id as number)
  );
  return { call, loading, error };
}

/** KPIs de las llamadas de los ultimos `days` dias. */
export function useVoiceAgentStats(days = 30, enabled = true) {
  const { data: stats, isLoading: loading, error } = useSWR<VoiceCallStats>(
    enabled ? `${STATS_KEY}?days=${days}` : null,
    () => voiceAgentApi.stats(days),
    { keepPreviousData: true }
  );
  return { stats, loading, error };
}
