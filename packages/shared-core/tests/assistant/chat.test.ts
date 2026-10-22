import { describe, it, expect, vi } from "vitest";
import type { ChatEvent } from "../../src/assistant";
import {
  ASSISTANT_ERROR_TEXT,
  createAssistantChat,
  type AssistantChatTransport,
} from "../../src/assistant/chat";

const reply: ChatEvent[] = [
  { type: "message_start", conversation_id: "c-1", message_id: "m-1" },
  { type: "text_delta", message_id: "m-1", delta: "Tienes " },
  { type: "text_delta", message_id: "m-1", delta: "2 reservas" },
  {
    type: "block",
    message_id: "m-1",
    block: {
      type: "confirmation",
      action_id: "a-1",
      title: "Cancelar",
      description: "Cancelar la reserva de las 10:00",
      status: "pending",
    },
  },
  { type: "message_end", message_id: "m-1" },
];

async function* stream(events: ChatEvent[], signal?: AbortSignal) {
  for (const event of events) {
    await Promise.resolve();
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    yield event;
  }
}

function transport(overrides: Partial<AssistantChatTransport> = {}): AssistantChatTransport {
  return {
    sendMessage: vi.fn((_request, signal) => stream(reply, signal)),
    confirmAction: vi.fn((_id, _request, signal) => stream([], signal)),
    ...overrides,
  };
}

describe("createAssistantChat", () => {
  it("añade el mensaje del usuario y construye la respuesta desde el stream", async () => {
    const t = transport();
    const chat = createAssistantChat({ transport: t });
    const statuses: string[] = [];
    chat.subscribe(() => statuses.push(chat.getState().status));

    await chat.send("  ¿Qué tengo hoy?  ");

    const state = chat.getState();
    expect(t.sendMessage).toHaveBeenCalledWith(
      { conversation_id: null, message: "¿Qué tengo hoy?" },
      expect.any(AbortSignal)
    );
    expect(state.status).toBe("idle");
    expect(state.conversationId).toBe("c-1");
    expect(state.messages.map((m) => m.role)).toEqual(["user", "assistant"]);
    expect(state.messages[1].blocks).toEqual([
      { type: "text", text: "Tienes 2 reservas" },
      expect.objectContaining({ type: "confirmation", action_id: "a-1" }),
    ]);
    expect(statuses).toContain("streaming");
  });

  it("muestra el texto mientras llega, sin esperar al final del stream", async () => {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => (release = resolve));
    const chat = createAssistantChat({
      transport: transport({
        sendMessage: async function* () {
          yield reply[0];
          yield reply[1];
          await gate;
          yield reply[4];
        },
      }),
    });

    const pending = chat.send("Hola");
    await vi.waitFor(() => expect(chat.getState().messages[1]?.blocks).toHaveLength(1));
    expect(chat.getState().status).toBe("streaming");
    release();
    await pending;
    expect(chat.getState().status).toBe("idle");
  });

  it("ignora mensajes vacios y envios mientras hay un stream en curso", async () => {
    const t = transport();
    const chat = createAssistantChat({ transport: t });
    await chat.send("   ");
    const first = chat.send("uno");
    await chat.send("dos");
    await first;
    expect(t.sendMessage).toHaveBeenCalledTimes(1);
  });

  it("envia el conversation_id en los mensajes siguientes", async () => {
    const t = transport();
    const chat = createAssistantChat({ transport: t });
    await chat.send("uno");
    await chat.send("dos");
    expect(t.sendMessage).toHaveBeenLastCalledWith(
      { conversation_id: "c-1", message: "dos" },
      expect.any(AbortSignal)
    );
  });

  it("pasa a error con el mensaje de un evento error", async () => {
    const chat = createAssistantChat({
      transport: transport({
        sendMessage: () => stream([{ type: "error", code: "limit", message: "Límite alcanzado" }]),
      }),
    });
    await chat.send("Hola");
    expect(chat.getState()).toMatchObject({ status: "error", error: "Límite alcanzado" });
  });

  it("reintenta si falla antes de recibir eventos y luego responde", async () => {
    const sendMessage = vi
      .fn()
      .mockImplementationOnce(() => {
        throw Object.assign(new Error("HTTP 503"), { status: 503 });
      })
      .mockImplementation((_request, signal) => stream(reply, signal));
    const chat = createAssistantChat({ transport: transport({ sendMessage }), retryDelayMs: 1 });
    await chat.send("Hola");
    expect(sendMessage).toHaveBeenCalledTimes(2);
    expect(chat.getState().status).toBe("idle");
  });

  it("no reintenta un error 4xx", async () => {
    const sendMessage = vi.fn(() => {
      throw Object.assign(new Error("HTTP 403"), { status: 403 });
    });
    const chat = createAssistantChat({ transport: transport({ sendMessage }), retryDelayMs: 1 });
    await chat.send("Hola");
    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(chat.getState()).toMatchObject({ status: "error", error: ASSISTANT_ERROR_TEXT });
  });

  it("retry descarta la respuesta parcial y repite la peticion", async () => {
    const sendMessage = vi
      .fn()
      .mockImplementationOnce(async function* () {
        yield reply[0];
        yield reply[1];
        throw new Error("conexion cortada");
      })
      .mockImplementation((_request, signal) => stream(reply, signal));
    const chat = createAssistantChat({ transport: transport({ sendMessage }), retryDelayMs: 1 });

    await chat.send("Hola");
    expect(chat.getState().status).toBe("error");
    expect(sendMessage).toHaveBeenCalledTimes(1);

    await chat.retry();
    const state = chat.getState();
    expect(state.status).toBe("idle");
    expect(state.messages.map((m) => m.role)).toEqual(["user", "assistant"]);
    expect(state.messages[1].blocks[0]).toEqual({ type: "text", text: "Tienes 2 reservas" });
  });

  it("stop cancela el stream y deja el estado en idle", async () => {
    let signal: AbortSignal | undefined;
    const chat = createAssistantChat({
      transport: transport({
        sendMessage: async function* (_request, s) {
          signal = s;
          yield reply[0];
          await new Promise((resolve) => s.addEventListener("abort", resolve));
          throw new DOMException("Aborted", "AbortError");
        },
      }),
    });

    const pending = chat.send("Hola");
    await vi.waitFor(() => expect(chat.getState().messages).toHaveLength(2));
    chat.stop();
    await pending;
    expect(signal?.aborted).toBe(true);
    expect(chat.getState()).toMatchObject({ status: "idle", error: null });
  });

  it("confirm marca la accion y envia la decision al backend", async () => {
    const t = transport();
    const chat = createAssistantChat({ transport: t });
    await chat.send("Cancela la de las 10");
    await chat.confirm("a-1", "confirm");

    expect(t.confirmAction).toHaveBeenCalledWith(
      "a-1",
      { conversation_id: "c-1", decision: "confirm" },
      expect.any(AbortSignal)
    );
    expect(chat.getState().messages[1].blocks[1]).toMatchObject({ status: "confirmed" });
  });

  it("confirm no hace nada sin conversacion", async () => {
    const t = transport();
    const chat = createAssistantChat({ transport: t });
    await chat.confirm("a-1", "cancel");
    expect(t.confirmAction).not.toHaveBeenCalled();
  });
});
