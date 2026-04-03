import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

// ── All games in Set 1 — add new games here as modules grow ──────────────────
export const SET1_GAMES = [
  {
    number: 1,
    name: "Sometimes or Anytime?",
    description: "Drag each food to the right group — treat foods vs. foods you can eat anytime!",
    icon: "🍎🍪",
    route: "/sometimes-anytime-food",
    module: "Module 1",
    color: "from-orange-50 to-teal-50",
    border: "border-orange-300",
    text: "text-orange-800",
    btnBg: "linear-gradient(135deg, #f97316, #14b8a6)",
  },
  {
    number: 2,
    name: "Added vs. Natural Sugar",
    description: "Natural sugar or added sugar? Eat more or less? Answer different questions each round!",
    icon: "🍃🍬",
    route: "/least-sugar-game",
    module: "Module 2",
    color: "from-purple-50 to-pink-50",
    border: "border-purple-300",
    text: "text-purple-800",
    btnBg: "linear-gradient(135deg, #a855f7, #ec4899)",
  },
];

// Route suffix appended so games know to navigate back to Set 1
export const SET1_BACK_PARAM = "?from=set1";

export function KnowYourHealthSet1(): React.JSX.Element {
  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ background: "linear-gradient(135deg, #fef9c3 0%, #d1fae5 40%, #ede9fe 100%)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-yellow-300 inline-block">
            <Logo size="md" className="mx-auto mb-3" />
            <div className="text-5xl mb-2">🎯</div>
            <h1 className="text-4xl font-black text-gray-800 mb-1">Set 1</h1>
            <p className="text-gray-500 text-sm">Play all games in order — no jumping around!</p>
            <div className="flex justify-center gap-4 mt-4">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-2">
                <span className="text-blue-700 font-black text-sm">{SET1_GAMES.length} Games</span>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl px-4 py-2">
                <span className="text-green-700 font-black text-sm">~10 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game grid — rectangular cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
          {SET1_GAMES.map((game) => (
            <Link
              key={game.number}
              to={`${game.route}${SET1_BACK_PARAM}`}
              className={`bg-gradient-to-br ${game.color} rounded-3xl border-4 ${game.border} shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex flex-col items-center text-center p-6`}
            >
              {/* Number badge */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm shadow mb-3 self-start"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
              >
                {game.number}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4" style={{ lineHeight: 1 }}>{game.icon}</div>

              {/* Name */}
              <p className={`font-black text-base leading-snug mb-1 ${game.text}`}>{game.name}</p>

              {/* Module tag */}
              <span className="text-xs font-bold text-gray-400 bg-white/70 rounded-full px-2 py-0.5 mb-4">
                {game.module}
              </span>

              {/* Description */}
              <p className="text-gray-600 text-xs leading-snug mb-4 flex-1">{game.description}</p>

              {/* Play button */}
              <div
                className="w-full py-2 rounded-full text-white text-sm font-black shadow"
                style={{ background: game.btnBg }}
              >
                Play →
              </div>
            </Link>
          ))}
        </div>

        {/* Play All — starts from game 1 */}
        <div className="text-center space-y-3">
          <Link
            to={`${SET1_GAMES[0].route}${SET1_BACK_PARAM}`}
            className="inline-block px-10 py-5 text-white text-xl font-black rounded-full shadow-xl hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)" }}
          >
            ▶ Play All in Order
          </Link>
          <div>
            <Link to="/know-your-health" className="text-gray-500 hover:text-gray-700 font-semibold text-sm">
              ← Back to Modules
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
