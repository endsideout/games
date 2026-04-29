import React from "react";
import { Link } from "react-router-dom";

export type WellbeingHubGame = {
  title: string;
  icon: string;
  description: string;
  route: string;
  color: string;
  borderColor: string;
  buttonColor: string;
  tags: string[];
  comingSoon?: boolean;
};

export function WellbeingGameGrid({
  games,
  gameTitleClassName,
  gameTagClassName,
}: {
  games: WellbeingHubGame[];
  gameTitleClassName: string;
  gameTagClassName: string;
}): React.JSX.Element {
  return (
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
            <h2 className={`text-3xl font-black mb-4 ${gameTitleClassName}`}>
              {game.title}
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {game.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {game.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 ${gameTagClassName} rounded-full text-sm font-semibold`}
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
  );
}

export function WellbeingDimensionsBackLink(): React.JSX.Element {
  return (
    <div className="text-center">
      <Link
        to="/3d-wellness"
        className="inline-block px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        ← Back to Wellness Dimensions
      </Link>
    </div>
  );
}
