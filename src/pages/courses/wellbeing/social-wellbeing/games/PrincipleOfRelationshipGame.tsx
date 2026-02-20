import React, { useState, useRef } from "react";
import { GameMenu, PairMatchingGame } from "../../../../../components";
import { GameConfig } from "../../../../../types";
import { useGameUser } from "../../../../../context/GameUserContext";
import { generateSessionId } from "../../../../../lib/sessionId";

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

const GAME_ID = "principle-of-relationship-pair-matching-game";

export function PrincipleOfRelationshipGame(): React.JSX.Element {
  const [currentView, setCurrentView] = useState<"menu" | "game">("menu");
  const { trackEvent } = useGameUser();
  // Use ref to persist sessionId across renders without causing re-renders
  const sessionIdRef = useRef<string | null>(null);

  const handleStartGame = (): void => {
    // Generate new sessionId when game starts
    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;
    
    trackEvent({ 
      gameId: GAME_ID, 
      event: "game_started",
      sessionId: newSessionId,
    });
    setCurrentView("game");
  };

  const handleBackToMenu = (): void => {
    // Reset sessionId when returning to menu
    sessionIdRef.current = null;
    setCurrentView("menu");
  };

  const handleGameComplete = (score: number, moves: number, timeRemaining: number): void => {
    trackEvent({
      gameId: GAME_ID,
      event: "game_completed",
      sessionId: sessionIdRef.current || undefined,
      score,
      moves,
      timeRemaining,
    });
  };

  const handleGameOver = (score: number, moves: number): void => {
    trackEvent({
      gameId: GAME_ID,
      event: "game_over",
      sessionId: sessionIdRef.current || undefined,
      score,
      moves,
    });
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
          onGameComplete={handleGameComplete}
          onGameOver={handleGameOver}
          words={relationshipWords}
          gameConfig={relationshipGameConfig}
          title="Social Wellbeing - The Principle of Relationship Game"
        />
      )}
    </div>
  );
}