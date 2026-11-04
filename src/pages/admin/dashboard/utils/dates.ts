export function formatDateInputLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseLocalDateInput(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

export function parseEventTimestampMs(createdAt?: string | null, timestamp?: string | null): number {
  const candidate = createdAt || timestamp;
  const parsed = candidate ? new Date(candidate).getTime() : Number.NaN;
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getStartOfDayMs(value: string): number {
  const date = parseLocalDateInput(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

export function getEndOfDayMs(value: string): number {
  const date = parseLocalDateInput(value);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

export function formatHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}
