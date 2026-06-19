import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../../components";
import { isStagingEnvironment } from "../../lib/environment";
import {
  GAME_FILTER_METADATA,
  MAX_SCORE_BY_GAME_ID,
  WHES_SCHOOL_CODE,
  type GameFilterMetadata,
} from "../../data/adminDashboard";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GameEvent {
  id: string;
  gameId: string;
  event: string;
  sessionId?: string;
  user: {
    email: string | null;
    name: string | null;
    grade?: string | null;
    teacherName?: string | null;
    schoolName?: string | null;
    school?: string | null;
  };
  score?: number;
  moves?: number;
  timeRemaining?: number;
  timestamp: string;
  createdAt: string;
}

interface GameStats {
  totalGames: number;
  gamesCompleted: number;
  averageScore: number | null;
  gamesByGameId: Record<
    string,
    {
      completed: number;
      avgScore: number | null;
      scoredCompletions: number;
    }
  >;
  recentEvents: Array<{
    id: string;
    gameId: string;
    event: string;
    user: {
      email: string | null;
      name: string | null;
      grade?: string | null;
      teacherName?: string | null;
      schoolName?: string | null;
      school?: string | null;
    };
    score?: number;
    timestamp: string;
  }>;
  eventsByDate: Array<{ date: string; completed: number }>;
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
      gamesCompleted: number;
      avgScore: number | null;
      scorePercentTotal: number;
      scoredCompletions: number;
    }
  >;
  /** Per-game score percentage bucket counts for games with a known max score. */
  gamesByResult: Record<string, Array<{ range: string; count: number }>>;
}

interface GameFilterOption extends GameFilterMetadata {
  value: string;
}

interface CourseFilterStyle {
  accent: string;
  badge: string;
}

