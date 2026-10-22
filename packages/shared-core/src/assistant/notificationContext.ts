import type { BookingRequest } from "../booking-request";
import type { ChatMessage } from "./index";

const pad = (n: number) => String(n).padStart(2, "0");

export function bookingRequestContextMessage(request: BookingRequest): ChatMessage {
  const date = new Date(request.requestedDate);
  const when = `el ${pad(date.getDate())}/${pad(date.getMonth() + 1)} a las ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  const withEmployee = request.employeeName ? ` con ${request.employeeName}` : "";

  return {
    id: `booking-request-${request.id}`,
    conversation_id: "",
    role: "assistant",
    created_at: new Date().toISOString(),
    blocks: [
      {
        type: "text",
        text: `Tienes una nueva solicitud de reserva de **${request.clientName}**: ${request.service}${withEmployee}, ${when}. ¿La aceptas?`,
      },
      {
        type: "booking_request",
        request: {
          id: request.id,
          client_name: request.clientName,
          service: request.service,
          requested_date: request.requestedDate,
          employee_name: request.employeeName,
          status: request.status,
        },
      },
    ],
  };
}
