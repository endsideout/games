import React, { createContext, useContext, useState } from "react";
import { useGameUser } from "../context/GameUserContext";
import { gradeToMode, GameMode, MODE_INFO } from "../utils/gradeMode";
import { Logo } from "./Logo";

// ── Context so child games can read the active mode ───────────────────────────
const GameModeContext = createContext<GameMode>(1);
export function useGameMode(): GameMode { return useContext(GameModeContext); }

// ── Mode picker screen ────────────────────────────────────────────────────────
function ModePicker({ onSelect }: { onSelect: (m: GameMode) => void }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-10 px-4"
      style={{ background: "linear-gradient(135deg, #e6f3f3 0%, #f0f9ff 50%, #f5f3ff 100%)" }}
    >
      <div
        className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center"
        style={{ border: "4px solid #005d5b" }}
      >
        <Logo size="md" className="mx-auto mb-4" />
        <h1 className="text-2xl font-black mb-1" style={{ color: "#005d5b" }}>
          Choose Your Level
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Select the grade range that matches your class to get started.
        </p>

        <div className="flex flex-col gap-4">
          {([1, 2, 3] as GameMode[]).map((m) => {
            const info = MODE_INFO[m];
            return (
              <button
                key={m}
                onClick={() => onSelect(m)}
                className="w-full py-5 rounded-2xl font-black text-white text-lg shadow-lg hover:scale-105 transition-transform"
                style={{ background: info.gradient }}
              >
                {info.emoji} {info.label} — {info.grades}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────────
export function GradeModeWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useGameUser();
  const autoMode  = gradeToMode(user?.grade);
  const [mode, setMode] = useState<GameMode | null>(autoMode);

  if (!mode) {
    return <ModePicker onSelect={setMode} />;
  }

  return (
    <GameModeContext.Provider value={mode}>
      {children}
    </GameModeContext.Provider>
  );
}
