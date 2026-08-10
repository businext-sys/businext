/**
 * Utilidades de fecha para la Agenda (issue #030).
 *
 * Las reservas se guardan como strings "wall-clock" sin timezone
 * (ej. "2026-08-01T10:00:00"), igual que documenta
 * packages/shared-core/src/services/reservationTime.ts (#017) — por eso
 * aqui NO se hace ninguna conversion de timezone, solo comparacion y
 * formato de los componentes de fecha tal cual vienen.
 */

export function parseWallClock(dateStr: string): Date {
  return new Date(dateStr);
}

export function isSameDay(dateStr: string, day: Date): boolean {
  const d = parseWallClock(dateStr);
  return (
    d.getFullYear() === day.getFullYear() &&
    d.getMonth() === day.getMonth() &&
    d.getDate() === day.getDate()
  );
}

export function addDays(day: Date, amount: number): Date {
  const copy = new Date(day);
  copy.setDate(copy.getDate() + amount);
  return copy;
}

export function isToday(day: Date): boolean {
  return isSameDay(day.toISOString(), new Date());
}

export function formatHour(dateStr: string): string {
  const d = parseWallClock(dateStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDayLabel(day: Date): string {
  const label = day.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
