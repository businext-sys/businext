import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { notificationPreferencesApi } from "../../src/api/notificationPreferencesApi";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const apiBody = {
  upcoming: true,
  upcoming_minutes: 30,
  daily_summary: false,
  daily_summary_hour: 8,
  reservation_changes: true,
  day_close: false,
};
const prefs = {
  upcoming: true,
  upcomingMinutes: 30,
  dailySummary: false,
  dailySummaryHour: 8,
  reservationChanges: true,
  dayClose: false,
};

describe("notificationPreferencesApi", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("get pasa las preferencias a camelCase", async () => {
    global.fetch = vi.fn().mockResolvedValue(json(apiBody)) as unknown as typeof fetch;
    await expect(notificationPreferencesApi.get(createApiClient({ apiPrefix: "" }))).resolves.toEqual(prefs);
  });

  it("get devuelve null mientras el backend no tenga el endpoint", async () => {
    global.fetch = vi.fn().mockResolvedValue(json({}, 404)) as unknown as typeof fetch;
    await expect(notificationPreferencesApi.get(createApiClient({ apiPrefix: "" }))).resolves.toBeNull();
  });

  it("update envía snake_case con PUT", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(apiBody));
    global.fetch = fetchMock as unknown as typeof fetch;
    await notificationPreferencesApi.update(prefs, createApiClient({ apiPrefix: "" }));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/notification-preferences");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual(apiBody);
  });
});
