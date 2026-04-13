import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

export function KnowYourHealthModule7(): React.JSX.Element {
  const games = [
    {
      name: "Positive or Negative?",
      icon: "🪞💜",
      description: "Read statements about body image and decide if each one reflects a positive or negative attitude!",
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-400",
      textColor: "text-purple-900",
      buttonColor: "from-purple-500 to-pink-600",
      route: "/body-image-game",
    },
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #db2777 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-purple-400 inline-block">
            <div className="flex items-center justify-center mb-3">
              <Logo size="md" className="mr-4" />
              <div className="text-left">
                <p className="text-sm font-bold text-purple-600 uppercase tracking-widest">Know Your Health</p>
                <h1 className="text-3xl font-black text-gray-800">Module 7</h1>
              </div>
            </div>
            <p className="text-gray-600 text-base">Body image & self-worth — learn to celebrate and appreciate your body!</p>
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
