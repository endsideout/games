import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import type { GameEvent } from "../types";
import { normalizeSchoolKey, normalizeGameId, normalizeEventType } from "../utils/normalize";
import { parseEventTimestampMs } from "../utils/dates";

export function mapFirestoreDocToGameEvent(doc: QueryDocumentSnapshot<DocumentData>): GameEvent {
  const data = (doc.data() as Partial<GameEvent>) ?? {};
  const gameId = normalizeGameId(data.gameId);
  const event = normalizeEventType(data.event);
  const safeUser = data.user ?? { email: null, name: null };
  const school = safeUser.school ?? safeUser.schoolName ?? null;
  const createdAt = data.createdAt ?? data.timestamp ?? "";
  const timestamp = data.timestamp ?? data.createdAt ?? "";
  const createdAtMs = parseEventTimestampMs(createdAt, timestamp);

  return {
    ...data,
    id: doc.id,
    gameId,
    event,
    user: safeUser,
    createdAt,
    timestamp,
    schoolNormalized: normalizeSchoolKey(school),
    createdAtMs,
    eventTypeNormalized: event,
    gameIdNormalized: gameId,
  } as GameEvent;
}
