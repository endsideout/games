import React, { type Dispatch, type SetStateAction } from "react";
import { WHES_SCHOOL_CODE } from "../constants";
import type { DashboardFilters, GameOption } from "../types";
import { normalizeSchoolKey } from "../utils/normalize";

export function FiltersPanel({
  allEventsCount,
  filteredEventsCount,
  filters,
  setFilters,
  dateRangeInvalid,
  queryWarning,
  selectedGamesSummary,
  filteredGameOptions,
  selectedGameChips,
  handleSelectAllVisibleGames,
  handleClearVisibleGames,
  isWhesReportUser,
  resetAllFilters,
  applyDatePreset,
  uniqueSchools,
}: {
  allEventsCount: number;
  filteredEventsCount: number;
  filters: DashboardFilters;
  setFilters: Dispatch<SetStateAction<DashboardFilters>>;
  dateRangeInvalid: boolean;
  queryWarning: string;
  selectedGamesSummary: {
    started: number;
    completed: number;
    avgScore: number;
    completionRate: number;
  } | null;
  filteredGameOptions: GameOption[];
  selectedGameChips: GameOption[];
  handleSelectAllVisibleGames: () => void;
  handleClearVisibleGames: () => void;
  isWhesReportUser: boolean;
  resetAllFilters: () => void;
  applyDatePreset: (preset: "today" | "last7" | "thisMonth" | "clear") => void;
  uniqueSchools: GameOption[];
}): React.JSX.Element {
  const {
    selectedGames,
    selectedSchool,
    dateRangeStart,
    dateRangeEnd,
    gameSearchInput,
  } = filters;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Filters</h2>
        <button
          type="button"
          onClick={resetAllFilters}
          className="self-start rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Reset all filters
        </button>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
        <span className="font-medium text-gray-800">Summary: </span>
        Loaded {allEventsCount.toLocaleString()} event{allEventsCount !== 1 ? "s" : ""}
        {filteredEventsCount !== allEventsCount || selectedGames.length > 0 || selectedSchool !== "all"
          ? ` · ${filteredEventsCount.toLocaleString()} match current filters`
          : null}
        {" · "}
        School:{" "}
        {selectedSchool === "all" ? "All" : selectedSchool === "__none__" ? "(No school)" : selectedSchool}
        {" · "}
        Games: {selectedGames.length === 0 ? "All" : `${selectedGames.length} selected`}
        {" · "}
        Dates:{" "}
        {dateRangeStart && dateRangeEnd
          ? `${dateRangeStart} → ${dateRangeEnd}`
          : dateRangeStart
            ? `From ${dateRangeStart}`
            : dateRangeEnd
              ? `Until ${dateRangeEnd}`
              : "All loaded data (narrow with presets or pick dates)"}
      </div>

      {dateRangeInvalid ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          The start date is after the end date. Adjust the range to load data.
        </div>
      ) : null}

      {allEventsCount === 0 && !dateRangeInvalid ? (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          No events loaded for this range. Try widening dates or clearing filters.
        </div>
      ) : null}

      {filteredEventsCount === 0 && allEventsCount > 0 && !dateRangeInvalid ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No events match the current school/game/date filters. Adjust filters to see charts and tables.
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-5">
          <label htmlFor="game-search" className="text-sm font-medium text-gray-700 block mb-1">
            Games
          </label>
          <div className="rounded-lg border border-gray-300 bg-white px-3 py-2">
            <input
              id="game-search"
              value={gameSearchInput}
              onChange={(e) => setFilters((f) => ({ ...f, gameSearchInput: e.target.value }))}
              placeholder="Search games"
              className="w-full border-none p-0 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0"
            />
          </div>
          <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2">
            {selectedGameChips.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-gray-600 px-1">
                  {selectedGameChips.length} game{selectedGameChips.length !== 1 ? "s" : ""} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedGameChips.map((game) => (
                    <button
                      key={game.value}
                      type="button"
                      onClick={() =>
                        setFilters((f) => ({
                          ...f,
                          selectedGames: f.selectedGames.filter((id) => id !== game.value),
                        }))
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100"
                    >
                      {game.label}
                      <span className="text-gray-500">×</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-500 px-1 py-1">No games selected (showing all).</p>
            )}
            <details className="mt-2">
              <summary className="cursor-pointer text-xs font-medium text-gray-600 select-none">
                Choose games
              </summary>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllVisibleGames}
                  className="text-xs font-medium text-purple-600 hover:text-purple-800 disabled:opacity-50"
                  disabled={filteredGameOptions.length === 0}
                >
                  Select all visible
                </button>
                <button
                  type="button"
                  onClick={handleClearVisibleGames}
                  className="text-xs font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  disabled={filteredGameOptions.length === 0}
                >
                  Clear visible
                </button>
              </div>
              <div className="mt-2 max-h-44 overflow-y-auto rounded-md border border-gray-200 bg-white p-2">
                {filteredGameOptions.length === 0 ? (
                  <p className="text-xs text-gray-500 px-1 py-1">No games found.</p>
                ) : (
                  filteredGameOptions.map((game) => {
                    const checked = selectedGames.includes(game.value);
                    return (
                      <label
                        key={game.value}
                        className="flex items-center gap-2 rounded px-2 py-1 text-sm text-gray-800 hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          checked={checked}
                          onChange={() =>
                            setFilters((f) => ({
                              ...f,
                              selectedGames: f.selectedGames.includes(game.value)
                                ? f.selectedGames.filter((id) => id !== game.value)
                                : [...f.selectedGames, game.value],
                            }))
                          }
                        />
                        <span>{game.label}</span>
                      </label>
                    );
                  })
                )}
              </div>
            </details>
          </div>
          {selectedGames.length > 0 && (
            <button
              type="button"
              onClick={() => setFilters((f) => ({ ...f, selectedGames: [] }))}
              className="mt-2 text-xs font-medium text-purple-600 hover:text-purple-800"
            >
              Clear selection
            </button>
          )}
        </div>

        <div className="lg:col-span-3">
          <label htmlFor="school-filter" className="text-sm font-medium text-gray-700 block mb-1">
            School
          </label>
          <select
            id="school-filter"
            value={selectedSchool}
            onChange={(e) => setFilters((f) => ({ ...f, selectedSchool: e.target.value }))}
            disabled={isWhesReportUser}
            className="h-[42px] w-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            {!isWhesReportUser && <option value="all">All Schools</option>}
            {isWhesReportUser && <option value={WHES_SCHOOL_CODE}>{WHES_SCHOOL_CODE}</option>}
            {uniqueSchools
              .filter((school) =>
                isWhesReportUser
                  ? normalizeSchoolKey(school.value) !== normalizeSchoolKey(WHES_SCHOOL_CODE)
                  : true
              )
              .map((school) => (
                <option key={school.value} value={school.value}>
                  {school.label}
                </option>
              ))}
          </select>
        </div>

        <div className="lg:col-span-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">Date Range</label>
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              type="button"
              onClick={() => applyDatePreset("today")}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("last7")}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Last 7 days
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("thisMonth")}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              This month
            </button>
            <button
              type="button"
              onClick={() => applyDatePreset("clear")}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear dates
            </button>
          </div>
          <div className="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-2">
            <span className="text-sm text-gray-600">From</span>
            <input
              id="date-start"
              type="date"
              value={dateRangeStart}
              onChange={(e) => setFilters((f) => ({ ...f, dateRangeStart: e.target.value }))}
              className="h-[42px] w-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-600">To</span>
            <input
              id="date-end"
              type="date"
              value={dateRangeEnd}
              onChange={(e) => setFilters((f) => ({ ...f, dateRangeEnd: e.target.value }))}
              className="h-[42px] w-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {selectedGamesSummary && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Games Started</p>
            <p className="text-2xl font-bold text-blue-800">{selectedGamesSummary.started}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Games Completed</p>
            <p className="text-2xl font-bold text-green-800">{selectedGamesSummary.completed}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Avg Score</p>
            <p className="text-2xl font-bold text-purple-800">
              {selectedGamesSummary.avgScore.toFixed(1)}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Completion Rate</p>
            <p className="text-2xl font-bold text-yellow-800">
              {selectedGamesSummary.completionRate.toFixed(1)}%
            </p>
          </div>
        </div>
      )}
      {queryWarning ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {queryWarning}
        </div>
      ) : null}
    </div>
  );
}
