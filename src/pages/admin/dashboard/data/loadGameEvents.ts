import {
  collection,
  query,
  orderBy,
  limit,
  where,
  getDocs,
  startAfter,
  type Firestore,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import type { GameEvent } from "../types";
import { EVENTS_PAGE_SIZE, MAX_UNBOUNDED_EVENT_LOAD } from "../constants";
import { mapFirestoreDocToGameEvent } from "./mapEvent";

/**
 * Loads game_events with pagination. When useIndexFreeFallback is true, date filters are applied
 * locally after fetch (used if composite index is missing).
 */
export async function loadGameEventsPaginated(
  db: Firestore,
  options: {
    firestoreStartIso: string | null;
    firestoreEndIso: string | null;
    useIndexFreeFallback: boolean;
    localStartMs: number | null;
    localEndMs: number | null;
    signal: AbortSignal;
    onProgress: (loadedRaw: number, matchedAfterLocal: number) => void;
  }
): Promise<{ events: GameEvent[]; warnings: string[] }> {
  const warnings: string[] = [];
  const eventsRef = collection(db, "game_events");
  const constraints: QueryConstraint[] = [];

  if (!options.useIndexFreeFallback) {
    if (options.firestoreStartIso) {
      constraints.push(where("createdAt", ">=", options.firestoreStartIso));
    }
    if (options.firestoreEndIso) {
      constraints.push(where("createdAt", "<=", options.firestoreEndIso));
    }
  }

  constraints.push(orderBy("createdAt", "desc"));

  const boundedInFirestore =
    !options.useIndexFreeFallback &&
    options.firestoreStartIso !== null &&
    options.firestoreEndIso !== null;
  const maxRawDocs = boundedInFirestore ? 2_000_000 : MAX_UNBOUNDED_EVENT_LOAD;

  const matched: GameEvent[] = [];
  let lastDoc: QueryDocumentSnapshot<DocumentData> | null = null;
  let rawLoaded = 0;
  let lastPageSize = 0;

  const passesLocalDate = (ev: GameEvent): boolean => {
    if (options.localStartMs !== null && ev.createdAtMs < options.localStartMs) return false;
    if (options.localEndMs !== null && ev.createdAtMs > options.localEndMs) return false;
    return true;
  };

  while (rawLoaded < maxRawDocs) {
    if (options.signal.aborted) break;

    const pageParts: QueryConstraint[] = [...constraints];
    if (lastDoc) pageParts.push(startAfter(lastDoc));
    pageParts.push(limit(EVENTS_PAGE_SIZE));

    const snap = await getDocs(query(eventsRef, ...pageParts));
    if (snap.empty) break;

    lastPageSize = snap.size;
    for (const docSnap of snap.docs) {
      rawLoaded++;
      const ev = mapFirestoreDocToGameEvent(docSnap);
      if (options.useIndexFreeFallback && !passesLocalDate(ev)) continue;
      matched.push(ev);
    }

    options.onProgress(rawLoaded, matched.length);
    lastDoc = snap.docs[snap.docs.length - 1];
    if (snap.size < EVENTS_PAGE_SIZE) break;
  }

  if (options.useIndexFreeFallback) {
    warnings.push(
      "Date filters are applied locally because a Firestore index is missing or the query could not run server-side. Results may be incomplete for older date ranges."
    );
  }

  if (rawLoaded >= maxRawDocs && lastPageSize === EVENTS_PAGE_SIZE) {
    warnings.push(
      `Stopped loading after ${maxRawDocs.toLocaleString()} raw events. Narrow the date range for complete data.`
    );
  }

  return { events: matched, warnings };
}
