/**
 * Deteccion de conflictos de horario entre reservas.
 * Extraido de apps/web/src/components/reservation/ReservationModal.tsx
 * (lineas 76-108 en la version pre-extraccion), issue #17.
 *
 * Funcion pura: no depende de React, formularios, ni fecha "ahora" del
 * sistema mas alla de las reservas y el rango pasados como argumentos.
 */

export type ReservationForConflictCheck = {
  id?: number;
  inCharge: string;
  status: string;
  reservationStartDate: string;
  reservationEndDate: string;
  customerName: string;
  service: string;
};

export type ReservationConflict = {
  customerName: string;
  /** Rango formateado "HH:mm - HH:mm" de la reserva en conflicto. */
  time: string;
  service: string;
};

export type DetectReservationConflictInput = {
  /** Fecha/hora de inicio propuesta (string parseable por `Date`). */
  newStartDate: string;
  /** Duracion de la nueva reserva, en minutos. */
  durationMinutes: number;
  /** Persona a cargo de la nueva reserva (solo se compara contra la misma persona). */
  inCharge: string;
  /** Reservas existentes contra las que comparar. */
  reservations: ReservationForConflictCheck[];
  /** Id de la reserva que se esta editando (se excluye a si misma). */
  excludeId?: number;
  /** Estados que cuentan como "activos" para efectos de conflicto. */
  activeStatuses?: string[];
};

function formatHHmm(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const DEFAULT_ACTIVE_STATUSES = ["PENDING", "COMPLETED"];

/**
 * Devuelve el primer conflicto de horario encontrado (o `null` si no hay
 * ninguno), comparando la nueva reserva propuesta contra las reservas
 * existentes de la misma persona a cargo.
 */
export function detectReservationConflict(
  input: DetectReservationConflictInput
): ReservationConflict | null {
  const {
    newStartDate,
    durationMinutes,
    inCharge,
    reservations,
    excludeId,
    activeStatuses = DEFAULT_ACTIVE_STATUSES,
  } = input;

  if (!newStartDate || !inCharge) return null;

  const newStart = new Date(newStartDate);
  if (Number.isNaN(newStart.getTime())) return null;
  const newEnd = new Date(newStart.getTime() + durationMinutes * 60_000);

  const conflicting = reservations.filter((r) => {
    if (excludeId != null && r.id === excludeId) return false;
    if (r.inCharge !== inCharge) return false;
    if (!activeStatuses.includes(r.status)) return false;

    const rStart = new Date(r.reservationStartDate);
    const rEnd = new Date(r.reservationEndDate);

    // Overlap check: newStart < rEnd && newEnd > rStart
    return newStart.getTime() < rEnd.getTime() && newEnd.getTime() > rStart.getTime();
  });

  if (conflicting.length === 0) return null;

  const c = conflicting[0];
  return {
    customerName: c.customerName,
    time: `${formatHHmm(c.reservationStartDate)} - ${formatHHmm(c.reservationEndDate)}`,
    service: c.service,
  };
}
