import { useEffect, useRef, useState } from "react";
import { getFirestoreDb } from "../../../../lib/firebase";
import { loadGameEventsPaginated } from "../data/loadGameEvents";
import type { GameEvent } from "../types";

export type GameEventsLoadProgress = { raw: number; matched: number } | null;

export function useGameEvents(params: {
  queryStartIso: string | null;
  queryEndIso: string | null;
  localDateStartMs: number | null;
  localDateEndMs: number | null;
  dateRangeInvalid: boolean;
}): {
  events: GameEvent[];
  loading: boolean;
  error: string;
  queryWarning: string;
  loadProgress: GameEventsLoadProgress;
} {
  const { queryStartIso, queryEndIso, localDateStartMs, localDateEndMs, dateRangeInvalid } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [queryWarning, setQueryWarning] = useState("");
  const [allEvents, setAllEvents] = useState<GameEvent[]>([]);
  const [loadProgress, setLoadProgress] = useState<GameEventsLoadProgress>(null);
  const loadGenRef = useRef(0);

  useEffect(() => {
    const db = getFirestoreDb();
    if (!db) {
      setError("Firebase not configured");
      setLoading(false);
      setAllEvents([]);
      return;
    }

    if (dateRangeInvalid) {
      loadGenRef.current += 1;
      setLoading(false);
      setError("");
      setQueryWarning("");
      setAllEvents([]);
      setLoadProgress(null);
      return;
    }

    const gen = ++loadGenRef.current;
    const ac = new AbortController();

    const tryLoad = async (useIndexFreeFallback: boolean): Promise<void> => {
      const firestoreStartIso = useIndexFreeFallback ? null : queryStartIso;
      const firestoreEndIso = useIndexFreeFallback ? null : queryEndIso;

      const { events, warnings } = await loadGameEventsPaginated(db, {
        firestoreStartIso,
        firestoreEndIso,
        useIndexFreeFallback,
        localStartMs: localDateStartMs,
        localEndMs: localDateEndMs,
        signal: ac.signal,
        onProgress: (raw, matched) => {
          if (loadGenRef.current === gen) {
            setLoadProgress({ raw, matched });
          }
        },
      });

      if (ac.signal.aborted || loadGenRef.current !== gen) return;

      setAllEvents(events);
      setQueryWarning(warnings.length > 0 ? warnings.join(" ") : "");
      setLoadProgress(null);
      setLoading(false);
    };

    void (async () => {
      setLoading(true);
      setError("");
      setQueryWarning("");
      setLoadProgress({ raw: 0, matched: 0 });

      try {
        await tryLoad(false);
      } catch (err: unknown) {
        if (loadGenRef.current !== gen) return;
        const code =
          err && typeof err === "object" && "code" in err
            ? String((err as { code?: string }).code)
            : "";
        const isIndexOrQueryConstraintIssue =
          code === "failed-precondition" || code === "invalid-argument";
        const hasAnyDateIso = Boolean(queryStartIso || queryEndIso);

        if (isIndexOrQueryConstraintIssue && hasAnyDateIso) {
          try {
            await tryLoad(true);
            return;
          } catch (fallbackErr: unknown) {
            if (loadGenRef.current !== gen) return;
            setError(
              fallbackErr instanceof Error ? fallbackErr.message : "Failed to load game events"
            );
            setAllEvents([]);
            setLoading(false);
            setLoadProgress(null);
            return;
          }
        }

        setError(err instanceof Error ? err.message : "Failed to load game events");
        setAllEvents([]);
        setLoading(false);
        setLoadProgress(null);
      }
    })();

    return () => {
      ac.abort();
    };
  }, [queryStartIso, queryEndIso, localDateStartMs, localDateEndMs, dateRangeInvalid]);

  return {
    events: allEvents,
    loading,
    error,
    queryWarning,
    loadProgress,
  };
}
