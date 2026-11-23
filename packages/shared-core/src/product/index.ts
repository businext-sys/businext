export type Product = {
  id?: number;
  name: string;
  price: number;
  type?: string;
  imageUrl?: string;
  seller?: string;
  /** Duración de un servicio en minutos; sin ella se asume `DEFAULT_SERVICE_DURATION`. */
  durationMinutes?: number | null;
};

export const DEFAULT_SERVICE_DURATION = 30;

export const SERVICE_DURATION_OPTIONS = [15, 30, 45, 60, 75, 90, 120];

/** Duración del servicio de una reserva, por su nombre. */
export function serviceDuration(products: Product[], serviceName: string): number {
  const product = products.find((p) => p.name === serviceName);
  return product?.durationMinutes && product.durationMinutes > 0
    ? product.durationMinutes
    : DEFAULT_SERVICE_DURATION;
}
