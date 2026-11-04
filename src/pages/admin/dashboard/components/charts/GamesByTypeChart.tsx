import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function GamesByTypeChart({
  gamesByTypeData,
}: {
  gamesByTypeData: Array<{ name: string; started: number; completed: number }>;
}): React.JSX.Element {
  return (
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
  );
}
