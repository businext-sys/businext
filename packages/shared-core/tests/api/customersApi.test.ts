import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { customersApi } from "../../src/api/customersApi";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("customersApi.search", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("busca con el texto codificado y pasa a camelCase", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      json([
        { name: "Ana López", phone: "600111222", email: null, last_visit: "2026-11-10T10:00:00" },
        { name: "", phone: null, email: null, last_visit: "2026-11-01T10:00:00" },
      ])
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    const customers = await customersApi.search("ana l", 10, createApiClient({ apiPrefix: "" }));
    expect(fetchMock.mock.calls[0][0]).toBe("/customers/?q=ana%20l&limit=10");
    expect(customers).toEqual([
      { name: "Ana López", phone: "600111222", email: null, lastVisit: "2026-11-10T10:00:00" },
    ]);
  });

  it("devuelve una lista vacía si el endpoint aún no existe", async () => {
    global.fetch = vi.fn().mockResolvedValue(json({ detail: "Not Found" }, 404)) as unknown as typeof fetch;
    await expect(customersApi.search("ana", 10, createApiClient({ apiPrefix: "" }))).resolves.toEqual([]);
  });

  it("lanza con otros errores del backend", async () => {
    global.fetch = vi.fn().mockResolvedValue(json({}, 500)) as unknown as typeof fetch;
    await expect(customersApi.search("ana", 10, createApiClient({ apiPrefix: "" }))).rejects.toThrow("HTTP 500");
  });

  it("detail pide la ficha por nombre y la pasa a camelCase", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      json({
        name: "Ana López",
        phone: "600111222",
        email: "",
        visits: 4,
        no_shows: 1,
        total_spent: 60,
        last_visit: "2026-11-10T10:00:00",
        next_reservation: { id: 9, start: "2026-11-20T10:00:00", service: "Corte", in_charge: "Luis", status: "PENDING" },
        reservations: [{ id: 3, start: "2026-11-10T10:00:00", service: "Corte", in_charge: "Luis", status: "NO_SHOW" }],
      })
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    const detail = await customersApi.detail("Ana López", createApiClient({ apiPrefix: "" }));
    expect(fetchMock.mock.calls[0][0]).toBe("/customers/detail?name=Ana%20L%C3%B3pez");
    expect(detail).toMatchObject({ email: null, noShows: 1, totalSpent: 60 });
    expect(detail?.nextReservation).toEqual({
      id: 9,
      start: "2026-11-20T10:00:00",
      service: "Corte",
      inCharge: "Luis",
      status: "PENDING",
    });
    expect(detail?.reservations[0].status).toBe("NO_SHOW");
  });

  it("detail devuelve null con 404", async () => {
    global.fetch = vi.fn().mockResolvedValue(json({}, 404)) as unknown as typeof fetch;
    await expect(customersApi.detail("Nadie", createApiClient({ apiPrefix: "" }))).resolves.toBeNull();
  });
});
