import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { financesApi } from "../../src/api/financesApi";
import { employeeApi } from "../../src/api/employeeApi";

describe("financesApi.listAnual (divergencia de ruta BFF vs backend, issue #028)", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("usa el sufijo 'anual' contra el BFF de web (apiPrefix por defecto)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const webClient = createApiClient({});
    await financesApi.listAnual(2026, webClient);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/finances/anual/2026",
      expect.anything()
    );
  });

  it("usa el sufijo 'annual_finances' contra el backend real (apiPrefix vacio, mobile)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const mobileClient = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
    });
    await financesApi.listAnual(2026, mobileClient);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.businext.app/finances/annual_finances/2026",
      expect.anything()
    );
  });
});

describe("employeeApi.list (divergencia de nombre BFF vs backend, issue #028)", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("usa /personal-management contra el BFF de web", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const webClient = createApiClient({});
    await employeeApi.list(webClient);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/personal-management",
      expect.anything()
    );
  });

  it("usa /employees contra el backend real (mobile)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const mobileClient = createApiClient({
      baseURL: "https://api.businext.app",
      apiPrefix: "",
    });
    await employeeApi.list(mobileClient);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.businext.app/employees",
      expect.anything()
    );
  });
});
