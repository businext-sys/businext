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
});
