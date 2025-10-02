import React from "react";
import { Link } from "react-router-dom";

export function Home(): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
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
      <div className="text-center p-12 bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl border-8 border-yellow-300 max-w-6xl">
        <div className="flex items-center justify-start mb-6">
          <img
            src="/EndsideOutLogo.png"
            alt="Endsideout Logo"
            className="w-24 h-auto mr-8 shadow-lg"
          />
          <div className="flex-1"></div>
        </div>

        <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Social Wellbeing Games
        </h1>

        <p className="text-2xl text-gray-700 mb-12 font-semibold">
          Learn and play with engaging educational games!
        </p>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {/* Principle of Relationship Game Card */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-4 border-pink-300 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-3xl font-bold mb-4 text-purple-800">
              Principle of Relationship Game
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Match relationship principles and learn the foundations of healthy relationships through this engaging pair-matching game.
            </p>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <span className="px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-sm font-semibold">Communication</span>
              <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-semibold">Trust</span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold">Respect</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">Equality</span>
            </div>
            <Link
              to="/principle-of-relationship-pair-matching-game"
              className="inline-block px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🎮 Play Now! 🎮
            </Link>
          </div>

          {/* Fruit & Vegetable Matching Game Card */}
          <div className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-8 border-4 border-green-300 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="text-6xl mb-4">🍎🥕</div>
            <h2 className="text-3xl font-bold mb-4 text-green-800">
              Fruit & Vegetable Matching Game
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Test your knowledge! Drag fruits and vegetables to their correct columns. Race against time to get the highest score!
            </p>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold">Fruits</span>
              <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-semibold">Vegetables</span>
              <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm font-semibold">Drag & Drop</span>
              <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-semibold">40 Seconds</span>
            </div>
            <Link
              to="/fruit-vegetable-matching-game"
              className="inline-block px-8 py-4 bg-gradient-to-r from-green-500 to-orange-600 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🎮 Play Now! 🎮
            </Link>
          </div>

          {/* Future games placeholder */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-4 border-gray-300 shadow-lg opacity-75">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold mb-4 text-gray-600">
              More Games Coming Soon!
            </h2>
            <p className="text-lg text-gray-500 mb-6">
              Stay tuned for more exciting educational games that will help you learn and grow.
            </p>
            <button
              disabled
              className="px-8 py-4 bg-gray-300 text-gray-500 text-xl font-bold rounded-full shadow-lg cursor-not-allowed"
            >
              Coming Soon...
            </button>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-lg text-gray-600">
            🎯 Learn • 🎮 Play • 🌱 Grow
          </p>
        </div>
      </div>
    </div>
  );
}