const COURSE_FILTER_STYLES: Record<string, CourseFilterStyle> = {
  "Know Your Health": {
    accent: "text-green-700",
    badge: "bg-green-50 text-green-700 border-green-200",
  },
  "3D Wellness": {
    accent: "text-purple-700",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  "Financial Literacy": {
    accent: "text-emerald-700",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

const DEFAULT_COURSE_FILTER_STYLE: CourseFilterStyle = {
  accent: "text-gray-700",
  badge: "bg-gray-50 text-gray-700 border-gray-200",
};

function getCourseFilterStyle(course: string): CourseFilterStyle {
  return COURSE_FILTER_STYLES[course] ?? DEFAULT_COURSE_FILTER_STYLE;
}

/** Buckets completed-game score percentages into ranges for export and charts. */
function buildScoreDistributionFromScores(
  scores: number[]
): Array<{ range: string; count: number }> {
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
    buckets.push({
      min: start,
      max: end,
      label: `${start}-${end}`,
    });
  }
  return buckets.map((range) => ({
    range: range.label,
    count: scores.filter((s) => s >= range.min && s <= range.max).length,
  }));
}

function getScorePercentage(event: GameEvent): number | null {
  const score = event.score;
  const maxScore = MAX_SCORE_BY_GAME_ID[event.gameId];
  if (
    typeof score !== "number" ||
    Number.isNaN(score) ||
    typeof maxScore !== "number" ||
    maxScore <= 0
  ) {
    return null;
  }
  return Math.max(0, (score / maxScore) * 100);
}

function formatScorePercentage(value: number | null): string {
  return value === null ? "N/A" : `${value.toFixed(1)}%`;
}

function parseLocalDateInput(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

function formatHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function normalizeGameId(value: unknown): string {
  if (typeof value !== "string") return "unknown";
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "unknown";
}

function normalizeEventType(value: unknown): string {
  if (typeof value !== "string") return "unknown_event";
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : "unknown_event";
}

function isCompletedEvent(eventType: string): boolean {
  return eventType === "game_completed" || eventType === "game_over";
}

function formatGameLabel(gameId: string): string {
  return gameId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatEventLabel(eventType: string): string {
  return eventType.replace("game_", "");
}

function haveSameStringValues(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const bValues = new Set(b);
  return a.every((value) => bValues.has(value));
}

export function AdminDashboard(): React.JSX.Element {
  const stagingMode = isStagingEnvironment();
  const { user, logout, isWhesReportUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [error, setError] = useState("");
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [draftSelectedGames, setDraftSelectedGames] = useState<string[]>([]);
  const [draftSelectedSchools, setDraftSelectedSchools] = useState<string[]>([]);
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [isSchoolDropdownOpen, setIsSchoolDropdownOpen] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState<string>("");
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("");
  const [draftDateRangeStart, setDraftDateRangeStart] = useState<string>("");
  const [draftDateRangeEnd, setDraftDateRangeEnd] = useState<string>("");
  const [recentEventsPage, setRecentEventsPage] = useState(1);
  const [allEvents, setAllEvents] = useState<GameEvent[]>([]);

  const RECENT_EVENTS_PAGE_SIZE = 20;

  useEffect(() => {
    document.title = stagingMode
      ? "STAGING - EndsideOut Admin Dashboard"
      : "EndsideOut Admin Dashboard";
  }, [stagingMode]);

  useEffect(() => {
    if (!isWhesReportUser) return;

    if (selectedSchools.length !== 1 || selectedSchools[0] !== WHES_SCHOOL_CODE) {
      setSelectedSchools([WHES_SCHOOL_CODE]);
    }
    if (draftSelectedSchools.length !== 1 || draftSelectedSchools[0] !== WHES_SCHOOL_CODE) {
      setDraftSelectedSchools([WHES_SCHOOL_CODE]);
    }
  }, [draftSelectedSchools, isWhesReportUser, selectedSchools]);

  useEffect(() => {
    const db = getFirestoreDb();
    if (!db) {
      setError("Firebase not configured");
      setLoading(false);
      return;
    }

    // Set up real-time listener
    const eventsRef = collection(db, "game_events");
    const q = query(eventsRef, orderBy("createdAt", "desc"), limit(1000));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const events = snapshot.docs.map((doc) => {
          const data = doc.data() as Partial<GameEvent>;
          return {
            ...data,
            id: doc.id,
            gameId: normalizeGameId(data.gameId),
            event: normalizeEventType(data.event),
          };
        }) as GameEvent[];

        setAllEvents(events);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const calculateStats = (events: GameEvent[]): void => {
    try {
      // Filter by selected game and school if not "all"
      let filteredEvents = events;
      if (selectedGames.length > 0) {
        const selectedGameSet = new Set(selectedGames);
        filteredEvents = filteredEvents.filter((e) => selectedGameSet.has(e.gameId));
      }
      if (selectedSchools.length > 0) {
        const normalizedSchoolValues = new Set(
          selectedSchools.map((school) =>
            (school === "__none__" ? "" : school).toLowerCase()
          )
        );
        filteredEvents = filteredEvents.filter((e) =>
          normalizedSchoolValues.has((e.user.school ?? "").toLowerCase())
        );
      }
      // Filter by date range if set
      if (dateRangeStart || dateRangeEnd) {
        filteredEvents = filteredEvents.filter((e) => {
          const eventDate = new Date(e.createdAt || e.timestamp);

          // Build local start/end dates from yyyy-mm-dd to avoid UTC offset issues
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

      const completedEvents = filteredEvents.filter((e) => isCompletedEvent(e.event));
      const gamesCompleted = completedEvents.length;
      const totalGames = gamesCompleted;
      const scorePercentages = completedEvents
        .map(getScorePercentage)
        .filter((score): score is number => score !== null);
      const averageScore =
        scorePercentages.length > 0
          ? scorePercentages.reduce((sum, score) => sum + score, 0) /
            scorePercentages.length
          : null;

      // Highest score across completed events
      let highestScoreSummary: {
        score: number | null;
        userName: string | null;
        userEmail: string | null;
        completedAt: string | null;
      } = {
        score: null,
        userName: null,
        userEmail: null,
        completedAt: null,
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

      // Games by gameId
      const gamesByGameId: Record<
        string,
        { completed: number; avgScore: number | null; scoredCompletions: number }
      > = {};
      completedEvents.forEach((event) => {
        if (!gamesByGameId[event.gameId]) {
          gamesByGameId[event.gameId] = {
            completed: 0,
            avgScore: null,
            scoredCompletions: 0,
          };
        }
        gamesByGameId[event.gameId].completed++;
      });

      // Calculate average percentage scores per game. Variable-score games stay N/A.
      Object.keys(gamesByGameId).forEach((gameId) => {
        const gameScorePercentages = completedEvents
          .filter((e) => e.gameId === gameId)
          .map(getScorePercentage)
          .filter((score): score is number => score !== null);
        gamesByGameId[gameId].scoredCompletions = gameScorePercentages.length;
        if (gameScorePercentages.length > 0) {
          gamesByGameId[gameId].avgScore =
            gameScorePercentages.reduce((sum, score) => sum + score, 0) /
            gameScorePercentages.length;
        }
      });

      // Recent events (keep up to 1000 for pagination)
      const recentEvents = completedEvents.slice(0, 1000).map((e) => ({
        id: e.id,
        gameId: e.gameId,
        event: e.event,
        user: e.user,
        score: e.score,
        timestamp: e.timestamp || e.createdAt,
      }));

      // Events by date/hour (selected range, otherwise last 7 days)
      const eventsByDate: Array<{ date: string; completed: number }> = [];
      const selectedSingleDay =
        Boolean(dateRangeStart) && Boolean(dateRangeEnd) && dateRangeStart === dateRangeEnd;
      if (selectedSingleDay) {
        const hourMap = new Map<string, { completed: number }>();
        completedEvents.forEach((event) => {
          const eventDate = new Date(event.createdAt || event.timestamp);
          const label = formatHourLabel(eventDate.getHours());
          if (!hourMap.has(label)) {
            hourMap.set(label, { completed: 0 });
          }
          const hourData = hourMap.get(label)!;
          hourData.completed++;
        });

        for (let hour = 0; hour < 24; hour++) {
          const label = formatHourLabel(hour);
          eventsByDate.push({
            date: label,
            completed: hourMap.get(label)?.completed || 0,
          });
        }
      } else {
        const dateMap = new Map<string, { completed: number }>();
        completedEvents.forEach((event) => {
          const date = new Date(event.createdAt || event.timestamp).toLocaleDateString();
          if (!dateMap.has(date)) {
            dateMap.set(date, { completed: 0 });
          }
          const dayData = dateMap.get(date)!;
          dayData.completed++;
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
            date: date,
            completed: dateMap.get(date)?.completed || 0,
          });
        });
      }

      const scoreDistribution = buildScoreDistributionFromScores(
        scorePercentages.map((score) => Math.round(score))
      );

      const gamesByResult: Record<string, Array<{ range: string; count: number }>> = {};
      Object.keys(gamesByGameId).forEach((gameId) => {
        const gameScores = completedEvents
          .filter((e) => e.gameId === gameId)
          .map(getScorePercentage)
          .filter((score): score is number => score !== null)
          .map((score) => Math.round(score));
        gamesByResult[gameId] = buildScoreDistributionFromScores(gameScores);
      });

      // User-specific stats (from filtered events so table reflects current game/school filter)
      const userStats: Record<
        string,
        {
          email: string | null;
          name: string | null;
          grade: string | null;
          teacherName: string | null;
          school: string | null;
          gamesCompleted: number;
          avgScore: number | null;
          scorePercentTotal: number;
          scoredCompletions: number;
        }
      > = {};

      completedEvents.forEach((event) => {
        const userKey = event.user.email || event.user.name || "anonymous";
        if (!userStats[userKey]) {
          userStats[userKey] = {
            email: event.user.email,
            name: event.user.name,
            grade: event.user.grade ?? null,
            teacherName: event.user.teacherName ?? null,
            school: event.user.schoolName ?? event.user.school ?? null,
            gamesCompleted: 0,
            avgScore: null,
            scorePercentTotal: 0,
            scoredCompletions: 0,
          };
        }

        const scorePercentage = getScorePercentage(event);
        userStats[userKey].gamesCompleted++;
        if (scorePercentage !== null) {
          userStats[userKey].scorePercentTotal += scorePercentage;
          userStats[userKey].scoredCompletions++;
        }
      });

      // Calculate average percentage scores per user, excluding variable-score games.
      Object.keys(userStats).forEach((key) => {
        if (userStats[key].scoredCompletions > 0) {
          userStats[key].avgScore =
            userStats[key].scorePercentTotal / userStats[key].scoredCompletions;
        }
      });

      setStats({
        totalGames,
        gamesCompleted,
        averageScore,
        gamesByGameId,
        recentEvents,
        eventsByDate,
        scoreDistribution,
        highestScoreSummary,
        userStats,
        gamesByResult,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate statistics");
    }
  };

  // Recalculate stats when filters or data change
  useEffect(() => {
    if (allEvents.length > 0) {
      calculateStats(allEvents);
    }
  }, [selectedGames, selectedSchools, dateRangeStart, dateRangeEnd, allEvents]);

  // Reset Recent Events to page 1 when filters change
  useEffect(() => {
    setRecentEventsPage(1);
  }, [selectedGames, selectedSchools, dateRangeStart, dateRangeEnd]);

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate("/admin/login");
  };

  const exportToCSV = (): void => {
    if (!stats) return;

    const highest = stats.highestScoreSummary;
    const highestScoreDisplay =
      highest.score !== null ? highest.score.toString() : "N/A";
    const highestUserDisplay =
      highest.score !== null
        ? highest.userName || highest.userEmail || "N/A"
        : "N/A";
    const highestCompletedAtDisplay =
      highest.score !== null && highest.completedAt
        ? new Date(highest.completedAt).toISOString()
        : "N/A";

    const csvData: string[][] = [
      ["Metric", "Value"],
      ["Total Completed Games", stats.totalGames.toString()],
      ["Average Score (%)", formatScorePercentage(stats.averageScore)],
      ["Highest Score", highestScoreDisplay],
      ["Highest Score User", highestUserDisplay],
      ["Highest Score Completed At", highestCompletedAtDisplay],
      [],
      ["Game", "Completed", "Avg Score (%)"],
      ...Object.entries(stats.gamesByGameId).map(([gameId, data]) => [
        gameId,
        data.completed.toString(),
        formatScorePercentage(data.avgScore),
      ]),
      [],
      ["Games by Result", "", ""],
      ["Game", "Score % Range", "Count"],
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
      ["Date", "Completed"],
      ...stats.eventsByDate.map((d) => [d.date, d.completed.toString()]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `game-analytics-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (): void => {
    if (!stats) return;

    const wb = XLSX.utils.book_new();

    // Overview sheet
    const highest = stats.highestScoreSummary;
    const highestScoreDisplay =
      highest.score !== null ? highest.score.toString() : "N/A";
    const highestUserDisplay =
      highest.score !== null
        ? highest.userName || highest.userEmail || "N/A"
        : "N/A";
    const highestCompletedAtDisplay =
      highest.score !== null && highest.completedAt
        ? new Date(highest.completedAt).toISOString()
        : "N/A";

    const overviewData = [
      ["Metric", "Value"],
      ["Total Completed Games", stats.totalGames],
      ["Average Score (%)", formatScorePercentage(stats.averageScore)],
      ["Highest Score", highestScoreDisplay],
      ["Highest Score User", highestUserDisplay],
      ["Highest Score Completed At", highestCompletedAtDisplay],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, ws1, "Overview");

    // Games by Type sheet
    const gamesData = [
      ["Game", "Completed", "Avg Score (%)"],
      ...Object.entries(stats.gamesByGameId).map(([gameId, data]) => [
        gameId,
        data.completed,
        formatScorePercentage(data.avgScore),
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(gamesData);
    XLSX.utils.book_append_sheet(wb, ws2, "Games by Type");

    const gamesByResultData = [
      ["Game", "Score % Range", "Count"],
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

    // Events by Date sheet
    const eventsData = [
      ["Date", "Completed"],
      ...stats.eventsByDate.map((d) => [d.date, d.completed]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(eventsData);
    XLSX.utils.book_append_sheet(wb, ws3, "Events by Date");

    // User Stats sheet
    const userData = [
      ["User", "Email", "Grade", "Teacher Name", "School", "Games Completed", "Avg Score (%)"],
      ...Object.entries(stats.userStats).map(([key, data]) => [
        data.name || data.email || "Anonymous",
        data.email || "",
        data.grade || "",
        data.teacherName || "",
        data.school || "",
        data.gamesCompleted,
        formatScorePercentage(data.avgScore),
      ]),
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(userData);
    XLSX.utils.book_append_sheet(wb, ws4, "User Stats");

    // Recent Events sheet
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
  };

  // Game options must come from completed raw events, not from filtered stats — otherwise picking
  // one game removes every other game from the list and breaks multi-select.
  const uniqueGames = useMemo(() => {
    let events = allEvents.filter((event) => isCompletedEvent(event.event));
    if (draftSelectedSchools.length > 0) {
      const normalizedSchoolValues = new Set(
        draftSelectedSchools.map((school) =>
          (school === "__none__" ? "" : school).toLowerCase()
        )
      );
      events = events.filter((e) =>
        normalizedSchoolValues.has((e.user.school ?? "").toLowerCase())
      );
    }
    const ids = new Set(events.map((e) => e.gameId));
    return Array.from(ids)
      .map((gameId): GameFilterOption => {
        const metadata = GAME_FILTER_METADATA[gameId] ?? {
          course: "Other",
          module: "Unmapped",
          label: formatGameLabel(gameId),
          order: Number.MAX_SAFE_INTEGER,
        };
        return {
          value: gameId,
          ...metadata,
        };
      })
      .sort(
        (a, b) =>
          a.order - b.order ||
          a.course.localeCompare(b.course) ||
          a.module.localeCompare(b.module) ||
          a.label.localeCompare(b.label)
      );
  }, [allEvents, draftSelectedSchools]);

  const groupedGameOptions = useMemo(() => {
    const courseGroups = new Map<
      string,
      {
        course: string;
        modules: Map<string, { module: string; games: GameFilterOption[] }>;
      }
    >();

    uniqueGames.forEach((game) => {
      if (!courseGroups.has(game.course)) {
        courseGroups.set(game.course, {
          course: game.course,
          modules: new Map(),
        });
      }
      const courseGroup = courseGroups.get(game.course)!;
      if (!courseGroup.modules.has(game.module)) {
        courseGroup.modules.set(game.module, {
          module: game.module,
          games: [],
        });
      }
      courseGroup.modules.get(game.module)!.games.push(game);
    });

    return Array.from(courseGroups.values()).map((courseGroup) => ({
      course: courseGroup.course,
      modules: Array.from(courseGroup.modules.values()),
    }));
  }, [uniqueGames]);

  useEffect(() => {
    const valid = new Set(uniqueGames.map((g) => g.value));
    setDraftSelectedGames((prev) => {
      const next = prev.filter((id) => valid.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [uniqueGames]);

  const selectedGamesSummary = useMemo(() => {
    if (!stats || selectedGames.length === 0) return null;

    let completed = 0;
    let weightedScoreSum = 0;
    let scoredCompletions = 0;
    selectedGames.forEach((gameId) => {
      const gameStats = stats.gamesByGameId[gameId];
      if (!gameStats) return;
      completed += gameStats.completed;
      if (gameStats.avgScore !== null) {
        weightedScoreSum += gameStats.avgScore * gameStats.scoredCompletions;
        scoredCompletions += gameStats.scoredCompletions;
      }
    });

    const avgScore = scoredCompletions > 0 ? weightedScoreSum / scoredCompletions : null;

    return { completed, avgScore };
  }, [stats, selectedGames]);

  const uniqueSchools = useMemo(() => {
    const schools = new Set<string>();
    allEvents.filter((event) => isCompletedEvent(event.event)).forEach((e) => {
      const s = e.user.school ?? "";
      schools.add(s || "__none__");
    });
    return Array.from(schools)
      .filter((v) => v !== "__none__")
      .sort()
      .map((s) => ({ value: s, label: s }));
  }, [allEvents]);

  useEffect(() => {
    if (isWhesReportUser) return;

    const valid = new Set(uniqueSchools.map((school) => school.value));
    setDraftSelectedSchools((prev) => {
      const next = prev.filter((school) => valid.has(school));
      return next.length === prev.length ? prev : next;
    });
  }, [isWhesReportUser, uniqueSchools]);

  const schoolDropdownLabel = useMemo(() => {
    if (isWhesReportUser) return WHES_SCHOOL_CODE;
    if (draftSelectedSchools.length === 0) return "All Schools";
    if (draftSelectedSchools.length === 1) {
      return uniqueSchools.find((school) => school.value === draftSelectedSchools[0])?.label ?? draftSelectedSchools[0];
    }
    return `${draftSelectedSchools.length} schools selected`;
  }, [draftSelectedSchools, isWhesReportUser, uniqueSchools]);

  const gameFilterLabel = useMemo(() => {
    if (draftSelectedGames.length === 0) return "All Games";
    if (draftSelectedGames.length === 1) {
      return uniqueGames.find((game) => game.value === draftSelectedGames[0])?.label ?? formatGameLabel(draftSelectedGames[0]);
    }
    return `${draftSelectedGames.length} games selected`;
  }, [draftSelectedGames, uniqueGames]);

  const toggleDraftGame = (gameId: string): void => {
    setDraftSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId]
    );
  };

  const setDraftGamesForScope = (gameIds: string[], shouldSelect: boolean): void => {
    setDraftSelectedGames((prev) => {
      if (shouldSelect) {
        return Array.from(new Set([...prev, ...gameIds]));
      }

      const scope = new Set(gameIds);
      return prev.filter((id) => !scope.has(id));
    });
  };

  const hasPendingFilterChanges =
    !haveSameStringValues(selectedGames, draftSelectedGames) ||
    !haveSameStringValues(selectedSchools, draftSelectedSchools) ||
    dateRangeStart !== draftDateRangeStart ||
    dateRangeEnd !== draftDateRangeEnd;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-bold">Error loading dashboard</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {allEvents.length > 0 ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Calculating statistics...</p>
          </div>
        ) : (
          <p className="text-gray-600">No data available</p>
        )}
      </div>
    );
  }

  // Prepare chart data
  const gamesByTypeData = Object.entries(stats.gamesByGameId).map(([gameId, data]) => ({
    name: formatGameLabel(gameId).substring(0, 20),
    completed: data.completed,
  }));
  const isSingleDayRange = Boolean(dateRangeStart && dateRangeEnd && dateRangeStart === dateRangeEnd);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <h1 className="text-2xl font-bold text-gray-800">
                {stagingMode ? "STAGING Admin Dashboard" : "Admin Dashboard"}
              </h1>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-semibold">
                {stagingMode ? "Staging Live" : "Live"}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  Export CSV
                </button>
                <button
                  onClick={exportToExcel}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                >
                  Export Excel
                </button>
              </div>
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game & School Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-200">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <p className="mt-1 text-sm text-gray-500">{gameFilterLabel}</p>
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <div className="relative flex flex-col gap-2">
                  <label htmlFor="game-filter-button" className="text-sm font-medium text-gray-700">
                    Games
                  </label>
                  <button
                    id="game-filter-button"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isGameDropdownOpen}
                    aria-controls="game-filter-menu"
                    onClick={() => {
                      setIsGameDropdownOpen((open) => !open);
                      setIsSchoolDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsGameDropdownOpen(false);
                      }
                    }}
                    className="flex min-w-56 items-center justify-between gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-left text-sm text-gray-800 transition-colors hover:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  >
                    <span className="truncate">{gameFilterLabel}</span>
                    <span className="text-gray-500" aria-hidden="true">
                      {isGameDropdownOpen ? "^" : "v"}
                    </span>
                  </button>
                  {isGameDropdownOpen && (
                    <div
                      id="game-filter-menu"
                      role="listbox"
                      aria-labelledby="game-filter-button"
                      aria-multiselectable="true"
                      className="absolute left-0 top-full z-30 mt-2 w-136 max-w-[calc(100vw-2rem)] rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3 border-b border-gray-100 pb-2">
                        <div>
                          <p className="text-xs font-semibold text-gray-700">Select games</p>
                          <p className="text-xs text-gray-500">Course, module, game</p>
                        </div>
                        {draftSelectedGames.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setDraftSelectedGames([])}
                            className="text-xs font-medium text-purple-700 hover:text-purple-900"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                        {uniqueGames.length === 0 ? (
                          <span className="block rounded border border-dashed border-gray-300 p-3 text-sm text-gray-500">
                            No games in current data.
                          </span>
                        ) : (
                          groupedGameOptions.map((courseGroup) => {
                            const courseStyle = getCourseFilterStyle(courseGroup.course);
                            const courseGames = courseGroup.modules.flatMap((moduleGroup) => moduleGroup.games);
                            const courseGameIds = courseGames.map((game) => game.value);
                            const selectedCourseCount = courseGameIds.filter((id) =>
                              draftSelectedGames.includes(id)
                            ).length;
                            const allCourseSelected =
                              courseGameIds.length > 0 &&
                              selectedCourseCount === courseGameIds.length;

                            return (
                              <div key={courseGroup.course} className="rounded border border-gray-200">
                                <div className="flex items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 px-3 py-2">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <span className={`truncate text-sm font-semibold ${courseStyle.accent}`}>
                                      {courseGroup.course}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {selectedCourseCount}/{courseGameIds.length}
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDraftGamesForScope(courseGameIds, !allCourseSelected)
                                    }
                                    className="shrink-0 text-xs font-medium text-purple-700 hover:text-purple-900"
                                  >
                                    {allCourseSelected ? "Clear" : "Select all"}
                                  </button>
                                </div>
                                <div className="divide-y divide-gray-100">
                                  {courseGroup.modules.map((moduleGroup) => {
                                    const moduleGameIds = moduleGroup.games.map((game) => game.value);
                                    const selectedModuleCount = moduleGameIds.filter((id) =>
                                      draftSelectedGames.includes(id)
                                    ).length;
                                    const allModuleSelected =
                                      moduleGameIds.length > 0 &&
                                      selectedModuleCount === moduleGameIds.length;

                                    return (
                                      <div
                                        key={`${courseGroup.course}-${moduleGroup.module}`}
                                        className="px-3 py-2"
                                      >
                                        <div className="mb-1.5 flex items-center justify-between gap-2">
                                          <div className="flex min-w-0 items-center gap-2">
                                            <span className={`truncate rounded border px-2 py-0.5 text-xs font-medium ${courseStyle.badge}`}>
                                              {moduleGroup.module}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {selectedModuleCount}/{moduleGameIds.length}
                                            </span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setDraftGamesForScope(moduleGameIds, !allModuleSelected)
                                            }
                                            className="shrink-0 text-xs font-medium text-purple-700 hover:text-purple-900"
                                          >
                                            {allModuleSelected ? "Clear" : "Select"}
                                          </button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-2">
                                          {moduleGroup.games.map((game) => {
                                            const checked = draftSelectedGames.includes(game.value);

                                            return (
                                              <label
                                                key={game.value}
                                                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-gray-800 hover:bg-gray-50"
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={checked}
                                                  onChange={() => toggleDraftGame(game.value)}
                                                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                />
                                                <span className="truncate">{game.label}</span>
                                              </label>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative flex flex-col gap-2">
                  <label htmlFor="school-filter-button" className="text-sm font-medium text-gray-700">
                    Schools
                  </label>
                  <button
                    id="school-filter-button"
                    type="button"
                    disabled={isWhesReportUser}
                    aria-haspopup="listbox"
                    aria-expanded={isSchoolDropdownOpen}
                    aria-controls="school-filter-menu"
                    onClick={() => {
                      setIsSchoolDropdownOpen((open) => !open);
                      setIsGameDropdownOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        setIsSchoolDropdownOpen(false);
                      }
                    }}
                    className="flex min-w-48 items-center justify-between gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-left text-sm text-gray-800 transition-colors hover:bg-gray-50 focus:border-transparent focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <span className="truncate">{schoolDropdownLabel}</span>
                    <span className="text-gray-500" aria-hidden="true">
                      {isSchoolDropdownOpen ? "^" : "v"}
                    </span>
                  </button>
                  {isSchoolDropdownOpen && !isWhesReportUser && (
                    <div
                      id="school-filter-menu"
                      role="listbox"
                      aria-labelledby="school-filter-button"
                      aria-multiselectable="true"
                      className="absolute left-0 top-full z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-lg"
                    >
                    <div className="mb-3 flex items-center justify-between gap-3 border-b border-gray-100 pb-2">
                      <span className="text-xs font-medium text-gray-500">
                        Select one or more schools
                      </span>
                      {draftSelectedSchools.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setDraftSelectedSchools([])}
                          className="text-xs font-medium text-purple-600 hover:text-purple-800"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {uniqueSchools.length === 0 ? (
                        <span className="block text-sm text-gray-500">
                          No schools in current data.
                        </span>
                      ) : (
                        uniqueSchools.map((school) => {
                          const checked = draftSelectedSchools.includes(school.value);
                          return (
                            <label
                              key={school.value}
                              role="option"
                              aria-selected={checked}
                              className="flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm text-gray-800 hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                checked={checked}
                                onChange={() =>
                                  setDraftSelectedSchools((prev) =>
                                    prev.includes(school.value)
                                      ? prev.filter((value) => value !== school.value)
                                      : [...prev, school.value]
                                  )
                                }
                              />
                              {school.label}
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="date-start" className="text-sm font-medium text-gray-700">
                    From
                  </label>
                  <input
                    id="date-start"
                    type="date"
                    value={draftDateRangeStart}
                    onChange={(e) => setDraftDateRangeStart(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="date-end" className="text-sm font-medium text-gray-700">
                    To
                  </label>
                  <input
                    id="date-end"
                    type="date"
                    value={draftDateRangeEnd}
                    onChange={(e) => setDraftDateRangeEnd(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                {(draftDateRangeStart || draftDateRangeEnd) && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftDateRangeStart("");
                      setDraftDateRangeEnd("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Clear dates
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGames(draftSelectedGames);
                    setSelectedSchools(draftSelectedSchools);
                    setDateRangeStart(draftDateRangeStart);
                    setDateRangeEnd(draftDateRangeEnd);
                    setIsGameDropdownOpen(false);
                    setIsSchoolDropdownOpen(false);
                    setRecentEventsPage(1);
                  }}
                  disabled={!hasPendingFilterChanges}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
          {selectedGamesSummary && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Games Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {selectedGamesSummary.completed}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Avg Score (%)</p>
                <p className="text-2xl font-bold text-purple-800">
                  {formatScorePercentage(selectedGamesSummary.avgScore)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <StatCard
            title="Games Completed"
            value={stats.gamesCompleted}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Average Score (%)"
            value={formatScorePercentage(stats.averageScore)}
            icon="⭐"
            color="yellow"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events Over Time */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {isSingleDayRange ? "Events Over Time (Hourly)" : "Events Over Time"}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.eventsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Score % Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Games" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Games by Type */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Games by Type</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gamesByTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Games by Game ID */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Games by Type</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score (%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(stats.gamesByGameId).map(([gameId, data]) => (
                  <tr key={gameId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatGameLabel(gameId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatScorePercentage(data.avgScore)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Stats Table */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">User Statistics</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Games Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score (%)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(stats.userStats)
                  .sort((a, b) => b[1].gamesCompleted - a[1].gamesCompleted)
                  .map(([key, userData]) => (
                    <tr key={key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {userData.name || "Anonymous"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.email || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.school || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.gamesCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatScorePercentage(userData.avgScore)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Completed Events</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-14">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(() => {
                  const totalEvents = stats.recentEvents.length;
                  const totalPages = Math.max(1, Math.ceil(totalEvents / RECENT_EVENTS_PAGE_SIZE));
                  const page = Math.min(recentEventsPage, totalPages);
                  const start = (page - 1) * RECENT_EVENTS_PAGE_SIZE;
                  const paginatedEvents = stats.recentEvents.slice(start, start + RECENT_EVENTS_PAGE_SIZE);
                  return paginatedEvents.map((event, index) => (
                    <tr key={event.id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {start + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatGameLabel(event.gameId).substring(0, 30)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            event.event === "game_completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {formatEventLabel(event.event)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.user.name || event.user.email || "Anonymous"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.user.school ?? "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.score ?? "-"}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
          {(() => {
            const totalEvents = stats.recentEvents.length;
            const totalPages = Math.max(1, Math.ceil(totalEvents / RECENT_EVENTS_PAGE_SIZE));
            const page = Math.min(recentEventsPage, totalPages);
            return totalEvents > RECENT_EVENTS_PAGE_SIZE ? (
              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  Showing {(page - 1) * RECENT_EVENTS_PAGE_SIZE + 1}–
                  {Math.min(page * RECENT_EVENTS_PAGE_SIZE, totalEvents)} of {totalEvents} events
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRecentEventsPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRecentEventsPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : totalEvents > 0 ? (
              <p className="mt-4 text-sm text-gray-500 border-t border-gray-200 pt-4">
                {totalEvents} event{totalEvents !== 1 ? "s" : ""}
              </p>
            ) : null;
          })()}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}): React.JSX.Element {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 border-blue-300 text-blue-800",
    green: "bg-green-100 border-green-300 text-green-800",
    purple: "bg-purple-100 border-purple-300 text-purple-800",
    orange: "bg-orange-100 border-orange-300 text-orange-800",
    yellow: "bg-yellow-100 border-yellow-300 text-yellow-800",
    indigo: "bg-indigo-100 border-indigo-300 text-indigo-800",
    pink: "bg-pink-100 border-pink-300 text-pink-800",
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-6 border-2 ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
