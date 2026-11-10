import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { customerMessageApi } from "../../src/api/customerMessageApi";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe("customerMessageApi (#186)", () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("getDraft pide el texto propuesto con el email codificado", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      json({ customer_email: "ana+1@example.com", customer_name: "Ana", message: "Hola Ana" })
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    const draft = await customerMessageApi.getDraft("ana+1@example.com", createApiClient({}));
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/customer-messages/draft?email=ana%2B1%40example.com"
    );
    expect(draft).toEqual({
      customerEmail: "ana+1@example.com",
      customerName: "Ana",
      message: "Hola Ana",
    });
  });

  it("send envía el texto en snake_case contra el backend directo", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      json(
        {
          id: 1,
          customer_email: "ana@example.com",
          message: "Hola",
          sent_by: "u1",
          created_at: "2026-11-10T10:00:00",
        },
        201
      )
    );
    global.fetch = fetchMock as unknown as typeof fetch;
    const sent = await customerMessageApi.send(
      "ana@example.com",
      "Hola",
      createApiClient({ apiPrefix: "" })
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/customer-messages");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({ customer_email: "ana@example.com", message: "Hola" });
    expect(sent.sentBy).toBe("u1");
  });

  it("send lanza el detail y el status del backend", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue(
        json({ detail: "Ya se escribió a este cliente en los últimos 7 días" }, 429)
      ) as unknown as typeof fetch;
    await expect(
      customerMessageApi.send("ana@example.com", "Hola", createApiClient({}))
    ).rejects.toMatchObject({
      status: 429,
      message: "Ya se escribió a este cliente en los últimos 7 días",
    });
  });
});
