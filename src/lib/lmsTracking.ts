import { getAppEnvironment } from "./environment";
import type { GameTrackingEvent } from "../context/GameUserContext";

export interface LmsResponse {
  status: "ok" | "error";
  message?: string;
}

export interface GameAttemptPayload {
  outcome: "game_completed" | "game_over";
  score?: number;
}

// Track start attempts per token to prevent duplicate calls and ensure finish is called only after start
const startedTokens = new Set<string>();
const inFlightStartPromises = new Map<string, Promise<LmsResponse>>();
const finishedTokens = new Set<string>();

/**
 * Resets the in-memory token state. Primarily useful for unit testing.
 */
export function resetLmsTrackingState(): void {
  startedTokens.clear();
  inFlightStartPromises.clear();
  finishedTokens.clear();
}

/**
 * Determines the LMS host to target based on:
 * 1. Explicit VITE_LMS_HOST environment variable override
 * 2. Current window hostname matching
 * 3. App environment (staging vs production)
 */
export function getLmsHost(): string {
  const envHost = import.meta.env.VITE_LMS_HOST?.trim();
  if (envHost) {
    return envHost;
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname === "endsideoutgames.netlify.app") {
      return "classroom.endsideout.org";
    }
    if (
      hostname === "staging--endsideout-games.netlify.app" ||
      hostname.includes("staging")
    ) {
      return "staging-classroom.endsideout.org";
    }
  }

  return getAppEnvironment() === "production"
    ? "classroom.endsideout.org"
    : "staging-classroom.endsideout.org";
}

/**
 * Reports game start to the LMS:
 * POST https://LMS_HOST/game_attempts/start
 */
export async function reportGameStart(
  token: string,
  customHost?: string
): Promise<LmsResponse> {
  const cleanToken = token?.trim();
  if (!cleanToken) {
    return { status: "error", message: "Token is missing" };
  }

  // Already started
  if (startedTokens.has(cleanToken)) {
    return { status: "ok" };
  }

  // If already in flight, return existing promise
  const existingPromise = inFlightStartPromises.get(cleanToken);
  if (existingPromise) {
    return existingPromise;
  }

  const host = customHost || getLmsHost();
  const url = `https://${host}/game_attempts/start`;

  const startPromise = (async (): Promise<LmsResponse> => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        body: JSON.stringify({ token: cleanToken }),
      });

      const data = (await response.json().catch(() => ({}))) as Partial<LmsResponse>;

      if (!response.ok || data.status === "error") {
        const errorMsg = data.message || `LMS start failed with HTTP ${response.status}`;
        console.error(`[LMS Tracking] Start error (${response.status}):`, errorMsg);
        return { status: "error", message: errorMsg };
      }

      startedTokens.add(cleanToken);
      if (import.meta.env.DEV) {
        console.log("[LMS Tracking] Game attempt started successfully:", cleanToken);
      }
      return { status: "ok" };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Network error";
      console.error("[LMS Tracking] Network error on start:", err);
      return { status: "error", message: errorMsg };
    } finally {
      inFlightStartPromises.delete(cleanToken);
    }
  })();

  inFlightStartPromises.set(cleanToken, startPromise);
  return startPromise;
}

/**
 * Reports game completion or game over to the LMS:
 * POST https://LMS_HOST/game_attempts/finish
 */
export async function reportGameFinish(params: {
  token: string;
  outcome: "game_completed" | "game_over";
  score?: number;
  customHost?: string;
}): Promise<LmsResponse> {
  const cleanToken = params.token?.trim();
  if (!cleanToken) {
    return { status: "error", message: "Token is missing" };
  }

  // Ensure game attempt was started before calling finish (prevents 422 error from LMS)
  if (!startedTokens.has(cleanToken)) {
    const startResult = await reportGameStart(cleanToken, params.customHost);
    if (startResult.status === "error") {
      console.warn(
        "[LMS Tracking] Failed to automatically start game before finishing:",
        startResult.message
      );
    }
  }

  // Prevent duplicate finish calls for the same token
  if (finishedTokens.has(cleanToken)) {
    if (import.meta.env.DEV) {
      console.log("[LMS Tracking] Game already reported as finished for token:", cleanToken);
    }
    return { status: "ok" };
  }

  const host = params.customHost || getLmsHost();
  const url = `https://${host}/game_attempts/finish`;

  const gameAttempt: GameAttemptPayload = {
    outcome: params.outcome,
  };

  if (typeof params.score === "number" && Number.isFinite(params.score)) {
    gameAttempt.score = Math.round(params.score);
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
      body: JSON.stringify({
        token: cleanToken,
        game_attempt: gameAttempt,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as Partial<LmsResponse>;

    if (!response.ok || data.status === "error") {
      const errorMsg = data.message || `LMS finish failed with HTTP ${response.status}`;
      console.error(`[LMS Tracking] Finish error (${response.status}):`, errorMsg);
      return { status: "error", message: errorMsg };
    }

    finishedTokens.add(cleanToken);
    if (import.meta.env.DEV) {
      console.log("[LMS Tracking] Game attempt finished successfully:", {
        token: cleanToken,
        game_attempt: gameAttempt,
      });
    }
    return { status: "ok" };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Network error";
    console.error("[LMS Tracking] Network error on finish:", err);
    return { status: "error", message: errorMsg };
  }
}

/**
 * Dispatches LMS reporting based on tracking events if a valid token is present.
 */
export async function handleLmsGameEvent(
  event: GameTrackingEvent,
  token?: string | null
): Promise<void> {
  if (!token?.trim()) {
    return;
  }

  if (event.event === "game_started") {
    await reportGameStart(token);
  } else if (event.event === "game_completed" || event.event === "game_over") {
    await reportGameFinish({
      token,
      outcome: event.event,
      score: event.score,
    });
  }
}
