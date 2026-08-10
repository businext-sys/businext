import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { pushTokenApi } from "../../src/api/pushTokenApi";

describe("pushTokenApi (issue #031)", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("register hace POST a /users/{userId}/push-tokens con el token en el body", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({}), { status: 201 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
    });
    await pushTokenApi.register("user-1", "ExponentPushToken[abc]", client);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.businext.app/users/user-1/push-tokens");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      token: "ExponentPushToken[abc]",
    });
  });

  it("unregister hace DELETE con el token en el body (issue #031: delete() ahora acepta body)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
    });
    await pushTokenApi.unregister("user-1", "ExponentPushToken[abc]", client);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.businext.app/users/user-1/push-tokens");
    expect((init as RequestInit).method).toBe("DELETE");
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      token: "ExponentPushToken[abc]",
    });
  });
});
