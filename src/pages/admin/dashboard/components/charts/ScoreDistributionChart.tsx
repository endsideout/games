import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GameStats } from "../../types";

export function ScoreDistributionChart({
  scoreDistribution,
}: {
  scoreDistribution: GameStats["scoreDistribution"];
}): React.JSX.Element {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Score Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={scoreDistribution}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" name="Games" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
