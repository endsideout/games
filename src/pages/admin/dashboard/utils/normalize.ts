export function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}

/** Display/raw school string (trimmed). */
export function normalizeSchoolRaw(value: string | null | undefined): string {
  if (value == null || typeof value !== "string") return "";
  return value.trim();
}

/** Lowercased key for comparisons and filters. */
export function normalizeSchoolKey(value: string | null | undefined): string {
  return normalizeSchoolRaw(value).toLowerCase();
}

export function normalizeGameId(value: unknown): string {
  if (typeof value !== "string") return "unknown";
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "unknown";
}

export function normalizeEventType(value: unknown): string {
  if (typeof value !== "string") return "unknown_event";
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "unknown_event";
}

export function formatGameLabel(gameId: string): string {
  return gameId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatEventLabel(eventType: string): string {
  return eventType.replace("game_", "");
}
