import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { configurationApi } from "../../src/api/configurationApi";

describe("configurationApi.getReminders / updateReminders", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("getReminders usa el BFF en web (/api/configuration/reminders)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ reminders_enabled: true }), { status: 200 })
      );
    global.fetch = fetchMock as unknown as typeof fetch;

    const setting = await configurationApi.getReminders(createApiClient({}));

    expect(fetchMock.mock.calls[0][0]).toBe("/api/configuration/reminders");
    expect(setting).toEqual({ remindersEnabled: true });
  });

  it("updateReminders hace PUT al backend directo con el body en snake_case", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ reminders_enabled: false }), { status: 200 })
      );
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
    });
    const setting = await configurationApi.updateReminders(
      { remindersEnabled: false },
      client
    );

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.businext.app/configuration/reminders");
    expect((init as RequestInit).method).toBe("PUT");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      reminders_enabled: false,
    });
    expect(setting).toEqual({ remindersEnabled: false });
  });

  it("lanza si la respuesta no trae reminders_enabled", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({}), { status: 200 })
      ) as unknown as typeof fetch;

    await expect(
      configurationApi.getReminders(createApiClient({}))
    ).rejects.toThrow();
  });
});
