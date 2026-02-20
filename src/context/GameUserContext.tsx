import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import { saveGameEventToFirebase } from "../lib/gameTracking";

export interface GameUser {
  email: string | null;
  name: string | null;
  school: string | null;
}

export interface GameTrackingEvent {
  gameId: string;
  event: "game_started" | "game_completed" | "game_over";
  sessionId?: string; // Correlation ID to link events from the same game session
  score?: number;
  moves?: number;
  timeRemaining?: number;
  metadata?: Record<string, unknown>;
}

interface GameUserContextValue {
  user: GameUser;
  isIdentified: boolean;
  trackEvent: (event: GameTrackingEvent) => void;
}

const GameUserContext = createContext<GameUserContextValue | null>(null);

function parseUserFromSearchParams(searchParams: URLSearchParams): GameUser {
  const email = searchParams.get("email") || null;
  // Thinkific sends firstName; also support explicit "name" param
  const name =
    searchParams.get("name") ||
    searchParams.get("firstName") ||
    null;
  const school = searchParams.get("school") || null;

  return { email, name, school };
}

export function GameUserProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [searchParams] = useSearchParams();

  const user = useMemo(
    () => parseUserFromSearchParams(searchParams),
    [searchParams]
  );

  const isIdentified = Boolean(user.email || user.name);

  const trackEvent = useCallback((event: GameTrackingEvent): void => {
    const payload = {
      ...event,
      user,
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
      console.log("[Game Tracking]", payload);
    }

    void saveGameEventToFirebase(payload);
  }, [user]);

  const value = useMemo<GameUserContextValue>(
    () => ({
      user,
      isIdentified,
      trackEvent,
    }),
    [user, isIdentified, trackEvent]
  );

  return (
    <GameUserContext.Provider value={value}>{children}</GameUserContext.Provider>
  );
}

export function useGameUser(): GameUserContextValue {
  const ctx = useContext(GameUserContext);
  if (!ctx) {
    throw new Error("useGameUser must be used within GameUserProvider");
  }
  return ctx;
}

/**
 * Optional: use when provider may not wrap the component (e.g. outside Router)
 * Returns null if no provider.
 */
export function useGameUserOptional(): GameUserContextValue | null {
  return useContext(GameUserContext);
}
