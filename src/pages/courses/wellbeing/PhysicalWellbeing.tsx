import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../components";

export function PhysicalWellbeing(): React.JSX.Element {
  const games = [
    {
      title: "Fitness Fun",
      icon: "🏃",
      description: "Coming Soon! Get moving with fun exercise challenges and learn how to keep your body healthy and strong.",
      route: "#",
      color: "from-red-50 to-orange-50",
      borderColor: "border-red-300",
      buttonColor: "from-red-500 to-orange-600",
      tags: ["Exercise", "Movement", "Strength"],
      comingSoon: true
    },
    {
      title: "Healthy Plate Builder",
      icon: "🥗",
      description: "Coming Soon! Create balanced meals and learn about nutrition. Build the perfect healthy plate!",
      route: "#",
      color: "from-green-50 to-lime-50",
      borderColor: "border-green-300",
      buttonColor: "from-green-400 to-lime-500",
      tags: ["Nutrition", "Food Groups", "Healthy Eating"],
      comingSoon: true
    },
    {
      title: "Sleep Stars",
      icon: "😴",
      description: "Coming Soon! Learn about good sleep habits and why rest is important for your body and mind.",
      route: "#",
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-300",
      buttonColor: "from-blue-400 to-indigo-500",
      tags: ["Sleep", "Rest", "Healthy Habits"],
      comingSoon: true
    }
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #EF5350 0%, #FF7043 25%, #FFAB91 50%, #FF8A65 75%, #E53935 100%)",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-red-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <div className="text-6xl mr-4">💪</div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                Physical Wellbeing
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-3xl">
              Take care of your body! Learn about exercise, nutrition, and healthy habits that keep you strong and energized.
            </p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {games.map((game, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${game.color} rounded-3xl p-8 border-4 ${game.borderColor} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 relative ${
                game.comingSoon ? "opacity-75" : ""
              }`}
            >
              {game.comingSoon && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800 text-white text-sm font-bold rounded-full">
                  Coming Soon
                </div>
              )}
              <div className="text-center">
                <div className="text-7xl mb-4">{game.icon}</div>
                <h2 className="text-3xl font-black mb-4 text-red-800">
                  {game.title}
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {game.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {game.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {game.comingSoon ? (
                  <span className="inline-block px-8 py-4 bg-gray-400 text-white text-xl font-bold rounded-full shadow-lg cursor-not-allowed">
                    Coming Soon
                  </span>
                ) : (
                  <Link
                    to={game.route}
                    className={`inline-block px-8 py-4 bg-gradient-to-r ${game.buttonColor} text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
                  >
                    Play Now!
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/3d-wellness"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Wellness Dimensions
          </Link>
        </div>
      </div>
    </div>
  );
}
