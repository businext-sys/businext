import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { availabilityApi } from "../../src/api/availabilityApi";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const client = () => createApiClient({ apiPrefix: "" });

describe("availabilityApi.slots", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("pide los huecos con encargado y servicio y devuelve horas únicas ordenadas", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      json({
        date: "2026-11-18",
        slots: [
          { time: "10:15", employee_name: "Luis" },
          { time: "09:00:00", employee_name: "Luis" },
          { time: "10:15", employee_name: "Eva" },
        ],
      })
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    const slots = await availabilityApi.slots(
      { businessId: "b-1", date: "2026-11-18", employeeName: "Luis", service: "Corte pelo" },
      client()
    );
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/public/book/b-1/availability?date=2026-11-18&employee_name=Luis&service=Corte+pelo"
    );
    expect(slots).toEqual(["09:00", "10:15"]);
  });

  it("devuelve null si el backend falla, para calcular los huecos en local", async () => {
    global.fetch = vi.fn().mockResolvedValue(json({}, 404)) as unknown as typeof fetch;
    await expect(availabilityApi.slots({ businessId: "b-1", date: "2026-11-18" }, client())).resolves.toBeNull();
  });
});
