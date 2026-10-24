import { describe, it, expect, vi, afterEach } from "vitest";
import { createApiClient } from "../../src/api/client";
import { AssistantHttpError, assistantApi, readChatEvents } from "../../src/api/assistantApi";

function sseResponse(chunks: string[], status = 200): Response {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
      controller.close();
    },
  });
  return new Response(body, { status, headers: { "Content-Type": "text/event-stream" } });
}

async function collect<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const items: T[] = [];
  for await (const item of iterable) items.push(item);
  return items;
}

const client = (fetchMock: ReturnType<typeof vi.fn>) =>
  createApiClient({
    baseURL: "https://api.businext.app",
    apiPrefix: "",
    getAuthToken: () => "jwt",
    fetch: fetchMock as unknown as typeof fetch,
  });

describe("readChatEvents", () => {
  it("parsea eventos aunque lleguen partidos entre chunks", async () => {
    const response = sseResponse([
      'data: {"type":"message_start","conversation_id":"c-1","message_id":"m-1"}\n\nda',
      'ta: {"type":"text_delta","message_id":"m-1","delta":"Ho"}\n',
      '\ndata: {"type":"text_delta","message_id":"m-1","delta":"la"}\n\n',
      'data: {"type":"message_end","message_id":"m-1"}\n\n',
    ]);
    const events = await collect(readChatEvents(response));
    expect(events.map((e) => e.type)).toEqual([
      "message_start",
      "text_delta",
      "text_delta",
      "message_end",
    ]);
  });

  it("acepta CRLF, ignora comentarios, eventos desconocidos y JSON roto", async () => {
    const response = sseResponse([
      ": keep-alive\r\n\r\n",
      'event: ping\r\ndata: {"type":"ping"}\r\n\r\n',
      "data: {roto\r\n\r\n",
      'data: {"type":"message_end","message_id":"m-1"}',
    ]);
    const events = await collect(readChatEvents(response));
    expect(events).toEqual([{ type: "message_end", message_id: "m-1" }]);
  });

  it("lee el texto completo si la respuesta no expone el body como stream", async () => {
    const response = {
      body: null,
      text: async () => 'data: {"type":"message_end","message_id":"m-1"}\n\n',
    } as unknown as Response;
    const events = await collect(readChatEvents(response));
    expect(events).toEqual([{ type: "message_end", message_id: "m-1" }]);
  });
});

describe("assistantApi", () => {
  afterEach(() => vi.restoreAllMocks());

  it("sendMessage hace POST a /assistant/chat con token y Accept SSE", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(sseResponse(['data: {"type":"message_end","message_id":"m-1"}\n\n']));
    const events = await collect(
      assistantApi.sendMessage({ message: "Hola" }, undefined, client(fetchMock))
    );

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.businext.app/assistant/chat");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer jwt",
      Accept: "text/event-stream",
    });
    expect(JSON.parse(init.body)).toEqual({ message: "Hola" });
    expect(events).toHaveLength(1);
  });

  it("confirmAction hace POST a /assistant/actions/{id}/confirm", async () => {
    const fetchMock = vi.fn().mockResolvedValue(sseResponse([]));
    await collect(
      assistantApi.confirmAction(
        "a-1",
        { conversation_id: "c-1", decision: "confirm" },
        undefined,
        client(fetchMock)
      )
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.businext.app/assistant/actions/a-1/confirm");
    expect(JSON.parse(init.body)).toEqual({ conversation_id: "c-1", decision: "confirm" });
  });

  it("lanza AssistantHttpError con el status si la respuesta no es ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("", { status: 429 }));
    await expect(
      collect(assistantApi.sendMessage({ message: "Hola" }, undefined, client(fetchMock)))
    ).rejects.toMatchObject({ status: 429 });
    await expect(
      collect(assistantApi.sendMessage({ message: "Hola" }, undefined, client(fetchMock)))
    ).rejects.toBeInstanceOf(AssistantHttpError);
  });

  it("lista, abre y borra conversaciones", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            { id: "c-1", title: "Agenda", last_message_preview: null, updated_at: "2026-10-22" },
          ])
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            id: "c-1",
            title: "Agenda",
            updated_at: "2026-10-22",
            messages: [
              {
                id: "m-1",
                conversation_id: "c-1",
                role: "assistant",
                blocks: [{ type: "desconocido" }],
                created_at: "2026-10-22",
              },
            ],
          })
        )
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    const c = client(fetchMock);

    expect(await assistantApi.listConversations(c)).toHaveLength(1);
    const conversation = await assistantApi.getConversation("c-1", c);
    expect(conversation.messages[0].blocks[0].type).toBe("text");
    await assistantApi.deleteConversation("c-1", c);

    expect(fetchMock.mock.calls.map(([url, init]) => [url, init?.method ?? "GET"])).toEqual([
      ["https://api.businext.app/assistant/conversations", "GET"],
      ["https://api.businext.app/assistant/conversations/c-1", "GET"],
      ["https://api.businext.app/assistant/conversations/c-1", "DELETE"],
    ]);
  });
});
