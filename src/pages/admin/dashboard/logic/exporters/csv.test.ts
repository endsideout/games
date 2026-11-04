import { describe, it, expect } from "vitest";
import type { GameStats } from "../../types";
import { serializeGameAnalyticsCsv } from "./csv";

function minimalStats(overrides: Partial<GameStats> = {}): GameStats {
  return {
    totalGames: 1,
    gamesStarted: 2,
    gamesCompleted: 1,
    gamesAbandoned: 1,
    completionRate: 50,
    averageScore: 10,
    averageMoves: 3,
    averageTimeRemaining: 12,
    highestScoreSummary: {
      score: null,
      userName: null,
      userEmail: null,
      completedAt: null,
    },
    gamesByGameId: {
      g1: { started: 2, completed: 1, avgScore: 10 },
    },
    recentEvents: [],
    eventsByDate: [{ date: "fixed-date", started: 1, completed: 1 }],
    scoreDistribution: [{ range: "0-5", count: 1 }],
    userStats: {},
    gamesByResult: { g1: [{ range: "10", count: 1 }] },
    ...overrides,
  };
}

describe("serializeGameAnalyticsCsv", () => {
  it("matches snapshot for minimal stats", () => {
    expect(serializeGameAnalyticsCsv(minimalStats())).toMatchSnapshot();
  });

  it("includes ISO timestamp when highest score exists", () => {
    const csv = serializeGameAnalyticsCsv(
      minimalStats({
        highestScoreSummary: {
          score: 99,
          userName: "Pat",
          userEmail: null,
          completedAt: "2025-01-02T00:00:00.000Z",
        },
      })
    );
    expect(csv).toContain("99");
    expect(csv).toContain("Pat");
    expect(csv).toContain("2025-01-02T00:00:00.000Z");
  });
});
