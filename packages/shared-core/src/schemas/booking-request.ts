import { z } from "zod";

export const BookingRequestStatusSchema = z.enum([
  "REQUESTED",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
]);

/** Schema de la forma "frontend" (camelCase) de un BookingRequest. */
export const BookingRequestSchema = z.object({
  id: z.number(),
  businessId: z.string(),
  clientName: z.string(),
  clientEmail: z.string(),
  clientPhone: z.string(),
  employeeName: z.string().nullable(),
  service: z.string(),
  requestedDate: z.string(),
  status: BookingRequestStatusSchema,
  expiresAt: z.string(),
  createdAt: z.string(),
});

export type BookingRequestParsed = z.infer<typeof BookingRequestSchema>;

/** Schema de la forma "backend" (snake_case) para crear un BookingRequest. */
export const BookingRequestCreateSchema = z.object({
  client_name: z.string(),
  client_email: z.string(),
  client_phone: z.string(),
  employee_name: z.string().nullable().optional(),
  service: z.string(),
  requested_date: z.string(),
  location_id: z.number().nullable().optional(),
});

export type BookingRequestCreateParsed = z.infer<typeof BookingRequestCreateSchema>;
