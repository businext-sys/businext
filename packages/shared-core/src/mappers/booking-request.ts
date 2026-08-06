import type { BookingRequest } from "../booking-request";
import { BookingRequestSchema } from "../schemas/booking-request";

export const mapBookingRequestFromApi = (
  raw: Record<string, unknown>
): BookingRequest => {
  const parsed = BookingRequestSchema.parse({
    id: raw.id,
    businessId: raw.business_id,
    clientName: raw.client_name,
    clientEmail: raw.client_email,
    clientPhone: raw.client_phone,
    employeeName: (raw.employee_name as string) || null,
    service: raw.service,
    requestedDate: raw.requested_date,
    status: raw.status,
    expiresAt: raw.expires_at,
    createdAt: raw.created_at,
  });
  return parsed;
};

export const mapBookingRequestToApi = (bookingRequest: BookingRequest) => ({
  id: bookingRequest.id,
  business_id: bookingRequest.businessId,
  client_name: bookingRequest.clientName,
  client_email: bookingRequest.clientEmail,
  client_phone: bookingRequest.clientPhone,
  employee_name: bookingRequest.employeeName,
  service: bookingRequest.service,
  requested_date: bookingRequest.requestedDate,
  status: bookingRequest.status,
  expires_at: bookingRequest.expiresAt,
  created_at: bookingRequest.createdAt,
});
