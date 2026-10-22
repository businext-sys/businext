import { describe, it, expect } from "vitest";
import { ChatMessageSchema } from "../../src/schemas/assistant";
import { bookingRequestContextMessage } from "../../src/assistant/notificationContext";
import type { BookingRequest } from "../../src/booking-request";

const request: BookingRequest = {
  id: 42,
  businessId: "biz-1",
  clientName: "Ana",
  clientEmail: "ana@example.com",
  clientPhone: "+34600000000",
  employeeName: "Marta",
  service: "Corte",
  requestedDate: "2026-10-23T10:30:00",
  status: "REQUESTED",
  expiresAt: "2026-10-22T12:00:00",
  createdAt: "2026-10-22T09:00:00",
};

describe("bookingRequestContextMessage", () => {
  it("crea un mensaje del asistente valido con el texto y la tarjeta de la solicitud", () => {
    const message = bookingRequestContextMessage(request);
    expect(() => ChatMessageSchema.parse(message)).not.toThrow();
    expect(message.role).toBe("assistant");
    expect(message.blocks[0]).toEqual({
      type: "text",
      text: "Tienes una nueva solicitud de reserva de **Ana**: Corte con Marta, el 23/10 a las 10:30. ¿La aceptas?",
    });
    expect(message.blocks[1]).toEqual({
      type: "booking_request",
      request: {
        id: 42,
        client_name: "Ana",
        service: "Corte",
        requested_date: "2026-10-23T10:30:00",
        employee_name: "Marta",
        status: "REQUESTED",
      },
    });
  });

  it("omite el profesional si no hay", () => {
    const message = bookingRequestContextMessage({ ...request, employeeName: null });
    expect(message.blocks[0]).toMatchObject({ text: expect.stringContaining("**Ana**: Corte, el") });
  });
});
