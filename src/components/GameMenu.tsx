import React from "react";
import { GameMenuProps } from "../types";

export function GameMenu({ onStartGame, title, description }: GameMenuProps): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen"
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
      <div className="text-center p-12 bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl border-8 border-yellow-300 max-w-4xl">
        <div className="flex items-center justify-start mb-6">
          <img
            src="/EndsideOutLogo.png"
            alt="Endsideout Logo"
            className="w-24 h-auto mr-8 shadow-lg"
          />
          <div className="flex-1"></div>
        </div>
        <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          {title}
        </h1>
        <p className="text-2xl text-gray-700 mb-8 font-semibold">
          {description}
        </p>

        <div className="mb-8">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-lg text-gray-600 mb-8">
            Remember where each card is before they flip back over!
            <br />
            You have 90 seconds to match all 6 pairs!
          </p>
        </div>

        <button
          onClick={onStartGame}
          className="px-12 py-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-3xl font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 border-6 border-white"
        >
          🚀 START PLAYING! 🚀
        </button>
      </div>
    </div>
  );
}