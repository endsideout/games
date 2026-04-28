import { saveGameEventToFirebase } from "./gameTracking";
import type { GameEventPayload, GameTrackingEvent, GameUser } from "../types";

function normalizeTrackingEvent(event: GameTrackingEvent): GameTrackingEvent {
  return {
    ...event,
    gameId: event.gameId.trim(),
  };
}

function buildPayload(event: GameTrackingEvent, user: GameUser): GameEventPayload {
  return {
    ...normalizeTrackingEvent(event),
    user,
    timestamp: new Date().toISOString(),
  };
}

export async function sendGameTrackingEvent(
  event: GameTrackingEvent,
  user: GameUser
): Promise<void> {
  const normalizedEvent = normalizeTrackingEvent(event);
  if (!normalizedEvent.gameId) {
    if (import.meta.env.DEV) {
      console.warn("[Game Tracking] Skipped event with empty gameId", event);
    }
    return;
  }

  const payload = buildPayload(normalizedEvent, user);
  if (import.meta.env.DEV) {
    console.log("[Game Tracking]", payload);
  }
  await saveGameEventToFirebase(payload);
}
