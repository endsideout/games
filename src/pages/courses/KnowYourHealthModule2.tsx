import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

export function KnowYourHealthModule2(): React.JSX.Element {
  const games = [
    {
      name: "Added vs. Natural Sugar",
      icon: "🍃🍬",
      description: "Each round asks a different question — natural sugar, added sugar, eat more or less? 5 rounds, 2 minutes!",
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-800",
      buttonColor: "from-purple-500 to-pink-500",
      route: "/least-sugar-game",
    },
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{ background: "linear-gradient(135deg, #fdf4ff 0%, #fce7f3 40%, #ede9fe 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-300 inline-block">
            <div className="flex items-center justify-center mb-3">
              <Logo size="md" className="mr-4" />
              <div className="text-left">
                <p className="text-sm font-bold text-purple-600 uppercase tracking-widest">Know Your Health</p>
                <h1 className="text-3xl font-black text-gray-800">Module 2</h1>
              </div>
            </div>
            <p className="text-gray-600 text-base">Learn about sugar and making smarter food choices!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <Link
              key={index}
              to={game.route}
              className={`bg-gradient-to-br ${game.color} rounded-2xl p-6 border-4 ${game.borderColor} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 block`}
            >
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
          <Link
            to="/know-your-health"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            ← Back to Modules
          </Link>
        </div>
      </div>
    </div>
  );
}
