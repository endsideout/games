import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const backTo = new URLSearchParams(location.search).get("from") === "3dw-set1"
    ? "/3d-wellness/set-1"
    : "/social-wellbeing";
  const [currentView, setCurrentView] = useState<"menu" | "game">("menu");
  const { trackEvent } = useGameUser();
  const sessionIdRef = useRef<string | null>(null);
  const completedEventSentRef = useRef<boolean>(false);

  const handleStartGame = (): void => {
    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;
    completedEventSentRef.current = false;
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
    if (completedEventSentRef.current) return;
    completedEventSentRef.current = true;
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
        <div style={{ position: "relative" }}>
          <GameMenu
            onStartGame={handleStartGame}
            title={gameTitle}
            description={gameDescription}
          />
          <Link
            to={backTo}
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              color: "rgba(255,255,255,0.85)",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            ← Back
          </Link>
        </div>
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