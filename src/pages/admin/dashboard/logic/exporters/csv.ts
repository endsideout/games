import type { GameStats } from "../../types";

/** Builds CSV content for snapshot/testing (pure). */
export function serializeGameAnalyticsCsv(stats: GameStats): string {
  const highest = stats.highestScoreSummary;
  const highestScoreDisplay =
    highest.score !== null ? highest.score.toString() : "N/A";
  const highestUserDisplay =
    highest.score !== null ? highest.userName || highest.userEmail || "N/A" : "N/A";
  const highestCompletedAtDisplay =
    highest.score !== null && highest.completedAt
      ? new Date(highest.completedAt).toISOString()
      : "N/A";

  const csvData: string[][] = [
    ["Metric", "Value"],
    ["Total Games Started", stats.gamesStarted.toString()],
    ["Games Completed", stats.gamesCompleted.toString()],
    ["Games Abandoned", stats.gamesAbandoned.toString()],
    ["Completion Rate", `${stats.completionRate.toFixed(1)}%`],
    ["Average Score", stats.averageScore.toFixed(1)],
    ["Average Moves", stats.averageMoves.toFixed(1)],
    ["Average Time Remaining", `${stats.averageTimeRemaining.toFixed(0)}s`],
    ["Highest Score", highestScoreDisplay],
    ["Highest Score User", highestUserDisplay],
    ["Highest Score Completed At", highestCompletedAtDisplay],
    [],
    ["Game", "Started", "Completed", "Avg Score"],
    ...Object.entries(stats.gamesByGameId).map(([gameId, data]) => [
      gameId,
      data.started.toString(),
      data.completed.toString(),
      data.avgScore.toFixed(1),
    ]),
    [],
    ["Games by Result", "", ""],
    ["Game", "Score Range", "Count"],
    ...Object.keys(stats.gamesByResult)
      .sort()
      .flatMap((gameId) =>
        stats.gamesByResult[gameId].length > 0
          ? stats.gamesByResult[gameId].map((row) => [
              gameId,
              row.range,
              row.count.toString(),
            ])
          : [[gameId, "No scored completions", "0"]]
      ),
    [],
    ["Date", "Started", "Completed"],
    ...stats.eventsByDate.map((d) => [d.date, d.started.toString(), d.completed.toString()]),
  ];

  return csvData.map((row) => row.join(",")).join("\n");
}

export function exportStatsToCsv(stats: GameStats): void {
  const csvContent = serializeGameAnalyticsCsv(stats);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `game-analytics-${new Date().toISOString().split("T")[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
