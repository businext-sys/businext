import { z } from "zod";

export const ChatRoleSchema = z.enum(["user", "assistant"]);

const blockBase = { fallback_text: z.string().optional() };

export const TextBlockSchema = z.object({
  ...blockBase,
  type: z.literal("text"),
  text: z.string(),
});

export const ReservationItemSchema = z.object({
  id: z.number(),
  client_name: z.string(),
  service: z.string(),
  start_time: z.string(),
  end_time: z.string().nullable(),
  employee_name: z.string().nullable(),
  status: z.string(),
});

export const ReservationListBlockSchema = z.object({
  ...blockBase,
  type: z.literal("reservation_list"),
  title: z.string().nullable(),
  reservations: z.array(ReservationItemSchema),
});

export const CashSummaryBlockSchema = z.object({
  ...blockBase,
  type: z.literal("cash_summary"),
  period_label: z.string(),
  total_income: z.number(),
  total_expense: z.number(),
  balance: z.number(),
  currency: z.string(),
});

export const BookingRequestItemSchema = z.object({
  id: z.number(),
  client_name: z.string(),
  service: z.string(),
  requested_date: z.string(),
  employee_name: z.string().nullable(),
  status: z.enum(["REQUESTED", "ACCEPTED", "REJECTED", "EXPIRED"]),
});

export const BookingRequestBlockSchema = z.object({
  ...blockBase,
  type: z.literal("booking_request"),
  request: BookingRequestItemSchema,
});

export const ConfirmationStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "expired",
]);

export const ConfirmationBlockSchema = z.object({
  ...blockBase,
  type: z.literal("confirmation"),
  action_id: z.string(),
  title: z.string(),
  description: z.string(),
  status: ConfirmationStatusSchema,
});

export const QuickReplySchema = z.object({
  label: z.string(),
  message: z.string(),
});

export const QuickRepliesBlockSchema = z.object({
  ...blockBase,
  type: z.literal("quick_replies"),
  options: z.array(QuickReplySchema),
});

export const ChatBlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  ReservationListBlockSchema,
  CashSummaryBlockSchema,
  BookingRequestBlockSchema,
  ConfirmationBlockSchema,
  QuickRepliesBlockSchema,
]);

export const ChatMessageSchema = z.object({
  id: z.string(),
  conversation_id: z.string(),
  role: ChatRoleSchema,
  blocks: z.array(ChatBlockSchema),
  created_at: z.string(),
});

export const MessageStartEventSchema = z.object({
  type: z.literal("message_start"),
  conversation_id: z.string(),
  message_id: z.string(),
});

export const TextDeltaEventSchema = z.object({
  type: z.literal("text_delta"),
  message_id: z.string(),
  delta: z.string(),
});

export const BlockEventSchema = z.object({
  type: z.literal("block"),
  message_id: z.string(),
  block: ChatBlockSchema,
});

export const MessageEndEventSchema = z.object({
  type: z.literal("message_end"),
  message_id: z.string(),
});

export const ErrorEventSchema = z.object({
  type: z.literal("error"),
  code: z.string(),
  message: z.string(),
});

export const ChatEventSchema = z.discriminatedUnion("type", [
  MessageStartEventSchema,
  TextDeltaEventSchema,
  BlockEventSchema,
  MessageEndEventSchema,
  ErrorEventSchema,
]);

export const ChatRequestSchema = z.object({
  conversation_id: z.string().nullable().optional(),
  message: z.string().min(1),
});

export const ConfirmActionRequestSchema = z.object({
  conversation_id: z.string(),
  decision: z.enum(["confirm", "cancel"]),
});

export const ConversationSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  last_message_preview: z.string().nullable(),
  updated_at: z.string(),
});

export const ConversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  messages: z.array(ChatMessageSchema),
  updated_at: z.string(),
});

export type ChatBlockParsed = z.infer<typeof ChatBlockSchema>;
export type ChatMessageParsed = z.infer<typeof ChatMessageSchema>;
export type ChatEventParsed = z.infer<typeof ChatEventSchema>;
export type ChatRequestParsed = z.infer<typeof ChatRequestSchema>;
export type ConfirmActionRequestParsed = z.infer<typeof ConfirmActionRequestSchema>;
export type ConversationSummaryParsed = z.infer<typeof ConversationSummarySchema>;
export type ConversationParsed = z.infer<typeof ConversationSchema>;
