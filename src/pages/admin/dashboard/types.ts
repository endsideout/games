import { WHES_SCHOOL_CODE } from "./constants";

export interface GameEvent {
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
  schoolNormalized: string;
  createdAtMs: number;
  eventTypeNormalized: string;
  gameIdNormalized: string;
}

export interface GameStats {
  totalGames: number;
  gamesStarted: number;
  gamesCompleted: number;
  gamesAbandoned: number;
  completionRate: number;
  averageScore: number;
  averageMoves: number;
  averageTimeRemaining: number;
  gamesByGameId: Record<
    string,
    {
      started: number;
      completed: number;
      avgScore: number;
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
  /** Per-game score bucket counts (completed games with a numeric score). */
  gamesByResult: Record<string, Array<{ range: string; count: number }>>;
}

export type DashboardFilters = {
  selectedGames: string[];
  selectedSchool: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  gameSearchInput: string;
  recentEventsSearchInput: string;
  userStatsSearchInput: string;
};

export function defaultDashboardFilters(isWhesReportUser: boolean): DashboardFilters {
  return {
    selectedGames: [],
    selectedSchool: isWhesReportUser ? WHES_SCHOOL_CODE : "all",
    dateRangeStart: "",
    dateRangeEnd: "",
    gameSearchInput: "",
    recentEventsSearchInput: "",
    userStatsSearchInput: "",
  };
}

export type GameOption = { value: string; label: string };
