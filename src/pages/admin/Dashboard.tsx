import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, orderBy, limit, where } from "firebase/firestore";
import { getFirestoreDb } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { Logo } from "../../components";
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

interface GameEvent {
  id: string;
  gameId: string;
  event: string;
  sessionId?: string;
  user: { email: string | null; name: string | null; school?: string | null };
  score?: number;
  moves?: number;
  timeRemaining?: number;
  timestamp: string;
  createdAt: string;
}

interface GameStats {
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
    user: { email: string | null; name: string | null; school?: string | null };
    score?: number;
    timestamp: string;
  }>;
  eventsByDate: Array<{ date: string; started: number; completed: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  userStats: Record<
    string,
    {
      email: string | null;
      name: string | null;
      school: string | null;
      gamesStarted: number;
      gamesCompleted: number;
      avgScore: number;
      totalScore: number;
    }
  >;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", "#d084d0"];

export function AdminDashboard(): React.JSX.Element {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<GameStats | null>(null);
  const [error, setError] = useState("");
  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedSchool, setSelectedSchool] = useState<string>("all");
  const [allEvents, setAllEvents] = useState<GameEvent[]>([]);

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
        const events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GameEvent[];

        setAllEvents(events);
        calculateStats(events);
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
      if (selectedGame !== "all") {
        filteredEvents = filteredEvents.filter((e) => e.gameId === selectedGame);
      }
      if (selectedSchool !== "all") {
        const schoolValue = selectedSchool === "__none__" ? "" : selectedSchool;
        filteredEvents = filteredEvents.filter(
          (e) => (e.user.school ?? "") === schoolValue
        );
      }

      const gamesStarted = filteredEvents.filter((e) => e.event === "game_started").length;
      const gamesCompleted = filteredEvents.filter((e) => e.event === "game_completed").length;
      const totalGames = gamesStarted;

      // Get unique sessionIds
      const startedSessionIds = new Set(
        filteredEvents
          .filter((e) => e.event === "game_started")
          .map((e) => e.sessionId)
          .filter(Boolean)
      );
      const completedSessionIds = new Set(
        filteredEvents
          .filter((e) => e.event === "game_completed")
          .map((e) => e.sessionId)
          .filter(Boolean)
      );
      const gamesAbandoned = Array.from(startedSessionIds).filter(
        (id) => !completedSessionIds.has(id)
      ).length;

      const completionRate = gamesStarted > 0 ? (gamesCompleted / gamesStarted) * 100 : 0;

      const completedEvents = filteredEvents.filter((e) => e.event === "game_completed");
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
          ? completedEvents.reduce((sum, e) => sum + (e.timeRemaining || 0), 0) /
            completedEvents.length
          : 0;

      // Games by gameId
      const gamesByGameId: Record<
        string,
        { started: number; completed: number; avgScore: number }
      > = {};
      filteredEvents.forEach((event) => {
        if (!gamesByGameId[event.gameId]) {
          gamesByGameId[event.gameId] = { started: 0, completed: 0, avgScore: 0 };
        }
        if (event.event === "game_started") {
          gamesByGameId[event.gameId].started++;
        } else if (event.event === "game_completed") {
          gamesByGameId[event.gameId].completed++;
        }
      });

      // Calculate average scores per game
      Object.keys(gamesByGameId).forEach((gameId) => {
        const gameCompletedEvents = completedEvents.filter((e) => e.gameId === gameId);
        if (gameCompletedEvents.length > 0) {
          gamesByGameId[gameId].avgScore =
            gameCompletedEvents.reduce((sum, e) => sum + (e.score || 0), 0) /
            gameCompletedEvents.length;
        }
      });

      // Recent events (last 20)
      const recentEvents = filteredEvents.slice(0, 20).map((e) => ({
        id: e.id,
        gameId: e.gameId,
        event: e.event,
        user: e.user,
        score: e.score,
        timestamp: e.timestamp || e.createdAt,
      }));

      // Events by date (last 7 days)
      const eventsByDate: Array<{ date: string; started: number; completed: number }> = [];
      const dateMap = new Map<string, { started: number; completed: number }>();

      filteredEvents.forEach((event) => {
        const date = new Date(event.createdAt || event.timestamp).toLocaleDateString();
        if (!dateMap.has(date)) {
          dateMap.set(date, { started: 0, completed: 0 });
        }
        const dayData = dateMap.get(date)!;
        if (event.event === "game_started") {
          dayData.started++;
        } else if (event.event === "game_completed") {
          dayData.completed++;
        }
      });

      // Get last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString();
      });

      last7Days.forEach((date) => {
        eventsByDate.push({
          date: date,
          started: dateMap.get(date)?.started || 0,
          completed: dateMap.get(date)?.completed || 0,
        });
      });

      // Score distribution
      const scoreRanges = [
        { min: 0, max: 20, label: "0-20" },
        { min: 21, max: 40, label: "21-40" },
        { min: 41, max: 60, label: "41-60" },
        { min: 61, max: 80, label: "61-80" },
        { min: 81, max: 100, label: "81-100" },
      ];

      const scoreDistribution = scoreRanges.map((range) => ({
        range: range.label,
        count: completedEvents.filter(
          (e) => (e.score || 0) >= range.min && (e.score || 0) <= range.max
        ).length,
      }));

      // User-specific stats (from filtered events so table reflects current game/school filter)
      const userStats: Record<
        string,
        {
          email: string | null;
          name: string | null;
          school: string | null;
          gamesStarted: number;
          gamesCompleted: number;
          avgScore: number;
          totalScore: number;
        }
      > = {};

      filteredEvents.forEach((event) => {
        const userKey = event.user.email || event.user.name || "anonymous";
        if (!userStats[userKey]) {
          userStats[userKey] = {
            email: event.user.email,
            name: event.user.name,
            school: event.user.school ?? null,
            gamesStarted: 0,
            gamesCompleted: 0,
            avgScore: 0,
            totalScore: 0,
          };
        }

        if (event.event === "game_started") {
          userStats[userKey].gamesStarted++;
        } else if (event.event === "game_completed") {
          userStats[userKey].gamesCompleted++;
          userStats[userKey].totalScore += event.score || 0;
        }
      });

      // Calculate average scores per user
      Object.keys(userStats).forEach((key) => {
        if (userStats[key].gamesCompleted > 0) {
          userStats[key].avgScore = userStats[key].totalScore / userStats[key].gamesCompleted;
        }
      });

      setStats({
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
        userStats,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to calculate statistics");
    }
  };

  // Recalculate stats when user filter changes
  useEffect(() => {
    if (allEvents.length > 0) {
      calculateStats(allEvents);
    }
  }, [selectedGame, selectedSchool]);

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate("/admin/login");
  };

  const exportToCSV = (): void => {
    if (!stats) return;

    const csvData: string[][] = [
      ["Metric", "Value"],
      ["Total Games Started", stats.gamesStarted.toString()],
      ["Games Completed", stats.gamesCompleted.toString()],
      ["Games Abandoned", stats.gamesAbandoned.toString()],
      ["Completion Rate", `${stats.completionRate.toFixed(1)}%`],
      ["Average Score", stats.averageScore.toFixed(1)],
      ["Average Moves", stats.averageMoves.toFixed(1)],
      ["Average Time Remaining", `${stats.averageTimeRemaining.toFixed(0)}s`],
      [],
      ["Game", "Started", "Completed", "Avg Score"],
      ...Object.entries(stats.gamesByGameId).map(([gameId, data]) => [
        gameId,
        data.started.toString(),
        data.completed.toString(),
        data.avgScore.toFixed(1),
      ]),
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
      ["Total Games Started", stats.gamesStarted],
      ["Games Completed", stats.gamesCompleted],
      ["Games Abandoned", stats.gamesAbandoned],
      ["Completion Rate", `${stats.completionRate.toFixed(1)}%`],
      ["Average Score", stats.averageScore.toFixed(1)],
      ["Average Moves", stats.averageMoves.toFixed(1)],
      ["Average Time Remaining", `${stats.averageTimeRemaining.toFixed(0)}s`],
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

    // Events by Date sheet
    const eventsData = [
      ["Date", "Started", "Completed"],
      ...stats.eventsByDate.map((d) => [d.date, d.started, d.completed]),
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(eventsData);
    XLSX.utils.book_append_sheet(wb, ws3, "Events by Date");

    // User Stats sheet
    const userData = [
      ["User", "Email", "School", "Games Started", "Games Completed", "Avg Score"],
      ...Object.entries(stats.userStats).map(([key, data]) => [
        data.name || data.email || "Anonymous",
        data.email || "",
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
      ["Timestamp", "Game", "Event", "User", "School", "Score"],
      ...stats.recentEvents.map((e) => [
        new Date(e.timestamp).toLocaleString(),
        e.gameId,
        e.event,
        e.user.name || e.user.email || "Anonymous",
        e.user.school || "",
        e.score || "",
      ]),
    ];
    const ws5 = XLSX.utils.aoa_to_sheet(recentData);
    XLSX.utils.book_append_sheet(wb, ws5, "Recent Events");

    XLSX.writeFile(wb, `game-analytics-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const uniqueGames = useMemo(() => {
    if (!stats) return [];
    return Object.keys(stats.gamesByGameId).map((gameId) => ({
      value: gameId,
      label: gameId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    }));
  }, [stats]);

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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">No data available</p>
    </div>;
  }

  // Prepare chart data
  const gamesByTypeData = Object.entries(stats.gamesByGameId).map(([gameId, data]) => ({
    name: gameId.replace(/-/g, " ").substring(0, 20),
    started: data.started,
    completed: data.completed,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full font-semibold">
                Live
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
              <div className="flex items-center gap-2">
                <label htmlFor="game-filter" className="text-sm font-medium text-gray-700">
                  Game
                </label>
                <select
                  id="game-filter"
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Games</option>
                  {uniqueGames.map((game) => (
                    <option key={game.value} value={game.value}>
                      {game.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="school-filter" className="text-sm font-medium text-gray-700">
                  School
                </label>
                <select
                  id="school-filter"
                  value={selectedSchool}
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Schools</option>
                  {uniqueSchools.map((school) => (
                    <option key={school.value} value={school.value}>
                      {school.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {selectedGame !== "all" && stats.gamesByGameId[selectedGame] && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Games Started</p>
                <p className="text-2xl font-bold text-blue-800">
                  {stats.gamesByGameId[selectedGame].started}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Games Completed</p>
                <p className="text-2xl font-bold text-green-800">
                  {stats.gamesByGameId[selectedGame].completed}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Avg Score</p>
                <p className="text-2xl font-bold text-purple-800">
                  {stats.gamesByGameId[selectedGame].avgScore.toFixed(1)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Completion Rate</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {stats.gamesByGameId[selectedGame].started > 0
                    ? (
                        (stats.gamesByGameId[selectedGame].completed /
                          stats.gamesByGameId[selectedGame].started) *
                        100
                      ).toFixed(1)
                    : 0}
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
          {/* Events Over Time */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Events Over Time (Last 7 Days)</h2>
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
          </div>

          {/* Score Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Score Distribution</h2>
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
                <Legend />
                <Bar dataKey="started" fill="#8884d8" name="Started" />
                <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Rate Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Completion Status</h2>
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
                      {gameId.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                {stats.recentEvents.map((event) => (
                  <tr key={event.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {event.gameId.replace(/-/g, " ").substring(0, 30)}...
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
                        {event.event.replace("game_", "")}
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
                ))}
              </tbody>
            </table>
          </div>
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
