import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import { saveGameEventToFirebase } from "../lib/gameTracking";

export interface GameUser {
  email: string | null;
  name: string | null;
  grade: string | null;
  teacherName: string | null;
  schoolName: string | null;
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
  isProfileComplete: boolean;
  setPlayerProfile: (profile: {
    name: string;
    grade: string;
    teacherName: string;
    schoolName: string;
  }) => void;
  trackEvent: (event: GameTrackingEvent) => void;
}

const GameUserContext = createContext<GameUserContextValue | null>(null);
const PLAYER_PROFILE_STORAGE_KEY = "endsideout-player-profile";

function getStoredProfile(): Partial<GameUser> {
  if (typeof window === "undefined") {
    return {};
  }

  const rawProfile = window.localStorage.getItem(PLAYER_PROFILE_STORAGE_KEY);
  if (!rawProfile) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawProfile) as Partial<GameUser>;
    return {
      name: parsed.name ?? null,
      grade: parsed.grade ?? null,
      teacherName: parsed.teacherName ?? null,
      schoolName: parsed.schoolName ?? null,
      school: parsed.schoolName ?? parsed.school ?? null,
    };
  } catch {
    return {};
  }
}

function parseUserFromSearchParams(searchParams: URLSearchParams): GameUser {
  const email = searchParams.get("email") || null;
  // Thinkific sends firstName; also support explicit "name" param
  const name =
    searchParams.get("name") ||
    searchParams.get("firstName") ||
    null;
  const grade = searchParams.get("grade") || null;
  const teacherName = searchParams.get("teacherName") || null;
  const schoolName = searchParams.get("schoolName") || searchParams.get("school") || null;
  const school = schoolName;

  return { email, name, grade, teacherName, schoolName, school };
}

export function GameUserProvider({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const [storedProfile, setStoredProfile] = useState<Partial<GameUser>>(getStoredProfile);

  const searchParamUser = useMemo(
    () => parseUserFromSearchParams(searchParams),
    [searchParams]
  );

  const user = useMemo<GameUser>(() => {
    const mergedUser = {
      ...searchParamUser,
      name: searchParamUser.name ?? storedProfile.name ?? null,
      grade: searchParamUser.grade ?? storedProfile.grade ?? null,
      teacherName: searchParamUser.teacherName ?? storedProfile.teacherName ?? null,
      schoolName: searchParamUser.schoolName ?? storedProfile.schoolName ?? storedProfile.school ?? null,
    };

    return {
      ...mergedUser,
      school: mergedUser.schoolName ?? searchParamUser.school ?? storedProfile.school ?? null,
    };
  }, [searchParamUser, storedProfile]);

  const isIdentified = Boolean(user.email || user.name);
  const isProfileComplete = Boolean(
    user.name?.trim() &&
    user.grade?.trim() &&
    user.teacherName?.trim() &&
    user.schoolName?.trim()
  );

  const setPlayerProfile = useCallback((profile: {
    name: string;
    grade: string;
    teacherName: string;
    schoolName: string;
  }) => {
    const normalizedProfile: Partial<GameUser> = {
      name: profile.name.trim(),
      grade: profile.grade.trim(),
      teacherName: profile.teacherName.trim(),
      schoolName: profile.schoolName.trim(),
      school: profile.schoolName.trim(),
    };

    setStoredProfile(normalizedProfile);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        PLAYER_PROFILE_STORAGE_KEY,
        JSON.stringify(normalizedProfile)
      );
    }
  }, []);

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
      isProfileComplete,
      setPlayerProfile,
      trackEvent,
    }),
    [user, isIdentified, isProfileComplete, setPlayerProfile, trackEvent]
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
