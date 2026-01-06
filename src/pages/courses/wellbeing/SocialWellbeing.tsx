import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../components";

export function SocialWellbeing(): React.JSX.Element {
  const games = [
    {
      name: "Principle of Relationship Game",
      icon: "❤️",
      description: "Match relationship principles and learn the foundations of healthy relationships",
      tags: ["Communication", "Trust", "Respect", "Equality"],
      color: "from-pink-50 to-purple-50",
      borderColor: "border-pink-300",
      textColor: "text-pink-800",
      buttonColor: "from-pink-500 to-purple-600",
      route: "/principle-of-relationship-pair-matching-game"
    },
    {
      name: "Fruit & Vegetable Matching Game",
      icon: "🍎🥕",
      description: "Test your knowledge! Drag fruits and vegetables to their correct columns",
      tags: ["Fruits", "Vegetables", "Drag & Drop", "40 Seconds"],
      color: "from-green-50 to-orange-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      buttonColor: "from-green-500 to-orange-600",
      route: "/fruit-vegetable-matching-game"
    },
    {
      name: "Fruit & Veggie Quiz",
      icon: "🌳",
      description: "Choose if it's a fruit or a vegetable. Each correct answer grows your tree!",
      tags: ["Quiz", "Fun & Learn"],
      color: "from-blue-50 to-green-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      buttonColor: "from-blue-500 to-green-600",
      route: "/fruit-veggie-quiz"
    },
    {
      name: "Mental Health Challenge",
      icon: "🧠💚",
      description: "Test your emotional intelligence skills! Learn about empathy, boundaries, and mental wellness",
      tags: ["Empathy", "Boundaries", "Mental Health", "Emotional Intelligence"],
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-800",
      buttonColor: "from-purple-500 to-pink-600",
      route: "/challenge-quiz"
    }
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #4FC3F7 0%, #81C784 25%, #FFB74D 50%, #BA68C8 75%, #F06292 100%)",
        backgroundImage: `
             radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 30%),
             radial-gradient(circle at 85% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
             radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 60%),
             url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
           `,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-pink-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                Social Wellbeing Games
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl">
              Discover games designed to help you build healthy relationships, understand emotions, and develop social skills through interactive learning experiences.
            </p>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, index) => (
            <Link
              key={index}
              to={game.route}
              className={`bg-gradient-to-br ${game.color} rounded-2xl p-8 border-4 ${game.borderColor} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 block`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{game.icon}</div>
                <h3 className={`text-3xl font-bold mb-4 ${game.textColor}`}>
                  {game.name}
                </h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {game.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {game.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-white/70 text-gray-700 rounded-full text-sm font-semibold shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={`inline-block px-6 py-3 bg-gradient-to-r ${game.buttonColor} text-white text-lg font-bold rounded-full shadow-lg`}>
                  🎮 Play Now! 🎮
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation */}
        <div className="text-center mt-12 space-x-4">
          <Link
            to="/3d-wellness"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Back to 3D Wellness
          </Link>
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}