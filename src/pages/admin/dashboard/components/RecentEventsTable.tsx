import React, { type Dispatch, type SetStateAction } from "react";
import { RECENT_EVENTS_PAGE_SIZE } from "../constants";
import type { DashboardFilters, GameStats } from "../types";
import { formatGameLabel, formatEventLabel } from "../utils/normalize";

export function RecentEventsTable({
  stats,
  recentEventsSearchInput,
  setFilters,
  recentEventsPagination,
  setRecentEventsPage,
}: {
  stats: GameStats;
  recentEventsSearchInput: string;
  setFilters: Dispatch<SetStateAction<DashboardFilters>>;
  recentEventsPagination: {
    totalEvents: number;
    totalPages: number;
    page: number;
    start: number;
    events: GameStats["recentEvents"];
  };
  setRecentEventsPage: Dispatch<SetStateAction<number>>;
}): React.JSX.Element {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-gray-800">Recent Events</h2>
        <input
          type="text"
          value={recentEventsSearchInput}
          onChange={(e) => setFilters((f) => ({ ...f, recentEventsSearchInput: e.target.value }))}
          placeholder="Search game, event, user, school..."
          className="w-full sm:w-80 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
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
            {recentEventsPagination.totalEvents === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  {stats.recentEvents.length === 0
                    ? "No recent events for the current filters."
                    : "No events match your search."}
                </td>
              </tr>
            ) : (
              recentEventsPagination.events.map((event, index) => (
                <tr key={event.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                    {recentEventsPagination.start + index + 1}
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
              ))
            )}
          </tbody>
        </table>
      </div>
      {recentEventsPagination.totalEvents > RECENT_EVENTS_PAGE_SIZE ? (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            Showing {(recentEventsPagination.page - 1) * RECENT_EVENTS_PAGE_SIZE + 1}–
            {Math.min(
              recentEventsPagination.page * RECENT_EVENTS_PAGE_SIZE,
              recentEventsPagination.totalEvents
            )}{" "}
            of {recentEventsPagination.totalEvents} events
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRecentEventsPage((p) => Math.max(1, p - 1))}
              disabled={recentEventsPagination.page <= 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {recentEventsPagination.page} of {recentEventsPagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setRecentEventsPage((p) => Math.min(recentEventsPagination.totalPages, p + 1))
              }
              disabled={recentEventsPagination.page >= recentEventsPagination.totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      ) : recentEventsPagination.totalEvents > 0 ? (
        <p className="mt-4 text-sm text-gray-500 border-t border-gray-200 pt-4">
          {recentEventsPagination.totalEvents} event
          {recentEventsPagination.totalEvents !== 1 ? "s" : ""}
        </p>
      ) : null}
    </div>
  );
}
