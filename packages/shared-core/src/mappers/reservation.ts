import type { Reservation } from "../reservation";
import { ReservationSchema } from "../schemas/reservation";

/**
 * Convierte la forma del backend (snake_case) a la forma del frontend
 * (camelCase), validando el resultado con zod.
 */
export const mapReservationFromApi = (
  data: Record<string, unknown>
): Reservation => {
  const parsed = ReservationSchema.parse({
    id: data.id,
    customerName: data.customer_name,
    inCharge: data.in_charge,
    reservationStartDate: data.reservation_start_date,
    reservationEndDate: data.reservation_end_date,
    timePerReservation: data.time_per_reservation,
    status: data.status,
    service: data.service,
  });
  return parsed as Reservation;
};

/** Convierte la forma del frontend (camelCase) a la forma del backend (snake_case). */
export const mapReservationToApi = (reservation: Reservation) => ({
  id: reservation.id,
  customer_name: reservation.customerName,
  in_charge: reservation.inCharge,
  reservation_start_date: reservation.reservationStartDate,
  reservation_end_date: reservation.reservationEndDate,
  time_per_reservation: reservation.timePerReservation,
  status: reservation.status,
  service: reservation.service,
});
