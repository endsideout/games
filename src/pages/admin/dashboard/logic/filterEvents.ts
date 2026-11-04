import type { GameEvent } from "../types";

export function filterEvents(
  allEvents: GameEvent[],
  params: {
    selectedGameSet: Set<string>;
    normalizedSelectedSchool: string | null;
    dateStartMs: number | null;
    dateEndMs: number | null;
  }
): GameEvent[] {
  const { selectedGameSet, normalizedSelectedSchool, dateStartMs, dateEndMs } = params;
  return allEvents.filter((event) => {
    if (selectedGameSet.size > 0 && !selectedGameSet.has(event.gameIdNormalized)) return false;
    if (normalizedSelectedSchool !== null && event.schoolNormalized !== normalizedSelectedSchool) {
      return false;
    }
    if (dateStartMs !== null && event.createdAtMs < dateStartMs) return false;
    if (dateEndMs !== null && event.createdAtMs > dateEndMs) return false;
    return true;
  });
}
