import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

export function KnowYourHealthModule3(): React.JSX.Element {
  const games = [
    {
      name: "Help Flame-man!",
      icon: "🦸🔥",
      description: "Help our superhero Flame-man make smart choices for his brain health across 5 real-life scenarios!",
      color: "from-blue-50 to-purple-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-900",
      buttonColor: "from-blue-600 to-purple-600",
      route: "/brain-health-game",
    },
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #7c3aed 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-yellow-400 inline-block">
            <div className="flex items-center justify-center mb-3">
              <Logo size="md" className="mr-4" />
              <div className="text-left">
                <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Know Your Health</p>
                <h1 className="text-3xl font-black text-gray-800">Module 3</h1>
              </div>
            </div>
            <p className="text-gray-600 text-base">Brain health — make the right choices to keep your brain strong!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <Link key={i} to={game.route}
              className={`bg-gradient-to-br ${game.color} rounded-2xl p-6 border-4 ${game.borderColor} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 block`}>
              <div className="text-center">
                <div className="text-5xl mb-4">{game.icon}</div>
                <h3 className={`text-2xl font-bold mb-3 ${game.textColor}`}>{game.name}</h3>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">{game.description}</p>
                <div className={`inline-block px-4 py-2 bg-gradient-to-r ${game.buttonColor} text-white text-sm font-bold rounded-full shadow-lg`}>
                  🎮 Play Now!
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/know-your-health"
            className="inline-block px-8 py-4 bg-white/20 text-white text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform border-2 border-white/40">
            ← Back to Modules
          </Link>
        </div>
      </div>
    </div>
  );
}
