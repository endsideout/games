import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { GameStats } from "../../types";

export function EventsOverTimeChart({
  eventsByDate,
  isSingleDayRange,
}: {
  eventsByDate: GameStats["eventsByDate"];
  isSingleDayRange: boolean;
}): React.JSX.Element {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {isSingleDayRange ? "Events Over Time (Hourly)" : "Events Over Time"}
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={eventsByDate}>
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
  );
}
