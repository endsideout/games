import React from "react";

export function StatCard({
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
    blue: "bg-blue-50 border-blue-200 text-blue-900",
    green: "bg-emerald-50 border-emerald-200 text-emerald-900",
    purple: "bg-purple-50 border-purple-200 text-purple-900",
    orange: "bg-amber-50 border-amber-200 text-amber-900",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-900",
    indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
    pink: "bg-pink-50 border-pink-200 text-pink-900",
  };

  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${colorClasses[color] || colorClasses.blue}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-4xl font-semibold mt-2 leading-none">{value}</p>
        </div>
        <div className="text-3xl opacity-90">{icon}</div>
      </div>
    </div>
  );
}
