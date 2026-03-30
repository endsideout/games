import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../components";

export function KnowYourHealthModule1(): React.JSX.Element {
  const games = [
    {
      name: "Fruit & Veggie Quiz",
      icon: "🌳",
      description: "Choose if it's a fruit or a vegetable. Each correct answer grows your tree!",
      color: "from-blue-50 to-green-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      buttonColor: "from-blue-500 to-green-600",
      route: "/fruit-veggie-quiz",
    },
    {
      name: "Fruit & Vegetable Matching Game",
      icon: "🍎🥕",
      description: "Test your knowledge! Drag fruits and vegetables to their correct columns",
      color: "from-green-50 to-orange-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      buttonColor: "from-green-500 to-orange-600",
      route: "/fruit-vegetable-matching-game",
    },
    {
      name: "Sometimes or Anytime?",
      icon: "🍪🥦",
      description: "Drag each food to the right group — treat foods vs. foods you can eat anytime! 2 levels available.",
      color: "from-orange-50 to-teal-50",
      borderColor: "border-orange-300",
      textColor: "text-orange-800",
      buttonColor: "from-orange-500 to-teal-500",
      route: "/sometimes-anytime-food",
    },
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #4FC3F7 0%, #81C784 25%, #FFB74D 50%, #BA68C8 75%, #F06292 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-300 inline-block">
            <div className="flex items-center justify-center mb-3">
              <Logo size="md" className="mr-4" />
              <div className="text-left">
                <p className="text-sm font-bold text-green-600 uppercase tracking-widest">Know Your Health</p>
                <h1 className="text-3xl font-black text-gray-800">Module 1</h1>
              </div>
            </div>
            <p className="text-gray-600 text-base">Explore fruits, vegetables and healthy eating basics!</p>
          </div>
        </div>

        {/* Games Grid */}
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

        {/* Back */}
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
