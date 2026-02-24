import React, { useState, useEffect, useRef } from "react";
import { Card, PairMatchingGameProps } from "../types";
import { Logo } from "./Logo";

// Utility to shuffle array
function shuffleArray(array: string[]): Card[] {
  return [...array]
    .sort(() => Math.random() - 0.5)
    .map((word, index) => ({
      id: index,
      word,
      flipped: false,
      matched: false,
    }));
}

export function PairMatchingGame({
  onBackToMenu,
  onGameComplete,
  onGameOver,
  words,
  gameConfig,
  title,
}: PairMatchingGameProps): React.JSX.Element {
  const [cards, setCards] = useState<Card[]>([]);
  const [firstCard, setFirstCard] = useState<Card | null>(null);
  const [secondCard, setSecondCard] = useState<Card | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(gameConfig.time);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gridCols, setGridCols] = useState(4);
  const gridRef = useRef<HTMLDivElement>(null);

  // Compute columns so total cards always divides evenly across rows
  useEffect(() => {
    const totalCards = gameConfig.pairs * 2;
    const computeCols = (width: number): number => {
      // Find the largest divisor of totalCards that fits cleanly
      const candidates = [4, 3, 2, 1];
      for (const cols of candidates) {
        if (totalCards % cols === 0 && width >= cols * 140) return cols;
      }
      return 2;
    };

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setGridCols(computeCols(width));
    });

    if (gridRef.current) {
      observer.observe(gridRef.current);
      setGridCols(computeCols(gridRef.current.offsetWidth));
    }

    return () => observer.disconnect();
  }, [gameConfig.pairs]);

  useEffect(() => {
    // Initialize cards
    const pairs = gameConfig.pairs;
    const selectedWords = words.slice(0, pairs);
    const doubled = shuffleArray([...selectedWords, ...selectedWords]);
    setCards(doubled);
    setTimeLeft(gameConfig.time);
  }, [words, gameConfig]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !completed && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !completed) {
      setGameOver(true);
    }
  }, [timeLeft, completed, gameOver]);

  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true);
      if (firstCard.word === secondCard.word) {
        setCards((prev: Card[]) =>
          prev.map((card: Card) =>
            card.word === firstCard.word ? { ...card, matched: true } : card
          )
        );
        setScore((prev) => prev + 10); // Add 10 points for each correct match
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstCard, secondCard]);

  useEffect(() => {
    if (cards.length && cards.every((card: Card) => card.matched)) {
      setCompleted(true);
    }
  }, [cards]);

  useEffect(() => {
    if (completed) {
      onGameComplete?.(score, moves, timeLeft);
    }
  }, [completed]);

  useEffect(() => {
    if (gameOver) {
      onGameOver?.(score, moves);
    }
  }, [gameOver]);

  const handleClick = (card: Card) => {
    if (disabled || card.flipped || card.matched || gameOver) return;
    setCards((prev: Card[]) =>
      prev.map((c: Card) => (c.id === card.id ? { ...c, flipped: true } : c))
    );
    if (!firstCard) {
      setFirstCard(card);
    } else {
      setSecondCard(card);
      setMoves(moves + 1);
    }
  };

  const resetTurn = () => {
    setCards((prev: Card[]) =>
      prev.map((c: Card) => (c.matched ? c : { ...c, flipped: false }))
    );
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
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
      <div ref={gridRef} className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-4 border-yellow-400 w-full max-w-7xl">
        {/* Game Header with Stats */}
        <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-xl p-3 border-2 border-blue-300 shadow-lg">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="text-center bg-white bg-opacity-70 rounded-xl p-2 border border-blue-200 shadow-md">
              <div className="text-lg font-black text-blue-600 mb-1">⏰ TIME</div>
              <div
                className={`text-2xl font-black ${
                  timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-blue-800"
                }`}
              >
                {timeLeft}s
              </div>
            </div>
            <div className="text-center bg-white bg-opacity-70 rounded-xl p-2 border border-green-200 shadow-md">
              <div className="text-lg font-black text-green-600 mb-1">⭐ SCORE</div>
              <div className="text-2xl font-black text-green-800">{score}</div>
            </div>
          </div>

          <div className="text-center bg-white bg-opacity-70 rounded-xl p-2 border border-purple-200 shadow-md">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-1">
              {title}
            </h2>
            <div className="text-sm text-gray-700 uppercase font-black">
              Match All Pairs!
            </div>
          </div>

          <div className="text-center bg-white bg-opacity-70 rounded-xl p-2 border border-purple-200 shadow-md">
            <div className="text-lg font-black text-purple-600 mb-1">
              🎯 MOVES
            </div>
            <div className="text-2xl font-black text-purple-800">{moves}</div>
          </div>
        </div>

        {!completed && !gameOver ? (
          <div
            className="w-full max-w-6xl mx-auto px-4"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              gap: "1.5rem",
            }}
          >
            {cards.map((card: Card) => (
              <div
                key={card.id}
                onClick={() => handleClick(card)}
                className="flex items-center justify-center cursor-pointer transform transition-all duration-200 hover:scale-105 border-4 border-white shadow-2xl"
                style={{
                  aspectRatio: "4 / 3",
                  width: "100%",
                  background:
                    card.flipped || card.matched
                      ? "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)"
                      : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  borderRadius: "16px",
                  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Main content */}
                <div className="text-center w-full px-2 flex items-center justify-center h-full">
                  {card.flipped || card.matched ? (
                    <p
                      className="font-black text-gray-900 leading-tight break-words text-center"
                      style={{
                        fontSize: card.word.length > 8 ? "clamp(0.75rem, 1.5vw, 1.25rem)" : "clamp(1rem, 2vw, 1.75rem)",
                      }}
                    >
                      {card.word}
                    </p>
                  ) : (
                    <p style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }} className="text-white">❓</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : gameOver ? (
          <div className="text-center bg-gradient-to-br from-red-200 to-pink-200 rounded-3xl p-8 border-4 border-red-400 shadow-xl">
            <p className="text-5xl font-black mb-4 text-red-800">
              ⏰ Time's Up! ⏰
            </p>
            <p className="text-2xl mb-4 font-black text-red-700">
              Don't worry, try again! You made {moves} moves.
            </p>
            <div className="bg-white rounded-xl p-4 mb-6 border-2 border-red-300">
              <p className="text-3xl font-black text-orange-600">
                Final Score: {score} points
              </p>
            </div>
            <div className="mb-6">
              <span className="text-6xl">😅</span>
            </div>
            <button
              onClick={onBackToMenu}
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-4 border-white"
            >
              🎮 Try Again! 🎮
            </button>
          </div>
        ) : (
          <>
            {/* Blurred background with cards */}
            <div
              className="w-full max-w-6xl mx-auto px-4 opacity-30 blur-sm pointer-events-none"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                gap: "1.5rem",
              }}
            >
              {cards.map((card: Card) => (
                <div
                  key={card.id}
                  className="flex items-center justify-center border-4 border-white shadow-2xl"
                  style={{
                    aspectRatio: "4 / 3",
                    width: "100%",
                    background:
                      "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div className="text-center w-full px-2 flex items-center justify-center h-full">
                    <p
                      className="font-black text-gray-900 leading-tight break-words text-center"
                      style={{ fontSize: card.word.length > 8 ? "clamp(0.75rem, 1.5vw, 1.25rem)" : "clamp(1rem, 2vw, 1.75rem)" }}
                    >
                      {card.word}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Centered congratulations overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="text-center bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-6 border-4 border-yellow-400 shadow-2xl max-w-3xl max-h-[90vh] overflow-y-auto">
                <p className="text-4xl font-black mb-4 text-orange-800">
                  🎉 Amazing! 🎉
                </p>
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl p-4 mb-4 border-4 border-green-400">
                  <p className="text-3xl font-black text-green-700 mb-1">
                    Final Score: {score} points! 🏆
                  </p>
                  <p className="text-lg font-bold text-gray-700">
                    {moves} moves • {timeLeft} seconds remaining
                  </p>
                </div>
                <p className="text-2xl mb-4 font-black text-orange-600">
                  These are the principles of a healthy relationship!
                </p>

                {/* All principles displayed */}
                <div className="grid grid-cols-2 gap-3 mb-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200">
                  {words.map((word: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-center bg-white rounded-xl p-2 border-2 border-green-300 shadow-lg"
                    >
                      <span className="text-lg font-black text-green-700">
                        ✓ {word}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <span className="text-4xl">🏆</span>
                </div>
                <button
                  onClick={onBackToMenu}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-4 border-white"
                >
                  🏠 Play Again! 🏠
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}