import { describe, it, expect } from "vitest";
import {
  ChatBlockSchema,
  ChatEventSchema,
  ChatRequestSchema,
  ConfirmActionRequestSchema,
  ConversationSummarySchema,
} from "../../src/schemas/assistant";
import {
  UNSUPPORTED_BLOCK_TEXT,
  parseChatBlock,
  parseChatEvent,
  parseChatMessage,
  parseConversation,
} from "../../src/assistant";

const reservationList = {
  type: "reservation_list",
  title: "Reservas de hoy",
  reservations: [
    {
      id: 1,
      client_name: "Ana",
      service: "Corte",
      start_time: "2026-10-22T10:00:00Z",
      end_time: "2026-10-22T10:30:00Z",
      employee_name: null,
      status: "Pendiente",
    },
  ],
};

const message = {
  id: "m-1",
  conversation_id: "c-1",
  role: "assistant",
  blocks: [{ type: "text", text: "Hola" }, reservationList],
  created_at: "2026-10-22T09:00:00Z",
};

describe("ChatBlockSchema", () => {
  it.each([
    { type: "text", text: "Hola" },
    reservationList,
    {
      type: "cash_summary",
      period_label: "Hoy",
      total_income: 120,
      total_expense: 20,
      balance: 100,
      currency: "EUR",
    },
    {
      type: "booking_request",
      request: {
        id: 7,
        client_name: "Luis",
        service: "Barba",
        requested_date: "2026-10-23T11:00:00Z",
        employee_name: "Marta",
        status: "REQUESTED",
      },
    },
    {
      type: "confirmation",
      action_id: "a-1",
      title: "Cancelar reserva",
      description: "Se cancelará la reserva de Ana a las 10:00",
      status: "pending",
    },
    {
      type: "quick_replies",
      options: [{ label: "Agenda de hoy", message: "¿Qué tengo hoy?" }],
    },
  ])("parsea un bloque $type valido", (block) => {
    expect(ChatBlockSchema.parse(block).type).toBe(block.type);
  });

  it("cash_summary admite previous_balance opcional o nulo", () => {
    const base = {
      type: "cash_summary",
      period_label: "Esta semana",
      total_income: 500,
      total_expense: 100,
      balance: 400,
      currency: "EUR",
    };
    expect(() => ChatBlockSchema.parse({ ...base, previous_balance: 350 })).not.toThrow();
    expect(() => ChatBlockSchema.parse({ ...base, previous_balance: null })).not.toThrow();
    expect(() => ChatBlockSchema.parse({ ...base, previous_balance: "350" })).toThrow();
  });

  it("rechaza un bloque con campos que faltan", () => {
    expect(() => ChatBlockSchema.parse({ type: "cash_summary", balance: 1 })).toThrow();
  });

  it("rechaza un estado de confirmacion fuera del enum", () => {
    expect(() =>
      ChatBlockSchema.parse({
        type: "confirmation",
        action_id: "a-1",
        title: "x",
        description: "y",
        status: "done",
      })
    ).toThrow();
  });
});

describe("parseChatBlock", () => {
  it("devuelve el bloque tal cual si es valido", () => {
    expect(parseChatBlock(reservationList)).toEqual(reservationList);
  });

  it("degrada un tipo desconocido a texto usando fallback_text", () => {
    expect(parseChatBlock({ type: "chart", data: [1, 2], fallback_text: "Ingresos al alza" })).toEqual({
      type: "text",
      text: "Ingresos al alza",
    });
  });

  it("degrada un bloque mal formado sin fallback_text al texto generico", () => {
    expect(parseChatBlock({ type: "cash_summary" })).toEqual({
      type: "text",
      text: UNSUPPORTED_BLOCK_TEXT,
    });
  });

  it("no rompe con valores que no son objetos", () => {
    expect(parseChatBlock(null).type).toBe("text");
    expect(parseChatBlock("hola").type).toBe("text");
  });
});

describe("parseChatMessage", () => {
  it("parsea un mensaje valido", () => {
    expect(parseChatMessage(message).blocks).toHaveLength(2);
  });

  it("conserva el mensaje y degrada solo el bloque desconocido", () => {
    const parsed = parseChatMessage({
      ...message,
      blocks: [...message.blocks, { type: "video", url: "x" }],
    });
    expect(parsed.blocks.map((b) => b.type)).toEqual(["text", "reservation_list", "text"]);
  });

  it("rechaza un mensaje sin campos requeridos", () => {
    expect(() => parseChatMessage({ id: "m-1" })).toThrow();
  });

  it("rechaza un rol desconocido", () => {
    expect(() => parseChatMessage({ ...message, role: "system" })).toThrow();
  });
});

describe("parseConversation", () => {
  it("parsea una conversacion degradando bloques desconocidos", () => {
    const conversation = parseConversation({
      id: "c-1",
      title: "Agenda",
      updated_at: "2026-10-22T09:00:00Z",
      messages: [{ ...message, blocks: [{ type: "map" }] }],
    });
    expect(conversation.messages[0].blocks[0]).toEqual({
      type: "text",
      text: UNSUPPORTED_BLOCK_TEXT,
    });
  });
});

describe("ChatEventSchema / parseChatEvent", () => {
  it.each([
    { type: "message_start", conversation_id: "c-1", message_id: "m-1" },
    { type: "text_delta", message_id: "m-1", delta: "Ho" },
    { type: "block", message_id: "m-1", block: reservationList },
    { type: "tool_status", message_id: "m-1", label: "Consultando reservas…" },
    { type: "tool_status", message_id: "m-1", label: null },
    { type: "message_end", message_id: "m-1" },
    { type: "error", code: "rate_limited", message: "Demasiadas peticiones" },
  ])("parsea el evento $type", (event) => {
    expect(ChatEventSchema.parse(event)).toEqual(event);
    expect(parseChatEvent(event)).toEqual(event);
  });

  it("degrada el bloque de un evento block desconocido", () => {
    expect(parseChatEvent({ type: "block", message_id: "m-1", block: { type: "x" } })).toEqual({
      type: "block",
      message_id: "m-1",
      block: { type: "text", text: UNSUPPORTED_BLOCK_TEXT },
    });
  });

  it("ignora eventos desconocidos o invalidos", () => {
    expect(parseChatEvent({ type: "ping" })).toBeNull();
    expect(parseChatEvent({ type: "text_delta" })).toBeNull();
    expect(parseChatEvent({ type: "block" })).toBeNull();
    expect(parseChatEvent(null)).toBeNull();
  });
});

describe("peticiones", () => {
  it("ChatRequestSchema acepta un mensaje sin conversacion y rechaza uno vacio", () => {
    expect(() => ChatRequestSchema.parse({ message: "Hola" })).not.toThrow();
    expect(() => ChatRequestSchema.parse({ message: "" })).toThrow();
  });

  it("ConfirmActionRequestSchema solo acepta confirm o cancel", () => {
    expect(() =>
      ConfirmActionRequestSchema.parse({ conversation_id: "c-1", decision: "confirm" })
    ).not.toThrow();
    expect(() =>
      ConfirmActionRequestSchema.parse({ conversation_id: "c-1", decision: "maybe" })
    ).toThrow();
  });

  it("ConversationSummarySchema admite preview nulo", () => {
    expect(() =>
      ConversationSummarySchema.parse({
        id: "c-1",
        title: "Agenda",
        last_message_preview: null,
        updated_at: "2026-10-22T09:00:00Z",
      })
    ).not.toThrow();
  });
});
