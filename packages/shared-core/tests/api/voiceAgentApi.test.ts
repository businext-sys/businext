import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { voiceAgentApi } from "../../src/api/voiceAgentApi";

const CONFIG = { enabled: true, booking_mode: "request", phone_numbers: ["+34910000000"] };

describe("voiceAgentApi (issue #118)", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("get usa el BFF en web (/api/voice-agent/config)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(CONFIG), { status: 200 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const config = await voiceAgentApi.get(createApiClient({}));

    expect(fetchMock.mock.calls[0][0]).toBe("/api/voice-agent/config");
    expect(config).toEqual({
      enabled: true,
      bookingMode: "request",
      phoneNumbers: ["+34910000000"],
    });
  });

  it("update hace PATCH al backend directo con el body en snake_case", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ...CONFIG, booking_mode: "confirm" }), {
        status: 200,
      })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
    });
    const config = await voiceAgentApi.update({ bookingMode: "confirm" }, client);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.businext.app/voice-agent/config");
    expect((init as RequestInit).method).toBe("PATCH");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      booking_mode: "confirm",
    });
    expect(config.bookingMode).toBe("confirm");
  });

  const CALL = {
    id: 7,
    from_number: "+34600000000",
    status: "in_progress",
    started_at: "2026-10-29T10:00:00",
    ended_at: null,
    duration_seconds: null,
    disconnection_reason: null,
    summary: null,
    sentiment: null,
    successful: null,
    booking_mode: "request",
    booking_id: 3,
  };

  it("listCalls pasa los filtros al BFF y mapea las llamadas", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [CALL], total: 1 }), { status: 200 })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const page = await voiceAgentApi.listCalls(
      { limit: 10, offset: 20, status: "inProgress", booked: true },
      createApiClient({})
    );

    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/voice-agent/calls?limit=10&offset=20&status=in_progress&booked=true"
    );
    expect(page.total).toBe(1);
    expect(page.items[0]).toMatchObject({
      id: 7,
      fromNumber: "+34600000000",
      status: "inProgress",
      bookingMode: "request",
      bookingId: 3,
    });
  });

  it("getCall usa ?id= en el BFF y /{id} contra el backend", async () => {
    const detail = { ...CALL, status: "ended", transcript: "Agent: Hola", recording_url: null };
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify(detail), { status: 200 }))
      );
    global.fetch = fetchMock as unknown as typeof fetch;

    const call = await voiceAgentApi.getCall(7, createApiClient({}));
    await voiceAgentApi.getCall(
      7,
      createApiClient({ baseURL: "https://api.businext.app", apiPrefix: "" })
    );

    expect(fetchMock.mock.calls[0][0]).toBe("/api/voice-agent/calls?id=7");
    expect(fetchMock.mock.calls[1][0]).toBe("https://api.businext.app/voice-agent/calls/7");
    expect(call.transcript).toBe("Agent: Hola");
    expect(call.status).toBe("ended");
  });

  it("stats mapea los KPIs", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          days: 7,
          total_calls: 3,
          answered_calls: 2,
          rejected_calls: 1,
          bookings: 1,
          booking_rate: 0.5,
          total_minutes: 3,
          avg_duration_seconds: 90,
          positive_calls: 1,
          negative_calls: 0,
          daily: [{ date: "2026-10-29", calls: 2, bookings: 1 }],
        }),
        { status: 200 }
      )
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const stats = await voiceAgentApi.stats(7, createApiClient({}));

    expect(fetchMock.mock.calls[0][0]).toBe("/api/voice-agent/stats?days=7");
    expect(stats).toMatchObject({ totalCalls: 3, bookingRate: 0.5, avgDurationSeconds: 90 });
    expect(stats.daily).toEqual([{ date: "2026-10-29", calls: 2, bookings: 1 }]);
  });
});
