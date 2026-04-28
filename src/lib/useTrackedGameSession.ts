import { useRef, type MutableRefObject } from "react";
import { generateSessionId } from "./sessionId";
import type { GameTrackingEvent, GameTrackingEventType } from "../types/tracking";

interface UseTrackedGameSessionOptions {
  gameId: string;
  trackEvent: (event: GameTrackingEvent) => void;
}

interface TrackedGameSessionApi {
  sessionIdRef: MutableRefObject<string>;
  startSession: () => string;
  trackWithSession: (event: GameTrackingEventType, score: number) => void;
  resetCompletionGuard: () => void;
}

export function useTrackedGameSession({
  gameId,
  trackEvent,
}: UseTrackedGameSessionOptions): TrackedGameSessionApi {
  const sessionIdRef = useRef("");
  const completionTrackedRef = useRef(false);

  const startSession = (): string => {
    const sessionId = generateSessionId();
    sessionIdRef.current = sessionId;
    completionTrackedRef.current = false;
    trackEvent({ gameId, event: "game_started", sessionId, score: 0 });
    return sessionId;
  };

  const trackWithSession = (event: GameTrackingEventType, score: number): void => {
    if (!sessionIdRef.current) {
      return;
    }

    if (event === "game_completed") {
      if (completionTrackedRef.current) {
        return;
      }
      completionTrackedRef.current = true;
    }

    trackEvent({
      gameId,
      event,
      sessionId: sessionIdRef.current,
      score,
    });
  };

  const resetCompletionGuard = (): void => {
    completionTrackedRef.current = false;
  };

  return { sessionIdRef, startSession, trackWithSession, resetCompletionGuard };
}
