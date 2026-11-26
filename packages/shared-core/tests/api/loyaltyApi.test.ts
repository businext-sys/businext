import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { LoyaltyError, loyaltyApi } from "../../src/api/loyaltyApi";
import { stampsLeft } from "../../src/loyalty";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

const CARD = {
  serial_number: "abc123",
  customer_name: "Ana",
  customer_email: "ana@example.com",
  stamps: 3,
  stamps_required: 10,
  reward: "Corte gratis",
  reward_ready: false,
  visits: [{ visit_date: "2026-11-20T10:00:00", service: "Corte", redeemed: false }],
  pass_url: "https://api.example.com/public/loyalty/passes/abc123.pkpass?token=t",
};

const PROGRAM = {
  enabled: true,
  stamps_required: 8,
  reward: "Barba gratis",
  background_color: null,
  foreground_color: "#F4F1EC",
  label_color: null,
  apple_wallet_available: true,
};

describe("loyaltyApi", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  const mockFetch = (...responses: Response[]) => {
    const fetchMock = vi.fn();
    responses.forEach((r) => fetchMock.mockResolvedValueOnce(r));
    global.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
  };

  it("getProgram mapea la regla a camelCase", async () => {
    const fetchMock = mockFetch(json(PROGRAM));
    const program = await loyaltyApi.getProgram(createApiClient({}));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/loyalty/program");
    expect(program).toEqual({
      enabled: true,
      stampsRequired: 8,
      reward: "Barba gratis",
      backgroundColor: null,
      foregroundColor: "#F4F1EC",
      labelColor: null,
      appleWalletAvailable: true,
    });
  });

  it("updateProgram envía la regla en snake_case con PUT", async () => {
    const fetchMock = mockFetch(json(PROGRAM));
    await loyaltyApi.updateProgram(
      {
        enabled: true,
        stampsRequired: 8,
        reward: "Barba gratis",
        backgroundColor: null,
        foregroundColor: "#F4F1EC",
        labelColor: null,
      },
      createApiClient({ apiPrefix: "" })
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/loyalty/program");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({
      enabled: true,
      stamps_required: 8,
      reward: "Barba gratis",
      background_color: null,
      foreground_color: "#F4F1EC",
      label_color: null,
    });
  });

  it("getCard busca por email y, si no hay, por nombre", async () => {
    const fetchMock = mockFetch(json(CARD), json(CARD));
    const card = await loyaltyApi.getCard({ email: "ana+1@example.com" }, createApiClient({}));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/loyalty/cards?email=ana%2B1%40example.com");
    expect(card?.serialNumber).toBe("abc123");
    expect(card?.visits[0]).toEqual({ visitDate: "2026-11-20T10:00:00", service: "Corte", redeemed: false });
    await loyaltyApi.getCard({ email: " ", name: "Ana López" }, createApiClient({}));
    expect(fetchMock.mock.calls[1][0]).toBe("/api/loyalty/cards?name=Ana%20L%C3%B3pez");
  });

  it("getCard devuelve null si el cliente no tiene tarjeta o no hay con qué buscar", async () => {
    const fetchMock = mockFetch(json({ detail: "Este cliente aún no tiene tarjeta" }, 404));
    expect(await loyaltyApi.getCard({ name: "Ana" }, createApiClient({}))).toBeNull();
    expect(await loyaltyApi.getCard({}, createApiClient({}))).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("redeem lanza LoyaltyError con el detail y el status del backend", async () => {
    mockFetch(json({ detail: "Aún no tiene sellos suficientes para el premio" }, 409));
    const error = await loyaltyApi.redeem("abc123", createApiClient({})).catch((e) => e);
    expect(error).toBeInstanceOf(LoyaltyError);
    expect(error.status).toBe(409);
    expect(error.message).toBe("Aún no tiene sellos suficientes para el premio");
  });

  it("redeem y createCard usan la misma ruta en web y en mobile", async () => {
    const fetchMock = mockFetch(json(CARD), json(CARD));
    await loyaltyApi.redeem("abc123", createApiClient({ apiPrefix: "" }));
    expect(fetchMock.mock.calls[0][0]).toBe("/loyalty/cards/abc123/redeem");
    await loyaltyApi.createCard(
      { customerName: "Ana", customerEmail: "ana@example.com" },
      createApiClient({})
    );
    const [url, init] = fetchMock.mock.calls[1];
    expect(url).toBe("/api/loyalty/cards");
    expect(JSON.parse(init.body)).toEqual({ customer_name: "Ana", customer_email: "ana@example.com" });
  });

  it("getPublicInfo lee la info pública del negocio", async () => {
    const fetchMock = mockFetch(
      json({ enabled: true, stamps_required: 10, reward: "Corte gratis", apple_wallet_available: false })
    );
    const info = await loyaltyApi.getPublicInfo("biz-1", createApiClient({}));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/public/loyalty/biz-1");
    expect(info).toEqual({ enabled: true, stampsRequired: 10, reward: "Corte gratis", appleWalletAvailable: false });
  });

  it("stampsLeft nunca baja de 0", () => {
    expect(stampsLeft({ stamps: 3, stampsRequired: 10 })).toBe(7);
    expect(stampsLeft({ stamps: 12, stampsRequired: 10 })).toBe(0);
  });
});
