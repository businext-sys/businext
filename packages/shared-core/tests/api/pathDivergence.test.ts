import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { financesApi } from "../../src/api/financesApi";
import { employeeApi } from "../../src/api/employeeApi";
import { reservationApi } from "../../src/api/reservationApi";
import { productApi } from "../../src/api/productApi";
import { locationApi } from "../../src/api/locationApi";
import { googleReviewsApi } from "../../src/api/googleReviewsApi";

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

describe("rutas por id (BFF con ?id=, backend con /{id})", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const mockFetch = (body: unknown = {}) => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(body), { status: 200 }));
    global.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
  };

  const webClient = () => createApiClient({});
  const mobileClient = () =>
    createApiClient({ baseURL: "https://api.businext.app", apiPrefix: "" });

  it("reservationApi.remove usa ?id= contra el BFF de web", async () => {
    const fetchMock = mockFetch();
    await reservationApi.remove(5, webClient());
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/reservations?id=5",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("reservationApi.remove usa /reservations/{id} contra el backend real (mobile)", async () => {
    const fetchMock = mockFetch();
    await reservationApi.remove(5, mobileClient());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.businext.app/reservations/5",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("productApi.remove usa /products/{id} contra el backend real (mobile)", async () => {
    const fetchMock = mockFetch();
    await productApi.remove(7, mobileClient());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.businext.app/products/7",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("locationApi.remove usa /locations/{id} contra el backend real (mobile)", async () => {
    const fetchMock = mockFetch();
    await locationApi.remove(3, mobileClient());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.businext.app/locations/3",
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("googleReviewsApi.generateResponse usa /reviews/{id}/generate-response contra el backend real", async () => {
    const fetchMock = mockFetch({ ai_generated_response: "ok" });
    await googleReviewsApi.generateResponse(9, mobileClient());
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.businext.app/google-reviews/reviews/9/generate-response",
      expect.objectContaining({ method: "POST" })
    );
  });
});
