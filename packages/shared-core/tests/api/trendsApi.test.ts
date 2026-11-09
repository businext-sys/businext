import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { trendsApi } from "../../src/api/trendsApi";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

const SUGGESTION = {
  id: 13,
  network: "tiktok",
  format: "reel",
  idea: "Idea",
  script: [],
  caption_hint: "Texto",
  audio_hint: null,
  publish_at: "2026-11-09T15:00:00Z",
  source_trend_ids: [],
  status: "dismissed",
  sent_at: null,
};

describe("trendsApi (#169)", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("getInsight devuelve null si aun no hay analisis (404)", async () => {
    global.fetch = vi.fn().mockResolvedValue(json({ detail: "x" }, 404)) as unknown as typeof fetch;
    expect(await trendsApi.getInsight(createApiClient({}))).toBeNull();
  });

  it("refreshInsight lanza el detail del backend", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(json({ detail: "Ya has actualizado el análisis hoy." }, 429)) as unknown as typeof fetch;
    await expect(trendsApi.refreshInsight(createApiClient({}))).rejects.toThrow(
      "Ya has actualizado el análisis hoy."
    );
  });

  it("listSuggestions filtra por estado en el BFF", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json([SUGGESTION]));
    global.fetch = fetchMock as unknown as typeof fetch;
    const suggestions = await trendsApi.listSuggestions("sent", createApiClient({}));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/trends/suggestions?status=sent");
    expect(suggestions[0].captionHint).toBe("Texto");
  });

  it("updateSuggestion hace PATCH al backend directo con el estado", async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(SUGGESTION));
    global.fetch = fetchMock as unknown as typeof fetch;
    const client = createApiClient({ baseURL: "https://api.businext.app", apiPrefix: "" });
    const suggestion = await trendsApi.updateSuggestion(13, "dismissed", client);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.businext.app/trends/suggestions/13");
    expect((init as RequestInit).method).toBe("PATCH");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ status: "dismissed" });
    expect(suggestion.status).toBe("dismissed");
  });
});
