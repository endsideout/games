import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { isStagingEnvironment } from "../../../lib/environment";
import { EventsOverTimeChart } from "./components/charts/EventsOverTimeChart";
import { ScoreDistributionChart } from "./components/charts/ScoreDistributionChart";
import { GamesByTypeChart } from "./components/charts/GamesByTypeChart";
import { CompletionStatusPieChart } from "./components/charts/CompletionStatusPieChart";
import { DashboardHeader } from "./components/DashboardHeader";
import { FiltersPanel } from "./components/FiltersPanel";
import { GamesByTypeTable } from "./components/GamesByTypeTable";
import { OverviewStatCards } from "./components/OverviewStatCards";
import { RecentEventsTable } from "./components/RecentEventsTable";
import { UserStatsTable } from "./components/UserStatsTable";
import { useDashboardDerivedData } from "./hooks/useDashboardDerivedData";
import { useDashboardFilters } from "./hooks/useDashboardFilters";
import { useGameEvents } from "./hooks/useGameEvents";

export function AdminDashboard(): React.JSX.Element {
  const stagingMode = isStagingEnvironment();
  const { user, logout, isWhesReportUser } = useAuth();
  const navigate = useNavigate();

  const filterApi = useDashboardFilters(isWhesReportUser);
  const {
    filters,
    setFilters,
    dateRangeInvalid,
    queryStartIso,
    queryEndIso,
    localDateStartMs,
    localDateEndMs,
    resetAllFilters,
    applyDatePreset,
    selectedGames,
    selectedSchool,
    dateRangeStart,
    dateRangeEnd,
    recentEventsSearchInput,
    userStatsSearchInput,
    recentEventsSearch,
    userStatsSearch,
    selectedGameSet,
    normalizedSelectedSchool,
    dateStartMs,
    dateEndMs,
    gameSearchInput,
  } = filterApi;

  const { events, loading, error, queryWarning: firestoreQueryWarning, loadProgress } =
    useGameEvents({
      queryStartIso,
      queryEndIso,
      localDateStartMs,
      localDateEndMs,
      dateRangeInvalid,
    });

  const derived = useDashboardDerivedData(events, {
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
  });

  useEffect(() => {
    document.title = stagingMode
      ? "STAGING - EndsideOut Admin Dashboard"
      : "EndsideOut Admin Dashboard";
  }, [stagingMode]);

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
          {loadProgress ? (
            <p className="text-sm text-gray-500 mt-2">
              Fetched {loadProgress.raw.toLocaleString()} documents
              {loadProgress.matched !== loadProgress.raw
                ? ` (${loadProgress.matched.toLocaleString()} in date range)`
                : ""}
              …
            </p>
          ) : null}
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

  const {
    stats,
    filteredEvents,
    uniqueSchools,
    filteredGameOptions,
    selectedGameChips,
    selectedGamesSummary,
    filteredUserStatsEntries,
    recentEventsPagination,
    setRecentEventsPage,
    handleSelectAllVisibleGames,
    handleClearVisibleGames,
    gamesByTypeData,
    isSingleDayRange,
  } = derived;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        stagingMode={stagingMode}
        userEmail={user?.email}
        stats={stats}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FiltersPanel
          allEventsCount={events.length}
          filteredEventsCount={filteredEvents.length}
          filters={filters}
          setFilters={setFilters}
          dateRangeInvalid={dateRangeInvalid}
          queryWarning={firestoreQueryWarning}
          selectedGamesSummary={selectedGamesSummary}
          filteredGameOptions={filteredGameOptions}
          selectedGameChips={selectedGameChips}
          handleSelectAllVisibleGames={handleSelectAllVisibleGames}
          handleClearVisibleGames={handleClearVisibleGames}
          isWhesReportUser={isWhesReportUser}
          resetAllFilters={resetAllFilters}
          applyDatePreset={applyDatePreset}
          uniqueSchools={uniqueSchools}
        />

        <OverviewStatCards stats={stats} />

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* <StatCard
            title="Average Score"
            value={stats.averageScore.toFixed(1)}
            icon="⭐"
            color="yellow"
          /> */}
          {/* <StatCard
            title="Average Moves"
            value={stats.averageMoves.toFixed(1)}
            icon="🎯"
            color="indigo"
          /> */}
          {/* <StatCard
            title="Avg Time Remaining"
            value={`${stats.averageTimeRemaining.toFixed(0)}s`}
            icon="⏰"
            color="pink"
          /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EventsOverTimeChart
            eventsByDate={stats.eventsByDate}
            isSingleDayRange={isSingleDayRange}
          />
          <ScoreDistributionChart scoreDistribution={stats.scoreDistribution} />
          <GamesByTypeChart gamesByTypeData={gamesByTypeData} />
          <CompletionStatusPieChart
            gamesCompleted={stats.gamesCompleted}
            gamesAbandoned={stats.gamesAbandoned}
          />
        </div>

        <GamesByTypeTable stats={stats} />

        <UserStatsTable
          stats={stats}
          userStatsSearchInput={userStatsSearchInput}
          setFilters={setFilters}
          filteredUserStatsEntries={filteredUserStatsEntries}
        />

        <RecentEventsTable
          stats={stats}
          recentEventsSearchInput={recentEventsSearchInput}
          setFilters={setFilters}
          recentEventsPagination={recentEventsPagination}
          setRecentEventsPage={setRecentEventsPage}
        />
      </main>
    </div>
  );
}
