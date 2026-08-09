import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient, configureApiClient, apiClient } from "../../src/api/client";

describe("createApiClient", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("antepone baseURL + apiPrefix por defecto (/api, comportamiento web) a las rutas", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({});
    await client.get("/auth/me");

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/me", expect.anything());
  });

  it("permite apiPrefix vacio para hablar directo con el backend (issue #028, mobile)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
    });
    await client.get("/auth/me");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.businext.app/auth/me",
      expect.anything()
    );
  });

  it("expone el apiPrefix activo en el cliente (para casos donde el nombre de ruta diverge, ver financesApi.listAnual)", () => {
    const webClient = createApiClient({});
    const mobileClient = createApiClient({ apiPrefix: "" });
    expect(webClient.apiPrefix).toBe("/api");
    expect(mobileClient.apiPrefix).toBe("");
  });

  it("incluye el header Authorization en GET cuando hay getAuthToken (bug corregido, issue #028)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
      getAuthToken: () => "mi-jwt-de-prueba",
    });
    await client.get("/auth/me");

    const [, init] = fetchMock.mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: "Bearer mi-jwt-de-prueba",
    });
  });

  it("incluye el header Authorization tambien en mutaciones (post/patch/delete)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
      getAuthToken: () => "mi-jwt-de-prueba",
    });
    await client.post("/reservations", { foo: "bar" });

    const [, init] = fetchMock.mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: "Bearer mi-jwt-de-prueba",
    });
  });

  it("no envia header Authorization si no hay getAuthToken configurado (comportamiento web)", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const client = createApiClient({});
    await client.get("/auth/me");

    const [, init] = fetchMock.mock.calls[0];
    expect((init as RequestInit).headers).toEqual({});
  });
});

describe("configureApiClient", () => {
  afterEach(() => {
    // Restaura la instancia compartida a su configuracion por defecto
    // para no filtrar estado entre tests.
    configureApiClient({});
  });

  it("reemplaza la instancia compartida `apiClient`", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    configureApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
      getAuthToken: () => "token-mobile",
    });

    await apiClient.get("/auth/me");

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.businext.app/auth/me",
      expect.anything()
    );
  });
});
