/**
 * Generacion de un registro financiero a partir de una reserva completada.
 * Extraido de apps/web/src/components/reservation/ReservationModal.tsx
 * (lineas 110-122 en la version pre-extraccion), issue #17.
 */

import type { Finances } from "../finances";
import type { Product } from "../product";

export type ReservationForFinance = {
  id?: number;
  service: string;
  inCharge: string;
  customerName: string;
};

/**
 * Construye el registro financiero (ingreso) correspondiente a una reserva
 * marcada como completada, buscando el precio del servicio en el catalogo
 * de productos. Si el servicio no se encuentra, el monto es 0.
 */
export function buildFinanceRecordFromReservation(
  reservation: ReservationForFinance,
  products: Product[]
): Omit<Finances, "id"> {
  const matchedProduct = products.find((p) => p.name === reservation.service);
  return {
    concept: reservation.service,
    amount: matchedProduct?.price || 0,
    type: "INCOME",
    creator: reservation.inCharge,
    reservation_id: reservation.id ?? null,
    product_id: matchedProduct?.id ?? null,
    customer_name: reservation.customerName,
  };
}
