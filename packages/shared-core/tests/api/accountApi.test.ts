import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { accountApi } from "../../src/api/accountApi";

describe("accountApi", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const client = () =>
    createApiClient({ baseURL: "https://api.businext.app", apiPrefix: "" });

  it("deleteMe hace DELETE a /users/me", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    await accountApi.deleteMe(client());

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.businext.app/users/me");
    expect((init as RequestInit).method).toBe("DELETE");
  });

  it("deleteMe falla si el backend no borra la cuenta", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(new Response("{}", { status: 502 })) as unknown as typeof fetch;

    await expect(accountApi.deleteMe(client())).rejects.toThrow();
  });
});
