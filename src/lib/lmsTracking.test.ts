import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  reportGameStart,
  reportGameFinish,
  handleLmsGameEvent,
  resetLmsTrackingState,
  getLmsHost,
} from "./lmsTracking";

describe("lmsTracking", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    resetLmsTrackingState();
    vi.restoreAllMocks();
    delete import.meta.env.VITE_LMS_HOST;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete import.meta.env.VITE_LMS_HOST;
  });

  describe("getLmsHost", () => {
    it("returns staging host for staging--endsideout-games.netlify.app", () => {
      vi.stubGlobal("window", {
        location: { hostname: "staging--endsideout-games.netlify.app" },
      });
      expect(getLmsHost()).toBe("staging-classroom.endsideout.org");
    });

    it("returns production host for endsideoutgames.netlify.app", () => {
      vi.stubGlobal("window", {
        location: { hostname: "endsideoutgames.netlify.app" },
      });
      expect(getLmsHost()).toBe("classroom.endsideout.org");
    });

    it("allows custom VITE_LMS_HOST override", () => {
      import.meta.env.VITE_LMS_HOST = "custom-lms.example.org";
      expect(getLmsHost()).toBe("custom-lms.example.org");
    });
  });

  describe("reportGameStart", () => {
    beforeEach(() => {
      vi.stubGlobal("window", {
        location: { hostname: "staging--endsideout-games.netlify.app" },
      });
    });

    it("returns error if token is missing or empty", async () => {
      const result = await reportGameStart("");
      expect(result.status).toBe("error");
      expect(result.message).toBe("Token is missing");
    });

    it("sends POST to /game_attempts/start with token in JSON body and omit credentials", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok" }),
      });
      globalThis.fetch = mockFetch;

      const result = await reportGameStart("test-token-123");

      expect(result.status).toBe("ok");
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("https://staging-classroom.endsideout.org/game_attempts/start");
      expect(options.method).toBe("POST");
      expect(options.credentials).toBe("omit");
      expect(options.headers).toEqual({ "Content-Type": "application/json" });
      expect(JSON.parse(options.body)).toEqual({ token: "test-token-123" });
    });

    it("does not send duplicate POST if token is already started", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok" }),
      });
      globalThis.fetch = mockFetch;

      await reportGameStart("test-token-123");
      const secondCall = await reportGameStart("test-token-123");

      expect(secondCall.status).toBe("ok");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("handles 422 error response correctly", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ status: "error", message: "Invalid token" }),
      });
      globalThis.fetch = mockFetch;

      const result = await reportGameStart("bad-token");
      expect(result.status).toBe("error");
      expect(result.message).toBe("Invalid token");
    });
  });

  describe("reportGameFinish", () => {
    beforeEach(() => {
      vi.stubGlobal("window", {
        location: { hostname: "staging--endsideout-games.netlify.app" },
      });
    });

    it("auto-calls start if finish is called without prior start", async () => {
      const calls: string[] = [];
      const mockFetch = vi.fn().mockImplementation(async (url: string) => {
        calls.push(url);
        return {
          ok: true,
          status: 200,
          json: async () => ({ status: "ok" }),
        };
      });
      globalThis.fetch = mockFetch;

      const result = await reportGameFinish({
        token: "auto-start-token",
        outcome: "game_completed",
        score: 95.4,
      });

      expect(result.status).toBe("ok");
      expect(calls.length).toBe(2);
      expect(calls[0]).toContain("/game_attempts/start");
      expect(calls[1]).toContain("/game_attempts/finish");

      const finishBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(finishBody).toEqual({
        token: "auto-start-token",
        game_attempt: {
          outcome: "game_completed",
          score: 95, // rounded to integer
        },
      });
    });

    it("supports game_over outcome without score", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok" }),
      });
      globalThis.fetch = mockFetch;

      // First start
      await reportGameStart("game-over-token");

      // Then finish
      const result = await reportGameFinish({
        token: "game-over-token",
        outcome: "game_over",
      });

      expect(result.status).toBe("ok");
      expect(mockFetch).toHaveBeenCalledTimes(2);

      const finishBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(finishBody).toEqual({
        token: "game-over-token",
        game_attempt: {
          outcome: "game_over",
        },
      });
    });

    it("prevents duplicate finish calls for the same token", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok" }),
      });
      globalThis.fetch = mockFetch;

      await reportGameStart("tok1");
      await reportGameFinish({ token: "tok1", outcome: "game_completed", score: 100 });
      const secondFinish = await reportGameFinish({
        token: "tok1",
        outcome: "game_completed",
        score: 100,
      });

      expect(secondFinish.status).toBe("ok");
      // 1 for start, 1 for first finish, none for second finish
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("handleLmsGameEvent", () => {
    beforeEach(() => {
      vi.stubGlobal("window", {
        location: { hostname: "staging--endsideout-games.netlify.app" },
      });
    });

    it("does nothing when token is null or empty", async () => {
      const mockFetch = vi.fn();
      globalThis.fetch = mockFetch;

      await handleLmsGameEvent({ gameId: "quiz", event: "game_started" }, null);
      await handleLmsGameEvent({ gameId: "quiz", event: "game_completed" }, "   ");

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("dispatches game_started event", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok" }),
      });
      globalThis.fetch = mockFetch;

      await handleLmsGameEvent(
        { gameId: "fruit-veggie-quiz", event: "game_started" },
        "my-token"
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch.mock.calls[0][0]).toContain("/game_attempts/start");
    });

    it("dispatches game_completed event with score", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ status: "ok" }),
      });
      globalThis.fetch = mockFetch;

      await handleLmsGameEvent(
        { gameId: "fruit-veggie-quiz", event: "game_started" },
        "my-token"
      );
      await handleLmsGameEvent(
        { gameId: "fruit-veggie-quiz", event: "game_completed", score: 93 },
        "my-token"
      );

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch.mock.calls[1][0]).toContain("/game_attempts/finish");
      const finishBody = JSON.parse(mockFetch.mock.calls[1][1].body);
      expect(finishBody.game_attempt).toEqual({
        outcome: "game_completed",
        score: 93,
      });
    });
  });
});
