import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../../components";
import { isStagingEnvironment } from "../../lib/environment";
import {
  buildOverviewExportRows,
  calculateDashboardStats,
  formatEventLabel,
  formatGameLabel,
  normalizeEventType,
  normalizeGameId,
  type DashboardGameEvent as GameEvent,
  type DashboardGameStats as GameStats,
} from "../../lib/dashboardStats";
import { DashboardChartCard } from "./DashboardChartCard";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"];
const WHES_SCHOOL_CODE = "WHES";

export function AdminDashboard(): React.JSX.Element {
  const stagingMode = isStagingEnvironment();
  const { user, logout, isWhesReportUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [error, setError] = useState("");
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [dateRangeStart, setDateRangeStart] = useState<string>("");
  const [dateRangeEnd, setDateRangeEnd] = useState<string>("");
  const [recentEventsPage, setRecentEventsPage] = useState(1);
  const [allEvents, setAllEvents] = useState<GameEvent[]>([]);

  const RECENT_EVENTS_PAGE_SIZE = 20;

  useEffect(() => {
    document.title = stagingMode
      ? "STAGING - EndsideOut Admin Dashboard"
      : "EndsideOut Admin Dashboard";
  }, [stagingMode]);

  useEffect(() => {
    if (isWhesReportUser && selectedSchool !== WHES_SCHOOL_CODE) {
      setSelectedSchool(WHES_SCHOOL_CODE);
    }
  }, [isWhesReportUser, selectedSchool]);

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

  const calculateStats = useCallback((events: GameEvent[]): void => {
    try {
      const nextStats = calculateDashboardStats(events, {
        selectedGames,
        selectedSchool,
        dateRangeStart,
        dateRangeEnd,
      });
      setStats(nextStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate statistics");
    }
  }, [selectedGames, selectedSchool, dateRangeStart, dateRangeEnd]);

  // Recalculate stats when filters or data change
  useEffect(() => {
    if (allEvents.length > 0) {
      calculateStats(allEvents);
    }
  }, [allEvents, calculateStats]);

  // Reset Recent Events to page 1 when filters change
  useEffect(() => {
    setRecentEventsPage(1);
  }, [selectedGames, selectedSchool, dateRangeStart, dateRangeEnd]);

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate("/admin/login");
  };

  const exportToCSV = (): void => {
    if (!stats) return;

    const overviewRows = buildOverviewExportRows(stats);

    const csvData: string[][] = [
      ["Metric", "Value"],
      ...overviewRows.map((r) => [r.label, String(r.excelValue)]),
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
    const overviewData = [
      ["Metric", "Value"],
      ...buildOverviewExportRows(stats).map((r) => [r.label, r.excelValue]),
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(wb, ws1, "Overview");

    // Games by Type sheet
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

    // Events by Date sheet
    const eventsData = [
      ["Date", "Started", "Completed"],
      ...stats.eventsByDate.map((d) => [d.date, d.started, d.completed]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(eventsData);
    XLSX.utils.book_append_sheet(wb, ws3, "Events by Date");

    // User Stats sheet
    const userData = [
      ["User", "Email", "Grade", "Teacher Name", "School", "Games Started", "Games Completed", "Avg Score"],
      ...Object.entries(stats.userStats).map(([, data]) => [
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

  // Game options must come from raw events, not from filtered stats — otherwise picking one game
  // removes every other game from the list and breaks multi-select.
  const uniqueGames = useMemo(() => {
    let events = allEvents;
    if (selectedSchool !== "all") {
      const schoolValue = selectedSchool === "__none__" ? "" : selectedSchool;
      const normalizedSchoolValue = schoolValue.toLowerCase();
      events = events.filter(
        (e) => (e.user.school ?? "").toLowerCase() === normalizedSchoolValue
      );
    }
    const ids = new Set(events.map((e) => e.gameId));
    return Array.from(ids)
      .sort()
      .map((gameId) => ({
        value: gameId,
        label: formatGameLabel(gameId),
      }));
  }, [allEvents, selectedSchool]);

  useEffect(() => {
    const valid = new Set(uniqueGames.map((g) => g.value));
    setSelectedGames((prev) => {
      const next = prev.filter((id) => valid.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [uniqueGames]);

  const selectedGamesSummary = useMemo(() => {
    if (!stats || selectedGames.length === 0) return null;

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
    const schools = new Set<string>();
    allEvents.forEach((e) => {
      const s = e.user.school ?? "";
      schools.add(s || "__none__");
    });
    return Array.from(schools)
      .filter((v) => v !== "__none__")
      .sort()
      .map((s) => ({ value: s, label: s }));
  }, [allEvents]);

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
    started: data.started,
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col gap-2 sm:max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span id="game-filter-label" className="text-sm font-medium text-gray-700">
                    Games
                  </span>
                  {selectedGames.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedGames([])}
                      className="text-sm font-medium text-purple-600 hover:text-purple-800"
                    >
                      Clear selection (show all)
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Check multiple games to filter the dashboard and exports. Leave none checked to include
                  all games.
                </p>
                <div
                  id="game-filter"
                  role="group"
                  aria-labelledby="game-filter-label"
                  className="flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  {uniqueGames.length === 0 ? (
                    <span className="text-sm text-gray-500">No games in current data.</span>
                  ) : (
                    uniqueGames.map((game) => {
                      const checked = selectedGames.includes(game.value);
                      return (
                        <label
                          key={game.value}
                          className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-800"
                        >
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            checked={checked}
                            onChange={() =>
                              setSelectedGames((prev) =>
                                prev.includes(game.value)
                                  ? prev.filter((id) => id !== game.value)
                                  : [...prev, game.value]
                              )
                            }
                          />
                          {game.label}
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="school-filter" className="text-sm font-medium text-gray-700">
                  School
                </label>
                <select
                  id="school-filter"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  disabled={isWhesReportUser}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {!isWhesReportUser && <option value="all">All Schools</option>}
                  {isWhesReportUser && <option value={WHES_SCHOOL_CODE}>{WHES_SCHOOL_CODE}</option>}
                  {uniqueSchools
                    .filter((school) =>
                      isWhesReportUser
                        ? school.value.toLowerCase() !== WHES_SCHOOL_CODE.toLowerCase()
                        : true
                    )
                    .map((school) => (
                    <option key={school.value} value={school.value}>
                      {school.label}
                    </option>
                    ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="date-start" className="text-sm font-medium text-gray-700">
                  From
                </label>
                <input
                  id="date-start"
                  type="date"
                  value={dateRangeStart}
                  onChange={(e) => setDateRangeStart(e.target.value)}
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
                  value={dateRangeEnd}
                  onChange={(e) => setDateRangeEnd(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {(dateRangeStart || dateRangeEnd) && (
                <button
                  type="button"
                  onClick={() => {
                    setDateRangeStart("");
                    setDateRangeEnd("");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear dates
                </button>
              )}
            </div>
          </div>
          {selectedGamesSummary && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Games Started</p>
                <p className="text-2xl font-bold text-blue-800">
                  {selectedGamesSummary.started}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Games Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {selectedGamesSummary.completed}
                </p>
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
                  {selectedGamesSummary.completionRate.toFixed(1)}
                  %
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Games Started" value={stats.gamesStarted} icon="🎮" color="blue" />
          <StatCard
            title="Games Completed"
            value={stats.gamesCompleted}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats.completionRate.toFixed(1)}%`}
            icon="📊"
            color="purple"
          />
          <StatCard
            title="Abandoned Games"
            value={stats.gamesAbandoned}
            icon="⏸️"
            color="orange"
          />
        </div>

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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DashboardChartCard
            title={isSingleDayRange ? "Events Over Time (Hourly)" : "Events Over Time"}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.eventsByDate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="started" stroke="#8884d8" name="Started" />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </DashboardChartCard>

          <DashboardChartCard title="Score Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Games" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardChartCard>

          <DashboardChartCard title="Games by Type">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gamesByTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="started" fill="#8884d8" name="Started" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </DashboardChartCard>

          <DashboardChartCard title="Completion Status">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Completed", value: stats.gamesCompleted },
                    { name: "Abandoned", value: stats.gamesAbandoned },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent?: number }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: "Completed", value: stats.gamesCompleted },
                    { name: "Abandoned", value: stats.gamesAbandoned },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </DashboardChartCard>
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
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
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
                      {data.started}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.avgScore.toFixed(1)}
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
                    Games Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Games Completed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completion Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(stats.userStats)
                  .sort((a, b) => b[1].gamesStarted - a[1].gamesStarted)
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
                        {userData.gamesStarted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.gamesCompleted}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.avgScore.toFixed(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.gamesStarted > 0
                          ? `${((userData.gamesCompleted / userData.gamesStarted) * 100).toFixed(1)}%`
                          : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Events</h2>
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
                            event.event === "game_started"
                              ? "bg-blue-100 text-blue-800"
                              : event.event === "game_completed"
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
