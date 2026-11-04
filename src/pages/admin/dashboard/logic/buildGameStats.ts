import type { GameEvent, GameStats } from "../types";
import { parseLocalDateInput, formatHourLabel } from "../utils/dates";
import { buildScoreDistributionFromScores } from "../utils/scoreBuckets";

export function buildGameStats(
  filteredEvents: GameEvent[],
  params: { dateRangeStart: string; dateRangeEnd: string }
): GameStats {
  const { dateRangeStart, dateRangeEnd } = params;
  const selectedSingleDay =
    Boolean(dateRangeStart) && Boolean(dateRangeEnd) && dateRangeStart === dateRangeEnd;

  const startedSessionIds = new Set<string>();
  const completedSessionIds = new Set<string>();
  const gameAcc = new Map<
    string,
    {
      started: number;
      completed: number;
      totalScore: number;
      scoredCount: number;
      scores: number[];
    }
  >();
  const userAcc = new Map<
    string,
    {
      email: string | null;
      name: string | null;
      grade: string | null;
      teacherName: string | null;
      school: string | null;
      gamesStarted: number;
      gamesCompleted: number;
      totalScore: number;
    }
  >();
  const dateMap = new Map<string, { started: number; completed: number }>();
  const hourMap = new Map<string, { started: number; completed: number }>();
  const completedScores: number[] = [];
  const recentEvents: GameStats["recentEvents"] = [];

  let gamesStarted = 0;
  let gamesCompleted = 0;
  let completedWithMetrics = 0;
  let totalScore = 0;
  let totalMoves = 0;
  let totalTimeRemaining = 0;
  let highestScoreSummary: GameStats["highestScoreSummary"] = {
    score: null,
    userName: null,
    userEmail: null,
    completedAt: null,
  };

  for (const event of filteredEvents) {
    const isStarted = event.eventTypeNormalized === "game_started";
    const isCompleted =
      event.eventTypeNormalized === "game_completed" || event.eventTypeNormalized === "game_over";

    if (recentEvents.length < 1000) {
      recentEvents.push({
        id: event.id,
        gameId: event.gameId,
        event: event.event,
        user: event.user,
        score: event.score,
        timestamp: event.timestamp || event.createdAt,
      });
    }

    if (isStarted) {
      gamesStarted++;
      if (event.sessionId) startedSessionIds.add(event.sessionId);
    }
    if (isCompleted) {
      gamesCompleted++;
      if (event.sessionId) completedSessionIds.add(event.sessionId);
    }

    if (isStarted || isCompleted) {
      const dateLabel = selectedSingleDay
        ? formatHourLabel(new Date(event.createdAtMs).getHours())
        : new Date(event.createdAtMs).toLocaleDateString();
      const bucketMap = selectedSingleDay ? hourMap : dateMap;
      const bucket = bucketMap.get(dateLabel) ?? { started: 0, completed: 0 };
      if (isStarted) bucket.started++;
      if (isCompleted) bucket.completed++;
      bucketMap.set(dateLabel, bucket);
    }

    const gameStats =
      gameAcc.get(event.gameIdNormalized) ??
      { started: 0, completed: 0, totalScore: 0, scoredCount: 0, scores: [] };
    if (isStarted) gameStats.started++;
    if (isCompleted) {
      gameStats.completed++;
      if (typeof event.score === "number" && !Number.isNaN(event.score)) {
        gameStats.totalScore += event.score;
        gameStats.scoredCount++;
        gameStats.scores.push(event.score);
      }
    }
    gameAcc.set(event.gameIdNormalized, gameStats);

    const userKey = event.user.email || event.user.name || "anonymous";
    const userStats =
      userAcc.get(userKey) ??
      {
        email: event.user.email,
        name: event.user.name,
        grade: event.user.grade ?? null,
        teacherName: event.user.teacherName ?? null,
        school: event.user.schoolName ?? event.user.school ?? null,
        gamesStarted: 0,
        gamesCompleted: 0,
        totalScore: 0,
      };
    if (isStarted) userStats.gamesStarted++;
    if (isCompleted) {
      userStats.gamesCompleted++;
      userStats.totalScore += event.score || 0;
    }
    userAcc.set(userKey, userStats);

    if (isCompleted) {
      completedWithMetrics++;
      totalScore += event.score || 0;
      totalMoves += event.moves || 0;
      totalTimeRemaining += event.timeRemaining || 0;

      if (typeof event.score === "number" && !Number.isNaN(event.score)) {
        completedScores.push(event.score);
        if (highestScoreSummary.score === null || event.score > highestScoreSummary.score) {
          highestScoreSummary = {
            score: event.score,
            userName: event.user.name ?? null,
            userEmail: event.user.email ?? null,
            completedAt: (event.timestamp || event.createdAt) ?? null,
          };
        }
      }
    }
  }

  const gamesAbandoned = Array.from(startedSessionIds).filter((id) => !completedSessionIds.has(id))
    .length;
  const gamesByGameId = Array.from(gameAcc.entries()).reduce<
    Record<string, { started: number; completed: number; avgScore: number }>
  >((acc, [gameId, game]) => {
    acc[gameId] = {
      started: game.started,
      completed: game.completed,
      avgScore: game.scoredCount > 0 ? game.totalScore / game.scoredCount : 0,
    };
    return acc;
  }, {});

  const gamesByResult = Array.from(gameAcc.entries()).reduce<
    Record<string, Array<{ range: string; count: number }>>
  >((acc, [gameId, game]) => {
    acc[gameId] = buildScoreDistributionFromScores(game.scores);
    return acc;
  }, {});

  const eventsByDate: Array<{ date: string; started: number; completed: number }> = [];
  if (selectedSingleDay) {
    for (let hour = 0; hour < 24; hour++) {
      const label = formatHourLabel(hour);
      eventsByDate.push({
        date: label,
        started: hourMap.get(label)?.started || 0,
        completed: hourMap.get(label)?.completed || 0,
      });
    }
  } else {
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
    for (const date of dateLabels) {
      eventsByDate.push({
        date,
        started: dateMap.get(date)?.started || 0,
        completed: dateMap.get(date)?.completed || 0,
      });
    }
  }

  const userStats = Array.from(userAcc.entries()).reduce<GameStats["userStats"]>((acc, [key, u]) => {
    acc[key] = {
      email: u.email,
      name: u.name,
      grade: u.grade,
      teacherName: u.teacherName,
      school: u.school,
      gamesStarted: u.gamesStarted,
      gamesCompleted: u.gamesCompleted,
      totalScore: u.totalScore,
      avgScore: u.gamesCompleted > 0 ? u.totalScore / u.gamesCompleted : 0,
    };
    return acc;
  }, {});

  return {
    totalGames: gamesStarted,
    gamesStarted,
    gamesCompleted,
    gamesAbandoned,
    completionRate: gamesStarted > 0 ? (gamesCompleted / gamesStarted) * 100 : 0,
    averageScore: completedWithMetrics > 0 ? totalScore / completedWithMetrics : 0,
    averageMoves: completedWithMetrics > 0 ? totalMoves / completedWithMetrics : 0,
    averageTimeRemaining:
      completedWithMetrics > 0 ? totalTimeRemaining / completedWithMetrics : 0,
    gamesByGameId,
    recentEvents,
    eventsByDate,
    scoreDistribution: buildScoreDistributionFromScores(completedScores),
    highestScoreSummary,
    userStats,
    gamesByResult,
  };
}
