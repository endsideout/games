import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { GameEvent } from "../types";
import { buildGameStats } from "./buildGameStats";

function ev(overrides: Partial<GameEvent>): GameEvent {
  return {
    id: "x",
    gameId: "g",
    event: "game_started",
    user: { email: "u1@x.com", name: "U1", school: "S1" },
    timestamp: "2025-06-15T12:00:00.000Z",
    createdAt: "2025-06-15T12:00:00.000Z",
    schoolNormalized: "s1",
    createdAtMs: Date.parse("2025-06-15T12:00:00.000Z"),
    eventTypeNormalized: "game_started",
    gameIdNormalized: "g1",
    ...overrides,
  };
}

describe("buildGameStats", () => {
  let localeSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localeSpy = vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("fixed-date");
  });

  afterEach(() => {
    localeSpy.mockRestore();
  });

  it("aggregates starts, completions, abandonment by session, and highest score", () => {
    const filtered: GameEvent[] = [
      ev({
        id: "1",
        sessionId: "s-abandon",
        eventTypeNormalized: "game_started",
        event: "game_started",
      }),
      ev({
        id: "2",
        sessionId: "s-done",
        eventTypeNormalized: "game_started",
        event: "game_started",
        gameIdNormalized: "g2",
      }),
      ev({
        id: "3",
        sessionId: "s-done",
        eventTypeNormalized: "game_completed",
        event: "game_completed",
        gameIdNormalized: "g2",
        score: 42,
      }),
      ev({
        id: "4",
        sessionId: "s-done2",
        eventTypeNormalized: "game_completed",
        event: "game_completed",
        gameIdNormalized: "g2",
        score: 100,
      }),
    ];

    const stats = buildGameStats(filtered, { dateRangeStart: "", dateRangeEnd: "" });

    expect(stats.gamesStarted).toBe(2);
    expect(stats.gamesCompleted).toBe(2);
    expect(stats.gamesAbandoned).toBe(1);
    expect(stats.highestScoreSummary.score).toBe(100);
    expect(stats.gamesByGameId.g2.completed).toBe(2);
    expect(stats.gamesByGameId.g2.started).toBe(1);
    expect(stats.recentEvents).toHaveLength(4);
    expect(stats.eventsByDate).toHaveLength(7);
  });

  it("uses hourly buckets when date range is a single day", () => {
    const localNoon = new Date(2025, 5, 15, 12, 0, 0, 0);
    const filtered: GameEvent[] = [
      ev({
        id: "h1",
        createdAtMs: localNoon.getTime(),
        eventTypeNormalized: "game_started",
        event: "game_started",
      }),
    ];
    const stats = buildGameStats(filtered, {
      dateRangeStart: "2025-06-15",
      dateRangeEnd: "2025-06-15",
    });
    const label = `${localNoon.getHours().toString().padStart(2, "0")}:00`;
    const row = stats.eventsByDate.find((r) => r.date === label);
    expect(row?.started).toBe(1);
    expect(stats.eventsByDate).toHaveLength(24);
  });
});
