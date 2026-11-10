import type { CustomerMessage, CustomerMessageDraft } from "../intelligence";

export const mapCustomerMessageDraftFromApi = (
  data: Record<string, unknown>
): CustomerMessageDraft => ({
  customerEmail: String(data.customer_email),
  customerName: String(data.customer_name),
  message: String(data.message),
});

export const mapCustomerMessageFromApi = (
  data: Record<string, unknown>
): CustomerMessage => ({
  id: Number(data.id),
  customerEmail: String(data.customer_email),
  message: String(data.message),
  sentBy: String(data.sent_by),
  createdAt: String(data.created_at),
});
