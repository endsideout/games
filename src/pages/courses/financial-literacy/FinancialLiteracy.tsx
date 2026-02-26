import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../components";

export function FinancialLiteracy(): React.JSX.Element {
  const games = [
    {
      name: "Banking Word Hunt",
      icon: "🏦🔍",
      description: "Find hidden banking words in the puzzle! Learn important money vocabulary while having fun.",
      tags: ["Word Search", "Vocabulary", "2 Minutes", "5 Words"],
      color: "from-green-50 to-emerald-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      buttonColor: "from-green-500 to-emerald-600",
      route: "/banking-word-search"
    },
    {
      name: "Bank vs Credit Union",
      icon: "🏛️🤝",
      description: "Coming Soon! Learn the difference between banks and credit unions.",
      tags: ["Sorting", "Compare", "Learn"],
      color: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      buttonColor: "from-blue-400 to-cyan-500",
      route: "#",
      comingSoon: true
    },
    {
      name: "Money Journey",
      icon: "💰🛤️",
      description: "Coming Soon! See how fees eat your money when using check cashing vs banks.",
      tags: ["Scenarios", "Fees", "Smart Choices"],
      color: "from-yellow-50 to-orange-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-800",
      buttonColor: "from-yellow-400 to-orange-500",
      route: "#",
      comingSoon: true
    },
    {
      name: "Banking True or False",
      icon: "✅❌",
      description: "Coming Soon! Test your banking knowledge with fun true or false questions.",
      tags: ["Quiz", "True/False", "Learn"],
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-800",
      buttonColor: "from-purple-400 to-pink-500",
      route: "#",
      comingSoon: true
    }
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #22C55E 0%, #16A34A 25%, #15803D 50%, #166534 75%, #14532D 100%)",
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
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-green-300 inline-block">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" className="mr-4" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Financial Literacy Games
              </h1>
            </div>
            <p className="text-xl text-gray-700 max-w-2xl">
              Learn about banking, saving money, and making smart financial decisions through fun interactive games designed for young learners.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                Module 2: Basics of Banking
              </span>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">
                Grade 5 & Below
              </span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, index) => (
            <Link
              key={index}
              to={game.route}
              className={`bg-gradient-to-br ${game.color} rounded-2xl p-8 border-4 ${game.borderColor} shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 block relative ${
                game.comingSoon ? "opacity-75 cursor-not-allowed" : ""
              }`}
              onClick={(e) => game.comingSoon && e.preventDefault()}
            >
              {game.comingSoon && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gray-800 text-white text-sm font-bold rounded-full">
                  Coming Soon
                </div>
              )}
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
                <div className={`inline-block px-6 py-3 bg-gradient-to-r ${game.buttonColor} text-white text-lg font-bold rounded-full shadow-lg ${
                  game.comingSoon ? "opacity-50" : ""
                }`}>
                  {game.comingSoon ? "🔒 Coming Soon" : "🎮 Play Now! 🎮"}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Learning Objectives */}
        <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-yellow-300">
          <h2 className="text-2xl font-bold text-center text-yellow-800 mb-6">
            📚 What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-4xl mb-2">🏦</div>
              <h3 className="font-bold text-yellow-800 mb-2">What is a Bank?</h3>
              <p className="text-gray-600 text-sm">A safe place to keep your money and help it grow</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="font-bold text-green-800 mb-2">Bank vs Credit Union</h3>
              <p className="text-gray-600 text-sm">Learn the differences and similarities</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-4xl mb-2">💸</div>
              <h3 className="font-bold text-red-800 mb-2">Avoid Hidden Fees</h3>
              <p className="text-gray-600 text-sm">Why check cashing and payday loans cost more</p>
            </div>
          </div>
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
