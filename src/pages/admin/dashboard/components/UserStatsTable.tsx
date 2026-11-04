import React, { type Dispatch, type SetStateAction } from "react";
import type { DashboardFilters, GameStats } from "../types";

export function UserStatsTable({
  stats,
  userStatsSearchInput,
  setFilters,
  filteredUserStatsEntries,
}: {
  stats: GameStats;
  userStatsSearchInput: string;
  setFilters: Dispatch<SetStateAction<DashboardFilters>>;
  filteredUserStatsEntries: Array<[string, GameStats["userStats"][string]]>;
}): React.JSX.Element {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-gray-200">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-800">User Statistics</h2>
        <input
          type="text"
          value={userStatsSearchInput}
          onChange={(e) => setFilters((f) => ({ ...f, userStatsSearchInput: e.target.value }))}
          placeholder="Search users, email, school..."
          className="w-full sm:w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
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
            {filteredUserStatsEntries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  {Object.keys(stats.userStats).length === 0
                    ? "No user statistics for the current filters."
                    : "No users match your search."}
                </td>
              </tr>
            ) : (
              filteredUserStatsEntries.map(([key, userData]) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
