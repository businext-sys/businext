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
