import { describe, it, expect, vi, beforeEach } from "vitest";
import type { GameStats } from "../../types";

const xlsxMocks = vi.hoisted(() => ({
  book_new: vi.fn(() => ({})),
  aoa_to_sheet: vi.fn(() => ({})),
  book_append_sheet: vi.fn(),
  writeFile: vi.fn(),
}));

vi.mock("xlsx", () => ({
  utils: {
    book_new: xlsxMocks.book_new,
    aoa_to_sheet: xlsxMocks.aoa_to_sheet,
    book_append_sheet: xlsxMocks.book_append_sheet,
  },
  writeFile: xlsxMocks.writeFile,
}));

function minimalStats(): GameStats {
  return {
    totalGames: 0,
    gamesStarted: 1,
    gamesCompleted: 1,
    gamesAbandoned: 0,
    completionRate: 100,
    averageScore: 5,
    averageMoves: 2,
    averageTimeRemaining: 1,
    highestScoreSummary: {
      score: null,
      userName: null,
      userEmail: null,
      completedAt: null,
    },
    gamesByGameId: { gx: { started: 1, completed: 1, avgScore: 5 } },
    recentEvents: [],
    eventsByDate: [],
    scoreDistribution: [],
    userStats: {},
    gamesByResult: {},
  };
}

describe("exportStatsToExcel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates workbook with expected sheet names and rows", async () => {
    const { exportStatsToExcel } = await import("./excel");
    exportStatsToExcel(minimalStats());

    expect(xlsxMocks.book_new).toHaveBeenCalledTimes(1);
    expect(xlsxMocks.writeFile).toHaveBeenCalledTimes(1);

    const sheetNames = xlsxMocks.book_append_sheet.mock.calls.map((c) => c[2]);
    expect(sheetNames).toEqual([
      "Overview",
      "Games by Type",
      "Games by Result",
      "Events by Date",
      "User Stats",
      "Recent Events",
    ]);

    const overviewCall = xlsxMocks.aoa_to_sheet.mock.calls.find(
      (c) => (c[0] as unknown[][])[0]?.[0] === "Metric"
    );
    expect(overviewCall).toBeDefined();
    const overview = overviewCall![0] as unknown[][];
    expect(overview[1]).toEqual(["Total Games Started", 1]);
  });
});
