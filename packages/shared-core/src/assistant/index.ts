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

const lenientBlocks = z.array(z.unknown()).transform((blocks) => blocks.map(parseChatBlock));

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
