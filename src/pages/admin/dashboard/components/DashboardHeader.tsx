import React from "react";
import { Logo } from "../../../../components";
import { exportStatsToCsv } from "../logic/exporters/csv";
import { exportStatsToExcel } from "../logic/exporters/excel";
import type { GameStats } from "../types";

export function DashboardHeader({
  stagingMode,
  userEmail,
  stats,
  onLogout,
}: {
  stagingMode: boolean;
  userEmail: string | undefined;
  stats: GameStats;
  onLogout: () => void | Promise<void>;
}): React.JSX.Element {
  return (
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
            <div className="flex flex-col items-end gap-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => exportStatsToCsv(stats)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                  title="Export data for the current dashboard filters"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => exportStatsToExcel(stats)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  title="Export data for the current dashboard filters"
                >
                  Export Excel
                </button>
              </div>
              <span className="text-[10px] text-gray-400 max-w-[220px] text-right leading-tight">
                Exports reflect charts and tables for the filters below.
              </span>
            </div>
            <span className="text-sm text-gray-600">{userEmail}</span>
            <button
              type="button"
              onClick={() => void onLogout()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
