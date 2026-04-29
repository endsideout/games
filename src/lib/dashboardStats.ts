import type { GameEventPayload, GameUser } from "../types";

export interface DashboardGameEvent extends Omit<GameEventPayload, "event" | "user"> {
  id: string;
  event: string;
  user: GameUser;
  createdAt: string;
}

export interface DashboardGameStats {
  totalGames: number;
  gamesStarted: number;
  gamesCompleted: number;
  gamesAbandoned: number;
  completionRate: number;
  averageScore: number;
  averageMoves: number;
  averageTimeRemaining: number;
  gamesByGameId: Record<string, { started: number; completed: number; avgScore: number }>;
  recentEvents: Array<{
    id: string;
    gameId: string;
    event: string;
    user: GameUser;
    score?: number;
    timestamp: string;
  }>;
  eventsByDate: Array<{ date: string; started: number; completed: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  highestScoreSummary: {
    score: number | null;
    userName: string | null;
    userEmail: string | null;
    completedAt: string | null;
  };
  userStats: Record<
    string,
    {
      email: string | null;
      name: string | null;
      grade: string | null;
      teacherName: string | null;
      school: string | null;
      gamesStarted: number;
      gamesCompleted: number;
      avgScore: number;
      totalScore: number;
    }
  >;
  gamesByResult: Record<string, Array<{ range: string; count: number }>>;
}

interface DashboardFilters {
  selectedGames: string[];
  selectedSchool: string;
  dateRangeStart: string;
  dateRangeEnd: string;
}

function parseLocalDateInput(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

function formatHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function normalizeGameId(value: unknown): string {
  if (typeof value !== "string") return "unknown";
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "unknown";
}

export function normalizeEventType(value: unknown): string {
  if (typeof value !== "string") return "unknown_event";
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "unknown_event";
}

export function formatGameLabel(gameId: string): string {
  return gameId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatEventLabel(eventType: string): string {
  return eventType.replace("game_", "");
}

function buildScoreDistributionFromScores(scores: number[]): Array<{ range: string; count: number }> {
  if (scores.length === 0) return [];
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  if (minScore === maxScore) {
    return [{ range: `${minScore}`, count: scores.length }];
  }
  const spread = maxScore - minScore;
  const approxBucketSize = spread <= 20 ? 5 : spread <= 50 ? 10 : 20;
  const bucketSize = Math.max(1, approxBucketSize);
  const bucketMin = Math.floor(minScore / bucketSize) * bucketSize;
  const bucketMax = Math.ceil(maxScore / bucketSize) * bucketSize;
  const buckets: { min: number; max: number; label: string }[] = [];
  for (let start = bucketMin; start <= bucketMax; start += bucketSize) {
    const end = start + bucketSize - 1;
    buckets.push({ min: start, max: end, label: `${start}-${end}` });
  }
  return buckets.map((range) => ({
    range: range.label,
    count: scores.filter((s) => s >= range.min && s <= range.max).length,
  }));
}

export function calculateDashboardStats(
  events: DashboardGameEvent[],
  filters: DashboardFilters
): DashboardGameStats {
  const { selectedGames, selectedSchool, dateRangeStart, dateRangeEnd } = filters;

  let filteredEvents = events;
  if (selectedGames.length > 0) {
    const selectedGameSet = new Set(selectedGames);
    filteredEvents = filteredEvents.filter((e) => selectedGameSet.has(e.gameId));
  }
  if (selectedSchool !== "all") {
    const schoolValue = selectedSchool === "__none__" ? "" : selectedSchool;
    const normalizedSchoolValue = schoolValue.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (e) => (e.user.school ?? "").toLowerCase() === normalizedSchoolValue
    );
  }
  if (dateRangeStart || dateRangeEnd) {
    filteredEvents = filteredEvents.filter((e) => {
      const eventDate = new Date(e.createdAt || e.timestamp);
      if (dateRangeStart) {
        const [sy, sm, sd] = dateRangeStart.split("-").map(Number);
        const start = new Date(sy, (sm || 1) - 1, sd || 1, 0, 0, 0, 0);
        if (eventDate < start) return false;
      }
      if (dateRangeEnd) {
        const [ey, em, ed] = dateRangeEnd.split("-").map(Number);
        const end = new Date(ey, (em || 1) - 1, ed || 1, 23, 59, 59, 999);
        if (eventDate > end) return false;
      }
      return true;
    });
  }

  const gamesStarted = filteredEvents.filter((e) => e.event === "game_started").length;
  const gamesCompleted = filteredEvents.filter(
    (e) => e.event === "game_completed" || e.event === "game_over"
  ).length;
  const totalGames = gamesStarted;

  const startedSessionIds = new Set(
    filteredEvents
      .filter((e) => e.event === "game_started")
      .map((e) => e.sessionId)
      .filter(Boolean)
  );
  const completedSessionIds = new Set(
    filteredEvents
      .filter((e) => e.event === "game_completed" || e.event === "game_over")
      .map((e) => e.sessionId)
      .filter(Boolean)
  );
  const gamesAbandoned = Array.from(startedSessionIds).filter((id) => !completedSessionIds.has(id))
    .length;
  const completionRate = gamesStarted > 0 ? (gamesCompleted / gamesStarted) * 100 : 0;

  const completedEvents = filteredEvents.filter(
    (e) => e.event === "game_completed" || e.event === "game_over"
  );
  const averageScore =
    completedEvents.length > 0
      ? completedEvents.reduce((sum, e) => sum + (e.score || 0), 0) / completedEvents.length
      : 0;
  const averageMoves =
    completedEvents.length > 0
      ? completedEvents.reduce((sum, e) => sum + (e.moves || 0), 0) / completedEvents.length
      : 0;
  const averageTimeRemaining =
    completedEvents.length > 0
      ? completedEvents.reduce((sum, e) => sum + (e.timeRemaining || 0), 0) / completedEvents.length
      : 0;

  let highestScoreSummary = {
    score: null as number | null,
    userName: null as string | null,
    userEmail: null as string | null,
    completedAt: null as string | null,
  };
  completedEvents.forEach((e) => {
    const score = e.score ?? null;
    if (score === null) return;
    if (highestScoreSummary.score === null || score > highestScoreSummary.score) {
      highestScoreSummary = {
        score,
        userName: e.user.name ?? null,
        userEmail: e.user.email ?? null,
        completedAt: (e.timestamp || e.createdAt) ?? null,
      };
    }
  });

  const gamesByGameId: Record<string, { started: number; completed: number; avgScore: number }> = {};
  filteredEvents.forEach((event) => {
    if (!gamesByGameId[event.gameId]) {
      gamesByGameId[event.gameId] = { started: 0, completed: 0, avgScore: 0 };
    }
    if (event.event === "game_started") {
      gamesByGameId[event.gameId].started++;
    } else if (event.event === "game_completed" || event.event === "game_over") {
      gamesByGameId[event.gameId].completed++;
    }
  });

  Object.keys(gamesByGameId).forEach((gameId) => {
    const gameCompletedEvents = completedEvents.filter((e) => e.gameId === gameId);
    if (gameCompletedEvents.length > 0) {
      gamesByGameId[gameId].avgScore =
        gameCompletedEvents.reduce((sum, e) => sum + (e.score || 0), 0) / gameCompletedEvents.length;
    }
  });

  const recentEvents = filteredEvents.slice(0, 1000).map((e) => ({
    id: e.id,
    gameId: e.gameId,
    event: e.event,
    user: e.user,
    score: e.score,
    timestamp: e.timestamp || e.createdAt,
  }));

  const eventsByDate: Array<{ date: string; started: number; completed: number }> = [];
  const selectedSingleDay =
    Boolean(dateRangeStart) && Boolean(dateRangeEnd) && dateRangeStart === dateRangeEnd;
  if (selectedSingleDay) {
    const hourMap = new Map<string, { started: number; completed: number }>();
    filteredEvents.forEach((event) => {
      const eventDate = new Date(event.createdAt || event.timestamp);
      const label = formatHourLabel(eventDate.getHours());
      if (!hourMap.has(label)) {
        hourMap.set(label, { started: 0, completed: 0 });
      }
      const hourData = hourMap.get(label)!;
      if (event.event === "game_started") hourData.started++;
      else if (event.event === "game_completed" || event.event === "game_over") hourData.completed++;
    });
    for (let hour = 0; hour < 24; hour++) {
      const label = formatHourLabel(hour);
      eventsByDate.push({
        date: label,
        started: hourMap.get(label)?.started || 0,
        completed: hourMap.get(label)?.completed || 0,
      });
    }
  } else {
    const dateMap = new Map<string, { started: number; completed: number }>();
    filteredEvents.forEach((event) => {
      const date = new Date(event.createdAt || event.timestamp).toLocaleDateString();
      if (!dateMap.has(date)) dateMap.set(date, { started: 0, completed: 0 });
      const dayData = dateMap.get(date)!;
      if (event.event === "game_started") dayData.started++;
      else if (event.event === "game_completed" || event.event === "game_over") dayData.completed++;
    });

    const dateLabels: string[] = [];
    if (dateRangeStart || dateRangeEnd) {
      const start = dateRangeStart ? parseLocalDateInput(dateRangeStart) : new Date();
      const end = dateRangeEnd ? parseLocalDateInput(dateRangeEnd) : new Date();
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      if (start <= end) {
        const cursor = new Date(start);
        while (cursor <= end) {
          dateLabels.push(cursor.toLocaleDateString());
          cursor.setDate(cursor.getDate() + 1);
        }
      }
    } else {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dateLabels.push(date.toLocaleDateString());
      }
    }
    dateLabels.forEach((date) => {
      eventsByDate.push({
        date,
        started: dateMap.get(date)?.started || 0,
        completed: dateMap.get(date)?.completed || 0,
      });
    });
  }

  const scores = completedEvents
    .map((e) => e.score)
    .filter((s): s is number => typeof s === "number" && !Number.isNaN(s));
  const scoreDistribution = buildScoreDistributionFromScores(scores);

  const gamesByResult: Record<string, Array<{ range: string; count: number }>> = {};
  Object.keys(gamesByGameId).forEach((gameId) => {
    const gameScores = completedEvents
      .filter((e) => e.gameId === gameId)
      .map((e) => e.score)
      .filter((s): s is number => typeof s === "number" && !Number.isNaN(s));
    gamesByResult[gameId] = buildScoreDistributionFromScores(gameScores);
  });

  const userStats: DashboardGameStats["userStats"] = {};
  filteredEvents.forEach((event) => {
    const userKey = event.user.email || event.user.name || "anonymous";
    if (!userStats[userKey]) {
      userStats[userKey] = {
        email: event.user.email,
        name: event.user.name,
        grade: event.user.grade ?? null,
        teacherName: event.user.teacherName ?? null,
        school: event.user.schoolName ?? event.user.school ?? null,
        gamesStarted: 0,
        gamesCompleted: 0,
        avgScore: 0,
        totalScore: 0,
      };
    }
    if (event.event === "game_started") userStats[userKey].gamesStarted++;
    else if (event.event === "game_completed" || event.event === "game_over") {
      userStats[userKey].gamesCompleted++;
      userStats[userKey].totalScore += event.score || 0;
    }
  });
  Object.keys(userStats).forEach((key) => {
    if (userStats[key].gamesCompleted > 0) {
      userStats[key].avgScore = userStats[key].totalScore / userStats[key].gamesCompleted;
    }
  });

  return {
    totalGames,
    gamesStarted,
    gamesCompleted,
    gamesAbandoned,
    completionRate,
    averageScore,
    averageMoves,
    averageTimeRemaining,
    gamesByGameId,
    recentEvents,
    eventsByDate,
    scoreDistribution,
    highestScoreSummary,
    userStats,
    gamesByResult,
  };
}

export function getHighestScoreDisplayRows(stats: DashboardGameStats): {
  highestScoreDisplay: string;
  highestUserDisplay: string;
  highestCompletedAtDisplay: string;
} {
  const highest = stats.highestScoreSummary;
  return {
    highestScoreDisplay: highest.score !== null ? highest.score.toString() : "N/A",
    highestUserDisplay:
      highest.score !== null ? highest.userName || highest.userEmail || "N/A" : "N/A",
    highestCompletedAtDisplay:
      highest.score !== null && highest.completedAt
        ? new Date(highest.completedAt).toISOString()
        : "N/A",
  };
}

export type DashboardOverviewExportRow = { label: string; excelValue: string | number };

/** Shared metric rows for CSV / Excel overview sheets. */
export function buildOverviewExportRows(stats: DashboardGameStats): DashboardOverviewExportRow[] {
  const { highestScoreDisplay, highestUserDisplay, highestCompletedAtDisplay } =
    getHighestScoreDisplayRows(stats);
  return [
    { label: "Total Games Started", excelValue: stats.gamesStarted },
    { label: "Games Completed", excelValue: stats.gamesCompleted },
    { label: "Games Abandoned", excelValue: stats.gamesAbandoned },
    { label: "Completion Rate", excelValue: `${stats.completionRate.toFixed(1)}%` },
    { label: "Average Score", excelValue: stats.averageScore.toFixed(1) },
    { label: "Average Moves", excelValue: stats.averageMoves.toFixed(1) },
    { label: "Average Time Remaining", excelValue: `${stats.averageTimeRemaining.toFixed(0)}s` },
    { label: "Highest Score", excelValue: highestScoreDisplay },
    { label: "Highest Score User", excelValue: highestUserDisplay },
    { label: "Highest Score Completed At", excelValue: highestCompletedAtDisplay },
  ];
}
