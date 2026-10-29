import type {
  VoiceAgentConfig,
  VoiceAgentConfigUpdate,
  VoiceCall,
  VoiceCallDetail,
  VoiceCallFilters,
  VoiceCallPage,
  VoiceCallStats,
  VoiceCallStatus,
} from "../voice-agent";
import {
  VoiceAgentConfigSchema,
  VoiceCallDetailSchema,
  VoiceCallSchema,
  VoiceCallStatsSchema,
} from "../schemas/voice-agent";

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

const CALL_STATUS: Record<string, VoiceCallStatus> = {
  rejected: "rejected",
  in_progress: "inProgress",
  ended: "ended",
};

const mapVoiceCallFields = (data: Record<string, unknown>) => ({
  id: data.id,
  fromNumber: data.from_number ?? null,
  status: CALL_STATUS[String(data.status)] ?? data.status,
  startedAt: data.started_at,
  endedAt: data.ended_at ?? null,
  durationSeconds: data.duration_seconds ?? null,
  disconnectionReason: data.disconnection_reason ?? null,
  summary: data.summary ?? null,
  sentiment: data.sentiment ?? null,
  successful: data.successful ?? null,
  bookingMode: data.booking_mode ?? null,
  bookingId: data.booking_id ?? null,
});

export const mapVoiceCallFromApi = (data: Record<string, unknown>): VoiceCall =>
  VoiceCallSchema.parse(mapVoiceCallFields(data));

export const mapVoiceCallDetailFromApi = (
  data: Record<string, unknown>
): VoiceCallDetail =>
  VoiceCallDetailSchema.parse({
    ...mapVoiceCallFields(data),
    transcript: data.transcript ?? null,
    recordingUrl: data.recording_url ?? null,
  });

export const mapVoiceCallPageFromApi = (
  data: Record<string, unknown>
): VoiceCallPage => ({
  items: ((data.items as Record<string, unknown>[]) ?? []).map(mapVoiceCallFromApi),
  total: Number(data.total ?? 0),
});

export const mapVoiceCallStatsFromApi = (
  data: Record<string, unknown>
): VoiceCallStats =>
  VoiceCallStatsSchema.parse({
    days: data.days,
    totalCalls: data.total_calls,
    answeredCalls: data.answered_calls,
    rejectedCalls: data.rejected_calls,
    bookings: data.bookings,
    bookingRate: data.booking_rate,
    totalMinutes: data.total_minutes,
    avgDurationSeconds: data.avg_duration_seconds,
    positiveCalls: data.positive_calls,
    negativeCalls: data.negative_calls,
    daily: data.daily ?? [],
  });

/** Query de `GET /voice-agent/calls` (status en snake_case como el backend). */
export const voiceCallFiltersToQuery = (filters: VoiceCallFilters): string => {
  const params = new URLSearchParams();
  if (filters.limit !== undefined) params.set("limit", String(filters.limit));
  if (filters.offset !== undefined) params.set("offset", String(filters.offset));
  if (filters.status)
    params.set("status", filters.status === "inProgress" ? "in_progress" : filters.status);
  if (filters.booked !== undefined) params.set("booked", String(filters.booked));
  const query = params.toString();
  return query ? `?${query}` : "";
};
