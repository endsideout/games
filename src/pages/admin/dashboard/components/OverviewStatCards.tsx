import React from "react";
import type { GameStats } from "../types";
import { StatCard } from "./StatCard";

export function OverviewStatCards({ stats }: { stats: GameStats }): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard title="Total Games Started" value={stats.gamesStarted} icon="🎮" color="blue" />
      <StatCard title="Games Completed" value={stats.gamesCompleted} icon="✅" color="green" />
      <StatCard
        title="Completion Rate"
        value={`${stats.completionRate.toFixed(1)}%`}
        icon="📊"
        color="purple"
      />
      <StatCard title="Abandoned Games" value={stats.gamesAbandoned} icon="⏸️" color="orange" />
    </div>
  );
}
