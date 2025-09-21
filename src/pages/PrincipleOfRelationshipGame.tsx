import React, { useState } from "react";
import { GameMenu, PairMatchingGame } from "../components";
import { GameConfig } from "../types";

// Words for the Principle of Relationship cards
const relationshipWords = [
  "Communication",
  "Respect",
  "Trust",
  "Honest",
  "Equality",
  "Boundaries",
];

// Game settings for Principle of Relationship game
const relationshipGameConfig: GameConfig = { pairs: 6, gridCols: 3, time: 90 };

const gameTitle = "Social Wellbeing\nThe Principle of Relationship Game";
const gameDescription = "Match the relationship principles and learn while you play!";

export function PrincipleOfRelationshipGame(): React.JSX.Element {
  const [currentView, setCurrentView] = useState<"menu" | "game">("menu");

  const handleStartGame = (): void => {
    setCurrentView("game");
  };

  const handleBackToMenu = (): void => {
    setCurrentView("menu");
  };

  return (
    <div>
      {currentView === "menu" && (
        <GameMenu
          onStartGame={handleStartGame}
          title={gameTitle}
          description={gameDescription}
        />
      )}
      {currentView === "game" && (
        <PairMatchingGame
          onBackToMenu={handleBackToMenu}
          words={relationshipWords}
          gameConfig={relationshipGameConfig}
          title="Social Wellbeing - The Principle of Relationship Game"
        />
      )}
    </div>
  );
}