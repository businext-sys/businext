/**
 * Calculo de fecha fin de una reserva y conversion de timezone.
 * Extraido de apps/web/src/components/reservation/ReservationModal.tsx
 * (lineas 135-141 en la version pre-extraccion), issue #17.
 *
 * A diferencia del codigo original (que usaba `moment-timezone` con
 * "Europe/Madrid" hardcodeado), esta version:
 * - Recibe el timezone como parametro (por defecto Europe/Madrid, para no
 *   cambiar el comportamiento actual de apps/web sin una decision explicita
 *   del negocio).
 * - Usa `Intl.DateTimeFormat` (nativo de JS/el motor de runtime), sin anadir
 *   `moment-timezone` ni `dayjs` como dependencia de shared-core — evita
 *   duplicar el trabajo de la issue #019 (migrar moment-timezone -> dayjs)
 *   y no introduce una libreria pesada en el paquete compartido.
 */

export const DEFAULT_RESERVATION_TIMEZONE = "Europe/Madrid";

/**
 * Convierte un instante UTC (string ISO con 'Z' u offset) a la hora local
 * "de pared" (wall-clock) de un timezone IANA, devuelta como string sin
 * offset: "YYYY-MM-DDTHH:mm:ss".
 */
export function toTimezoneWallClock(utcISO: string, timeZone: string): string {
  const date = new Date(utcISO);
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date).reduce<Record<string, string>>(
    (acc, part) => {
      acc[part.type] = part.value;
      return acc;
    },
    {}
  );
  // Algunos runtimes devuelven "24" para medianoche con hour12:false; se
  // normaliza a "00" para mantener el formato ISO valido.
  const hour = parts.hour === "24" ? "00" : parts.hour;
  return `${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}`;
}

/**
 * Suma minutos a un string "wall-clock" (sin timezone), preservando el
 * mismo marco de referencia (no vuelve a convertir por timezone). Equivalente
 * a `moment(wallClockISO).add(minutes, "m")` del codigo original.
 */
export function addMinutesToWallClock(wallClockISO: string, minutes: number): string {
  const d = new Date(wallClockISO);
  d.setMinutes(d.getMinutes() + minutes);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * Devuelve el instante actual como string "wall-clock" en la hora local del
 * entorno de ejecucion (navegador/servidor), sin conversion de timezone.
 * Equivalente a `moment().format("YYYY-MM-DDTHH:mm:ss")` del codigo
 * original (issue #019, migracion desde moment-timezone — usado por
 * flujos de "atencion inmediata" que no requieren convertir a un timezone
 * de negocio especifico, solo registrar la hora local actual).
 */
export function nowAsWallClock(): string {
  return addMinutesToWallClock(new Date().toISOString(), 0);
}

export type ReservationWindow = {
  reservationStartDate: string;
  reservationEndDate: string;
};

/**
 * Calcula `reservationStartDate` (convertido al timezone del negocio) y
 * `reservationEndDate` (inicio + duracion) para una reserva nueva o editada.
 */
export function computeReservationWindow(params: {
  /** Valor crudo del selector de fecha (ISO UTC, ej. `dayjs().toISOString()`). */
  startDateTimeISO: string;
  durationMinutes: number;
  /** Timezone IANA del negocio. Por defecto Europe/Madrid (comportamiento actual). */
  timezone?: string;
}): ReservationWindow {
  const { startDateTimeISO, durationMinutes, timezone = DEFAULT_RESERVATION_TIMEZONE } = params;
  const reservationStartDate = toTimezoneWallClock(startDateTimeISO, timezone);
  const reservationEndDate = addMinutesToWallClock(reservationStartDate, durationMinutes);
  return { reservationStartDate, reservationEndDate };
}
