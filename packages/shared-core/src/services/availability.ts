import type { WorkingHoursBlock } from "../working-hours";
import type { Reservation } from "../reservation";
import type { BookingRequest } from "../booking-request";

const DEFAULT_SLOT = 30;

export type AvailableSlotsOptions = {
  /** Minutos que tiene que caber libres desde cada inicio (la duración del servicio). */
  durationMinutes?: number;
  /** Cada cuánto se ofrece un inicio. */
  stepMinutes?: number;
};

/** `Date.getDay()` (0=domingo) al `dayOfWeek` del horario (0=lunes). */
function jsDayToWorkingDay(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

function parseTime(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function isSameDate(dateStr: string, date: Date): boolean {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
}

/**
 * Inicios libres de un día para un encargado: dentro de los bloques del horario,
 * donde cabe la duración entera sin pisar sus reservas pendientes ni las
 * solicitudes por aceptar (que ocupan un hueco de 30 min). Si el día es hoy,
 * quita los ya pasados. Por defecto, huecos de 30 min cada 30 min, como la web.
 * Devuelve horas "HH:MM" ordenadas.
 */
export function getAvailableSlots(
  date: Date,
  workingHours: WorkingHoursBlock[],
  reservations: Reservation[],
  inCharge: string,
  bookingRequests: BookingRequest[] = [],
  now: Date = new Date(),
  { durationMinutes = DEFAULT_SLOT, stepMinutes = DEFAULT_SLOT }: AvailableSlotsOptions = {}
): string[] {
  const workingDay = jsDayToWorkingDay(date.getDay());
  const dayBlocks = workingHours.filter((wh) => wh.dayOfWeek === workingDay && wh.enabled);
  if (dayBlocks.length === 0) return [];

  const allSlots = new Set<number>();
  for (const block of dayBlocks) {
    const startMin = parseTime(block.startTime);
    const endMin = parseTime(block.endTime);
    for (let t = startMin; t + durationMinutes <= endMin; t += stepMinutes) {
      allSlots.add(t);
    }
  }

  const busy: [number, number][] = [];
  reservations
    .filter(
      (r) =>
        r.inCharge === inCharge &&
        r.status === "PENDING" &&
        isSameDate(r.reservationStartDate, date)
    )
    .forEach((r) => {
      const resStart = new Date(r.reservationStartDate);
      const resStartMin = resStart.getHours() * 60 + resStart.getMinutes();
      const resEnd = new Date(r.reservationEndDate);
      busy.push([resStartMin, resEnd.getHours() * 60 + resEnd.getMinutes()]);
    });

  bookingRequests
    .filter(
      (br) =>
        br.status === "REQUESTED" &&
        (br.employeeName === inCharge || !br.employeeName) &&
        isSameDate(br.requestedDate, date)
    )
    .forEach((br) => {
      const brStart = new Date(br.requestedDate);
      const brStartMin = brStart.getHours() * 60 + brStart.getMinutes();
      busy.push([brStartMin, brStartMin + DEFAULT_SLOT]);
    });

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  const currentMin = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

  return Array.from(allSlots)
    .filter((t) => !busy.some(([start, end]) => t < end && t + durationMinutes > start))
    .filter((t) => t + DEFAULT_SLOT > currentMin)
    .sort((a, b) => a - b)
    .map(formatTime);
}

/** El día no tiene ningún bloque de horario activo. */
export function isDayClosed(date: Date, workingHours: WorkingHoursBlock[]): boolean {
  const workingDay = jsDayToWorkingDay(date.getDay());
  return !workingHours.some((wh) => wh.dayOfWeek === workingDay && wh.enabled);
}
