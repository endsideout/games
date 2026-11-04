import { useCallback, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { WHES_SCHOOL_CODE } from "../constants";
import type { DashboardFilters } from "../types";
import { defaultDashboardFilters } from "../types";
import { formatDateInputLocal, getEndOfDayMs, getStartOfDayMs } from "../utils/dates";
import { normalizeSchoolKey } from "../utils/normalize";

export function useDashboardFilters(isWhesReportUser: boolean): {
  filters: DashboardFilters;
  setFilters: Dispatch<SetStateAction<DashboardFilters>>;
  recentEventsSearch: string;
  userStatsSearch: string;
  selectedGames: string[];
  selectedSchool: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  gameSearchInput: string;
  recentEventsSearchInput: string;
  userStatsSearchInput: string;
  dateRangeInvalid: boolean;
  queryStartIso: string | null;
  queryEndIso: string | null;
  localDateStartMs: number | null;
  localDateEndMs: number | null;
  selectedGameSet: Set<string>;
  normalizedSelectedSchool: string | null;
  dateStartMs: number | null;
  dateEndMs: number | null;
  resetAllFilters: () => void;
  applyDatePreset: (preset: "today" | "last7" | "thisMonth" | "clear") => void;
} {
  const [filters, setFilters] = useState<DashboardFilters>(() => defaultDashboardFilters(false));
  const [recentEventsSearch, setRecentEventsSearch] = useState("");
  const [userStatsSearch, setUserStatsSearch] = useState("");

  const {
    selectedGames,
    selectedSchool,
    dateRangeStart,
    dateRangeEnd,
    gameSearchInput,
    recentEventsSearchInput,
    userStatsSearchInput,
  } = filters;

  useEffect(() => {
    if (isWhesReportUser && filters.selectedSchool !== WHES_SCHOOL_CODE) {
      setFilters((f) => ({ ...f, selectedSchool: WHES_SCHOOL_CODE }));
    }
  }, [isWhesReportUser, filters.selectedSchool]);

  const dateRangeInvalid = useMemo(() => {
    if (!dateRangeStart || !dateRangeEnd) return false;
    return getStartOfDayMs(dateRangeStart) > getEndOfDayMs(dateRangeEnd);
  }, [dateRangeStart, dateRangeEnd]);

  const queryStartIso = useMemo(() => {
    if (!dateRangeStart) return null;
    return new Date(getStartOfDayMs(dateRangeStart)).toISOString();
  }, [dateRangeStart]);

  const queryEndIso = useMemo(() => {
    if (!dateRangeEnd) return null;
    return new Date(getEndOfDayMs(dateRangeEnd)).toISOString();
  }, [dateRangeEnd]);

  const localDateStartMs = useMemo(
    () => (dateRangeStart ? getStartOfDayMs(dateRangeStart) : null),
    [dateRangeStart]
  );
  const localDateEndMs = useMemo(
    () => (dateRangeEnd ? getEndOfDayMs(dateRangeEnd) : null),
    [dateRangeEnd]
  );

  useEffect(() => {
    const timer = window.setTimeout(
      () => setRecentEventsSearch(filters.recentEventsSearchInput.trim()),
      200
    );
    return () => window.clearTimeout(timer);
  }, [filters.recentEventsSearchInput]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setUserStatsSearch(filters.userStatsSearchInput.trim()),
      200
    );
    return () => window.clearTimeout(timer);
  }, [filters.userStatsSearchInput]);

  const resetAllFilters = useCallback(() => {
    setFilters(defaultDashboardFilters(isWhesReportUser));
    setRecentEventsSearch("");
    setUserStatsSearch("");
  }, [isWhesReportUser]);

  const applyDatePreset = useCallback((preset: "today" | "last7" | "thisMonth" | "clear") => {
    const today = new Date();
    if (preset === "clear") {
      setFilters((f) => ({ ...f, dateRangeStart: "", dateRangeEnd: "" }));
      return;
    }
    if (preset === "today") {
      const d = formatDateInputLocal(today);
      setFilters((f) => ({ ...f, dateRangeStart: d, dateRangeEnd: d }));
      return;
    }
    if (preset === "last7") {
      const end = formatDateInputLocal(today);
      const startDate = new Date(today);
      startDate.setDate(startDate.getDate() - 6);
      setFilters((f) => ({
        ...f,
        dateRangeStart: formatDateInputLocal(startDate),
        dateRangeEnd: end,
      }));
      return;
    }
    if (preset === "thisMonth") {
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      setFilters((f) => ({
        ...f,
        dateRangeStart: formatDateInputLocal(startDate),
        dateRangeEnd: formatDateInputLocal(today),
      }));
    }
  }, []);

  const selectedGameSet = useMemo(() => new Set(selectedGames), [selectedGames]);
  const normalizedSelectedSchool = useMemo(() => {
    if (selectedSchool === "all") return null;
    const schoolValue = selectedSchool === "__none__" ? "" : selectedSchool;
    return normalizeSchoolKey(schoolValue);
  }, [selectedSchool]);
  const dateStartMs = useMemo(
    () => (dateRangeStart ? getStartOfDayMs(dateRangeStart) : null),
    [dateRangeStart]
  );
  const dateEndMs = useMemo(
    () => (dateRangeEnd ? getEndOfDayMs(dateRangeEnd) : null),
    [dateRangeEnd]
  );

  return {
    filters,
    setFilters,
    recentEventsSearch,
    userStatsSearch,
    selectedGames,
    selectedSchool,
    dateRangeStart,
    dateRangeEnd,
    gameSearchInput,
    recentEventsSearchInput,
    userStatsSearchInput,
    dateRangeInvalid,
    queryStartIso,
    queryEndIso,
    localDateStartMs,
    localDateEndMs,
    selectedGameSet,
    normalizedSelectedSchool,
    dateStartMs,
    dateEndMs,
    resetAllFilters,
    applyDatePreset,
  };
}
