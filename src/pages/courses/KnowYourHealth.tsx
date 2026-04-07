import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";
import { SET1_GAMES } from "./KnowYourHealthSet1";

const MODULES = [
  { label: "Module 1", route: "/know-your-health/module-1", comingSoon: false },
  { label: "Module 2", route: "/know-your-health/module-2", comingSoon: false },
  { label: "Module 3", route: "/know-your-health/module-3", comingSoon: false },
  { label: "Module 4", route: "/know-your-health/module-4", comingSoon: false },
  { label: "Module 5", comingSoon: true },
  { label: "Module 6", comingSoon: true },
  { label: "Module 7", comingSoon: true },
];

const COLORS = [
  { bg: "from-blue-50 to-green-50",    border: "border-blue-300",   text: "text-blue-800",   btn: "from-blue-500 to-green-600",    icon: "🌱" },
  { bg: "from-green-50 to-teal-50",    border: "border-green-300",  text: "text-green-800",  btn: "from-green-500 to-teal-600",    icon: "🥗" },
  { bg: "from-orange-50 to-yellow-50", border: "border-orange-300", text: "text-orange-800", btn: "from-orange-500 to-yellow-500", icon: "🏃" },
  { bg: "from-red-50 to-pink-50",      border: "border-red-300",    text: "text-red-800",    btn: "from-red-500 to-pink-600",      icon: "🫀" },
  { bg: "from-purple-50 to-indigo-50", border: "border-purple-300", text: "text-purple-800", btn: "from-purple-500 to-indigo-600", icon: "🧠" },
  { bg: "from-cyan-50 to-blue-50",     border: "border-cyan-300",   text: "text-cyan-800",   btn: "from-cyan-500 to-blue-600",    icon: "😴" },
  { bg: "from-lime-50 to-green-50",    border: "border-lime-300",   text: "text-lime-800",   btn: "from-lime-500 to-green-600",   icon: "💪" },
];

export function KnowYourHealth(): React.JSX.Element {
  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #4FC3F7 0%, #81C784 25%, #FFB74D 50%, #BA68C8 75%, #F06292 100%)",
        backgroundImage: `
          radial-gradient(circle at 15% 20%, rgba(255,255,255,0.15) 0%, transparent 30%),
          radial-gradient(circle at 85% 80%, rgba(255,255,255,0.1) 0%, transparent 40%)
        `,
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                Know Your Health
              </h1>
            </div>
            <p className="text-gray-600 text-base max-w-xl">
              7 modules to discover everything about living a healthy life — from nutrition to fitness and beyond!
            </p>
          </div>
        </div>

        {/* Set 1 — featured playlist */}
        <div className="mb-10">
          <h2 className="text-white font-black text-2xl mb-4 text-center drop-shadow">🎯 Game Sets</h2>
          <Link
            to="/know-your-health/set-1"
            className="block bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-6 hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex items-center gap-5">
              <div
                className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)" }}
              >
                S1
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-gray-800">Set 1</h3>
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 rounded-full px-2 py-0.5">
                    {SET1_GAMES.length} games
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {SET1_GAMES.map((g, i) => (
                    <span key={i} className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5 font-semibold">
                      {i + 1}. {g.name}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="flex-shrink-0 px-5 py-3 text-white font-black rounded-full shadow-lg text-sm"
                style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
              >
                ▶ Play All
              </div>
            </div>
          </Link>
        </div>

        <h2 className="text-white font-black text-2xl mb-4 text-center drop-shadow">📚 Modules</h2>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MODULES.map((mod, i) => {
            const c = COLORS[i];
            return mod.comingSoon ? (
              <div
                key={i}
                className={`bg-gradient-to-br ${c.bg} rounded-2xl p-6 border-4 ${c.border} shadow-xl opacity-70`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{c.icon}</div>
                  <h3 className={`text-xl font-black mb-2 ${c.text}`}>{mod.label}</h3>
                  <p className="text-gray-500 text-sm mb-4">More games coming soon!</p>
                  <div className="inline-block px-4 py-2 bg-gray-300 text-gray-500 text-sm font-bold rounded-full cursor-not-allowed">
                    Coming Soon
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={i}
                to={mod.route!}
                className={`bg-gradient-to-br ${c.bg} rounded-2xl p-6 border-4 ${c.border} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 block`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{c.icon}</div>
                  <h3 className={`text-xl font-black mb-2 ${c.text}`}>{mod.label}</h3>
                  <p className="text-gray-600 text-sm mb-4">Explore games and activities!</p>
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${c.btn} text-white text-sm font-bold rounded-full shadow-lg`}>
                    🎮 Play Now!
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xl font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
