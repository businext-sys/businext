// Nota (issue #14): existe `ReservationSchema` en ../schemas/reservation que
// valida la forma conocida de este tipo. El tipo `Reservation` en si NO se
// deriva de ese schema (a diferencia de Finances/BookingRequest/Configuration/
// Employee) porque conserva un index signature legado usado para acceso
// generico de formularios (`register(field)`), que zod no modela de forma
// util para z.infer. Ver packages/shared-core/src/schemas/reservation.ts.
export type Reservation = {
  [x: string]: string | number | boolean | undefined;
  id?: number;
  customerName: string;
  inCharge: string;
  reservationStartDate: string;
  reservationEndDate: string;
  timePerReservation: number;
  status: string;
  service: string;
};

export const StatusOptions = {
  PENDING: "Pendiente",
  COMPLETED: "Completada",
};
