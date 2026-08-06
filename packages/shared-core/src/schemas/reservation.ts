import { z } from "zod";

/**
 * Schema de la forma "frontend" (camelCase) de una Reservation.
 *
 * Nota: el tipo `Reservation` en `../reservation` conserva un index signature
 * (`[x: string]: string | number | boolean | undefined`) usado historicamente
 * para acceso generico de formularios (`register(field)`). Este schema valida
 * la forma concreta conocida; no reproduce el index signature porque zod no
 * modela ese patron de forma util para validacion runtime.
 */
export const ReservationSchema = z.object({
  id: z.number().optional(),
  customerName: z.string(),
  inCharge: z.string(),
  reservationStartDate: z.string(),
  reservationEndDate: z.string(),
  timePerReservation: z.number(),
  status: z.string(),
  service: z.string(),
});

export type ReservationParsed = z.infer<typeof ReservationSchema>;
