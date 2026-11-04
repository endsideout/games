import React from "react";
import type { GameStats } from "../types";
import { formatGameLabel } from "../utils/normalize";

export function GamesByTypeTable({ stats }: { stats: GameStats }): React.JSX.Element {
  return (
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
            {Object.keys(stats.gamesByGameId).length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                  No games match the current filters.
                </td>
              </tr>
            ) : (
              Object.entries(stats.gamesByGameId).map(([gameId, data]) => (
                <tr key={gameId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatGameLabel(gameId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.started}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.completed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {data.avgScore.toFixed(1)}
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
