import { z } from "zod";
import {
  ChatBlockSchema,
  ChatEventSchema,
  ChatMessageSchema,
  ConversationSchema,
  type ChatBlockParsed,
  type ChatEventParsed,
  type ChatMessageParsed,
  type ChatRequestParsed,
  type ConfirmActionRequestParsed,
  type ConversationParsed,
  type ConversationSummaryParsed,
} from "../schemas/assistant";

export type ChatBlock = ChatBlockParsed;
export type ChatBlockType = ChatBlock["type"];
export type ChatMessage = ChatMessageParsed;
export type ChatRole = ChatMessage["role"];
export type ChatEvent = ChatEventParsed;
export type ChatRequest = ChatRequestParsed;
export type ConfirmActionRequest = ConfirmActionRequestParsed;
export type ConversationSummary = ConversationSummaryParsed;
export type Conversation = ConversationParsed;

export type TextBlock = Extract<ChatBlock, { type: "text" }>;
export type ReservationListBlock = Extract<ChatBlock, { type: "reservation_list" }>;
export type CashSummaryBlock = Extract<ChatBlock, { type: "cash_summary" }>;
export type BookingRequestBlock = Extract<ChatBlock, { type: "booking_request" }>;
export type ConfirmationBlock = Extract<ChatBlock, { type: "confirmation" }>;
export type QuickRepliesBlock = Extract<ChatBlock, { type: "quick_replies" }>;

export const UNSUPPORTED_BLOCK_TEXT =
  "Este contenido no se puede mostrar en esta versión de la app.";

export function parseChatBlock(raw: unknown): ChatBlock {
  const parsed = ChatBlockSchema.safeParse(raw);
  if (parsed.success) return parsed.data;

  const fallback = (raw as { fallback_text?: unknown } | null)?.fallback_text;
  return {
    type: "text",
    text: typeof fallback === "string" && fallback ? fallback : UNSUPPORTED_BLOCK_TEXT,
  };
}

const INTERNAL_CARD_MARKER = "[tarjeta";

function matchingBrace(text: string, open: number): number {
  let depth = 0;
  let inString = false;
  for (let i = open; i < text.length; i++) {
    const char = text[i];
    if (inString) {
      if (char === "\\") i++;
      else if (char === '"') inString = false;
    } else if (char === '"') inString = true;
    else if (char === "{") depth++;
    else if (char === "}" && --depth === 0) return i;
  }
  return -1;
}

/**
 * El historial del backend guarda las tarjetas como texto
 * `[tarjeta mostrada al usuario: {...}]`. Las convierte de vuelta en tarjetas
 * y nunca deja ver el JSON (si no se puede leer, se quita).
 */
export function expandInternalCards(text: string): ChatBlock[] {
  const blocks: ChatBlock[] = [];
  const pushText = (part: string) => {
    if (part.trim()) blocks.push({ type: "text", text: part.trim() });
  };
  let cursor = 0;
  while (cursor < text.length) {
    const start = text.indexOf(INTERNAL_CARD_MARKER, cursor);
    if (start === -1) {
      pushText(text.slice(cursor));
      break;
    }
    pushText(text.slice(cursor, start));
    const open = text.indexOf("{", start);
    const close = open === -1 ? -1 : matchingBrace(text, open);
    if (close === -1) break;
    try {
      const card = ChatBlockSchema.safeParse(JSON.parse(text.slice(open, close + 1)));
      if (card.success && card.data.type !== "text") blocks.push(card.data);
    } catch {
      // JSON ilegible: se descarta la tarjeta.
    }
    const end = text.indexOf("]", close);
    cursor = end === -1 ? close + 1 : end + 1;
  }
  return blocks;
}

/** Sustituye en cada bloque de texto las tarjetas internas por tarjetas de verdad. */
export function expandTextBlocks(blocks: ChatBlock[]): ChatBlock[] {
  return blocks.flatMap((block) =>
    block.type === "text" && block.text.includes(INTERNAL_CARD_MARKER)
      ? expandInternalCards(block.text)
      : [block]
  );
}

/** Vista previa legible de una conversación: sin tarjetas internas, o `null`. */
export function readablePreview(preview: string | null): string | null {
  if (!preview) return null;
  const text = expandInternalCards(preview)
    .map((block) => (block.type === "text" ? block.text : ""))
    .join(" ")
    .trim();
  return text || null;
}

const lenientBlocks = z
  .array(z.unknown())
  .transform((blocks) => expandTextBlocks(blocks.map(parseChatBlock)));

const LenientChatMessageSchema = ChatMessageSchema.extend({ blocks: lenientBlocks });

export function parseChatMessage(raw: unknown): ChatMessage {
  return LenientChatMessageSchema.parse(raw);
}

export function parseConversation(raw: unknown): Conversation {
  return ConversationSchema.extend({
    messages: z.array(LenientChatMessageSchema),
  }).parse(raw);
}

export function parseChatEvent(raw: unknown): ChatEvent | null {
  const type = (raw as { type?: unknown } | null)?.type;
  if (type === "block") {
    const event = raw as { message_id?: unknown; block?: unknown };
    if (typeof event.message_id !== "string") return null;
    return { type: "block", message_id: event.message_id, block: parseChatBlock(event.block) };
  }
  const parsed = ChatEventSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

export * from "./chat";
export * from "./quickActions";
export * from "./notificationContext";
