import * as XLSX from "xlsx";
import type { GameStats } from "../../types";

export function exportStatsToExcel(stats: GameStats): void {
  const wb = XLSX.utils.book_new();

  const highest = stats.highestScoreSummary;
  const highestScoreDisplay =
    highest.score !== null ? highest.score.toString() : "N/A";
  const highestUserDisplay =
    highest.score !== null ? highest.userName || highest.userEmail || "N/A" : "N/A";
  const highestCompletedAtDisplay =
    highest.score !== null && highest.completedAt
      ? new Date(highest.completedAt).toISOString()
      : "N/A";

  const overviewData = [
    ["Metric", "Value"],
    ["Total Games Started", stats.gamesStarted],
    ["Games Completed", stats.gamesCompleted],
    ["Games Abandoned", stats.gamesAbandoned],
    ["Completion Rate", `${stats.completionRate.toFixed(1)}%`],
    ["Average Score", stats.averageScore.toFixed(1)],
    ["Average Moves", stats.averageMoves.toFixed(1)],
    ["Average Time Remaining", `${stats.averageTimeRemaining.toFixed(0)}s`],
    ["Highest Score", highestScoreDisplay],
    ["Highest Score User", highestUserDisplay],
    ["Highest Score Completed At", highestCompletedAtDisplay],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(overviewData);
  XLSX.utils.book_append_sheet(wb, ws1, "Overview");

  const gamesData = [
    ["Game", "Started", "Completed", "Avg Score"],
    ...Object.entries(stats.gamesByGameId).map(([gameId, data]) => [
      gameId,
      data.started,
      data.completed,
      data.avgScore.toFixed(1),
    ]),
  ];
  const ws2 = XLSX.utils.aoa_to_sheet(gamesData);
  XLSX.utils.book_append_sheet(wb, ws2, "Games by Type");

  const gamesByResultData = [
    ["Game", "Score Range", "Count"],
    ...Object.keys(stats.gamesByResult)
      .sort()
      .flatMap((gameId) =>
        stats.gamesByResult[gameId].length > 0
          ? stats.gamesByResult[gameId].map((row) => [gameId, row.range, row.count])
          : [[gameId, "No scored completions", 0]]
      ),
  ];
  const wsGamesByResult = XLSX.utils.aoa_to_sheet(gamesByResultData);
  XLSX.utils.book_append_sheet(wb, wsGamesByResult, "Games by Result");

  const eventsData = [
    ["Date", "Started", "Completed"],
    ...stats.eventsByDate.map((d) => [d.date, d.started, d.completed]),
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(eventsData);
  XLSX.utils.book_append_sheet(wb, ws3, "Events by Date");

  const userData = [
    [
      "User",
      "Email",
      "Grade",
      "Teacher Name",
      "School",
      "Games Started",
      "Games Completed",
      "Avg Score",
    ],
    ...Object.entries(stats.userStats).map(([key, data]) => [
      data.name || data.email || "Anonymous",
      data.email || "",
      data.grade || "",
      data.teacherName || "",
      data.school || "",
      data.gamesStarted,
      data.gamesCompleted,
      data.avgScore.toFixed(1),
    ]),
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(userData);
  XLSX.utils.book_append_sheet(wb, ws4, "User Stats");

  const recentData = [
    ["Timestamp", "Game", "Event", "User", "Grade", "Teacher Name", "School", "Score"],
    ...stats.recentEvents.map((e) => [
      new Date(e.timestamp).toLocaleString(),
      e.gameId,
      e.event,
      e.user.name || e.user.email || "Anonymous",
      e.user.grade || "",
      e.user.teacherName || "",
      e.user.schoolName || e.user.school || "",
      e.score || "",
    ]),
  ];
  const ws5 = XLSX.utils.aoa_to_sheet(recentData);
  XLSX.utils.book_append_sheet(wb, ws5, "Recent Events");

  XLSX.writeFile(wb, `game-analytics-${new Date().toISOString().split("T")[0]}.xlsx`);
}
