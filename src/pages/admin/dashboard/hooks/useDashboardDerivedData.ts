import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { RECENT_EVENTS_PAGE_SIZE } from "../constants";
import type { DashboardFilters, GameEvent, GameStats, GameOption } from "../types";
import { buildGameStats } from "../logic/buildGameStats";
import { filterEvents } from "../logic/filterEvents";
import { normalizeSearchText, normalizeSchoolRaw, normalizeSchoolKey, formatGameLabel } from "../utils/normalize";

export function useDashboardDerivedData(
  allEvents: GameEvent[],
  filtersState: {
    setFilters: Dispatch<SetStateAction<DashboardFilters>>;
    recentEventsSearch: string;
    userStatsSearch: string;
    selectedGames: string[];
    selectedSchool: string;
    dateRangeStart: string;
    dateRangeEnd: string;
    gameSearchInput: string;
    selectedGameSet: Set<string>;
    normalizedSelectedSchool: string | null;
    dateStartMs: number | null;
    dateEndMs: number | null;
  }
): {
  filteredEvents: GameEvent[];
  stats: GameStats;
  uniqueGames: GameOption[];
  uniqueSchools: GameOption[];
  filteredGameOptions: GameOption[];
  selectedGameChips: GameOption[];
  selectedGamesSummary: {
    started: number;
    completed: number;
    avgScore: number;
    completionRate: number;
  } | null;
  filteredRecentEvents: GameStats["recentEvents"];
  filteredUserStatsEntries: Array<[string, GameStats["userStats"][string]]>;
  recentEventsPagination: {
    totalEvents: number;
    totalPages: number;
    page: number;
    start: number;
    events: GameStats["recentEvents"];
  };
  recentEventsPage: number;
  setRecentEventsPage: Dispatch<SetStateAction<number>>;
  handleSelectAllVisibleGames: () => void;
  handleClearVisibleGames: () => void;
  gamesByTypeData: Array<{ name: string; started: number; completed: number }>;
  isSingleDayRange: boolean;
} {
  const {
    setFilters,
    recentEventsSearch,
    userStatsSearch,
    selectedGames,
    selectedSchool,
    dateRangeStart,
    dateRangeEnd,
    gameSearchInput,
    selectedGameSet,
    normalizedSelectedSchool,
    dateStartMs,
    dateEndMs,
  } = filtersState;

  const filteredEvents = useMemo(
    () =>
      filterEvents(allEvents, {
        selectedGameSet,
        normalizedSelectedSchool,
        dateStartMs,
        dateEndMs,
      }),
    [allEvents, selectedGameSet, normalizedSelectedSchool, dateStartMs, dateEndMs]
  );

  const stats = useMemo(
    () => buildGameStats(filteredEvents, { dateRangeStart, dateRangeEnd }),
    [filteredEvents, dateRangeStart, dateRangeEnd]
  );

  const uniqueGames = useMemo(() => {
    let events = allEvents;
    if (selectedSchool !== "all") {
      const schoolValue = selectedSchool === "__none__" ? "" : selectedSchool;
      const normalizedSchoolValue = normalizeSchoolKey(schoolValue);
      events = events.filter((e) => e.schoolNormalized === normalizedSchoolValue);
    }
    const ids = new Set(events.map((e) => e.gameIdNormalized));
    return Array.from(ids)
      .sort()
      .map((gameId) => ({
        value: gameId,
        label: formatGameLabel(gameId),
      }));
  }, [allEvents, selectedSchool]);

  useEffect(() => {
    const valid = new Set(uniqueGames.map((g) => g.value));
    setFilters((prev) => {
      const nextGames = prev.selectedGames.filter((id) => valid.has(id));
      if (nextGames.length === prev.selectedGames.length) return prev;
      return { ...prev, selectedGames: nextGames };
    });
  }, [uniqueGames, setFilters]);

  const [recentEventsPage, setRecentEventsPage] = useState(1);

  useEffect(() => {
    setRecentEventsPage(1);
  }, [selectedGames, selectedSchool, dateRangeStart, dateRangeEnd, recentEventsSearch]);

  const selectedGamesSummary = useMemo(() => {
    if (selectedGames.length === 0) return null;

    let started = 0;
    let completed = 0;
    let weightedScoreSum = 0;
    selectedGames.forEach((gameId) => {
      const gameStats = stats.gamesByGameId[gameId];
      if (!gameStats) return;
      started += gameStats.started;
      completed += gameStats.completed;
      weightedScoreSum += gameStats.avgScore * gameStats.completed;
    });

    const avgScore = completed > 0 ? weightedScoreSum / completed : 0;
    const completionRate = started > 0 ? (completed / started) * 100 : 0;

    return { started, completed, avgScore, completionRate };
  }, [stats, selectedGames]);

  const uniqueSchools = useMemo(() => {
    const byNormalized = new Map<string, string>();
    allEvents.forEach((e) => {
      const raw = normalizeSchoolRaw(e.user.school ?? e.user.schoolName ?? "");
      const key = raw ? normalizeSchoolKey(raw) : "__none__";
      if (!byNormalized.has(key)) {
        byNormalized.set(key, raw || "__none__");
      }
    });
    return Array.from(byNormalized.entries())
      .filter(([key]) => key !== "__none__")
      .map(([, display]) => ({
        value: display,
        label: display === "__none__" ? "(No school)" : display,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allEvents]);

  const gameOptionsByValue = useMemo(() => {
    return new Map(uniqueGames.map((game) => [game.value, game.label]));
  }, [uniqueGames]);

  const filteredGameOptions = useMemo(() => {
    const q = normalizeSearchText(gameSearchInput);
    if (!q) return uniqueGames;
    return uniqueGames.filter(
      (game) =>
        normalizeSearchText(game.label).includes(q) || normalizeSearchText(game.value).includes(q)
    );
  }, [uniqueGames, gameSearchInput]);

  const handleSelectAllVisibleGames = useCallback(() => {
    const visible = filteredGameOptions.map((g) => g.value);
    setFilters((f) => ({
      ...f,
      selectedGames: Array.from(new Set([...f.selectedGames, ...visible])),
    }));
  }, [filteredGameOptions, setFilters]);

  const handleClearVisibleGames = useCallback(() => {
    const visible = new Set(filteredGameOptions.map((g) => g.value));
    setFilters((f) => ({
      ...f,
      selectedGames: f.selectedGames.filter((id) => !visible.has(id)),
    }));
  }, [filteredGameOptions, setFilters]);

  const selectedGameChips = useMemo(() => {
    return selectedGames.map((id) => ({
      value: id,
      label: gameOptionsByValue.get(id) ?? formatGameLabel(id),
    }));
  }, [selectedGames, gameOptionsByValue]);

  const filteredRecentEvents = useMemo(() => {
    const query = recentEventsSearch.toLowerCase();
    if (!query) return stats.recentEvents;
    return stats.recentEvents.filter((event) => {
      const school = event.user.school ?? event.user.schoolName ?? "";
      const haystack = [
        event.gameId,
        event.event,
        event.user.name ?? "",
        event.user.email ?? "",
        school,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [stats, recentEventsSearch]);

  const filteredUserStatsEntries = useMemo(() => {
    const entries = Object.entries(stats.userStats);
    const query = userStatsSearch.toLowerCase();
    const filtered = query
      ? entries.filter(([_, userData]) => {
          const haystack = [
            userData.name ?? "",
            userData.email ?? "",
            userData.school ?? "",
            userData.teacherName ?? "",
            userData.grade ?? "",
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(query);
        })
      : entries;
    return filtered.sort((a, b) => b[1].gamesStarted - a[1].gamesStarted);
  }, [stats, userStatsSearch]);

  const recentEventsPagination = useMemo(() => {
    const totalEvents = filteredRecentEvents.length;
    const totalPages = Math.max(1, Math.ceil(totalEvents / RECENT_EVENTS_PAGE_SIZE));
    const page = Math.min(recentEventsPage, totalPages);
    const start = (page - 1) * RECENT_EVENTS_PAGE_SIZE;
    const events = filteredRecentEvents.slice(start, start + RECENT_EVENTS_PAGE_SIZE);
    return { totalEvents, totalPages, page, start, events };
  }, [filteredRecentEvents, recentEventsPage]);

  const gamesByTypeData = useMemo(
    () =>
      Object.entries(stats.gamesByGameId).map(([gameId, data]) => ({
        name: formatGameLabel(gameId).substring(0, 20),
        started: data.started,
        completed: data.completed,
      })),
    [stats.gamesByGameId]
  );

  const isSingleDayRange = Boolean(
    dateRangeStart && dateRangeEnd && dateRangeStart === dateRangeEnd
  );

  return {
    filteredEvents,
    stats,
    uniqueGames,
    uniqueSchools,
    filteredGameOptions,
    selectedGameChips,
    selectedGamesSummary,
    filteredRecentEvents,
    filteredUserStatsEntries,
    recentEventsPagination,
    recentEventsPage,
    setRecentEventsPage,
    handleSelectAllVisibleGames,
    handleClearVisibleGames,
    gamesByTypeData,
    isSingleDayRange,
  };
}
