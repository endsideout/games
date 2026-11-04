import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../../constants";

export function CompletionStatusPieChart({
  gamesCompleted,
  gamesAbandoned,
}: {
  gamesCompleted: number;
  gamesAbandoned: number;
}): React.JSX.Element {
  const pieData = [
    { name: "Completed", value: gamesCompleted },
    { name: "Abandoned", value: gamesAbandoned },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Completion Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: { name: string; percent?: number }) =>
              `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
