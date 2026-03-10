import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../../components";
import { useGameUser } from "../../../../../context/GameUserContext";
import { generateSessionId } from "../../../../../lib/sessionId";

// Game configuration
const GAME_ID = "eco-fix-it-game";

interface EcoItem {
  id: number;
  name: string;
  type: "eco-friendly" | "not-eco-friendly";
  emoji: string;
  description: string;
}

// Eco-friendly items
const ecoFriendlyItems: EcoItem[] = [
  { id: 1, name: "Electric Car", type: "eco-friendly", emoji: "🚙⚡", description: "Zero emissions vehicle" },
  { id: 2, name: "Reusable Bag", type: "eco-friendly", emoji: "♻️🛍️", description: "Reduces plastic waste" },
  { id: 3, name: "Solar Panels", type: "eco-friendly", emoji: "☀️🔋", description: "Clean renewable energy" },
  { id: 4, name: "Recycling Bin", type: "eco-friendly", emoji: "♻️", description: "Sorts waste properly" },
  { id: 5, name: "Bicycle", type: "eco-friendly", emoji: "🚲", description: "Zero emission transport" },
  { id: 6, name: "Tree Planting", type: "eco-friendly", emoji: "🌳", description: "Produces oxygen" },
  { id: 7, name: "Wind Turbine", type: "eco-friendly", emoji: "💨🔋", description: "Renewable energy" },
  { id: 8, name: "Composting", type: "eco-friendly", emoji: "🌱", description: "Natural fertilizer" },
  { id: 9, name: "LED Bulb", type: "eco-friendly", emoji: "💡", description: "Energy efficient" },
  { id: 10, name: "Water Conservation", type: "eco-friendly", emoji: "💧✅", description: "Saves water" },
];

// Not eco-friendly items
const notEcoFriendlyItems: EcoItem[] = [
  { id: 11, name: "Gas Car", type: "not-eco-friendly", emoji: "🚗💨", description: "Emits pollution" },
  { id: 12, name: "Plastic Bags", type: "not-eco-friendly", emoji: "🛍️", description: "Single-use plastic" },
  { id: 13, name: "Factory Smoke", type: "not-eco-friendly", emoji: "🏭💨", description: "Air pollution" },
  { id: 14, name: "Trash Pile", type: "not-eco-friendly", emoji: "🗑️", description: "Unsorted waste" },
  { id: 15, name: "Cutting Trees", type: "not-eco-friendly", emoji: "🪵", description: "Deforestation" },
  { id: 16, name: "Coal Power", type: "not-eco-friendly", emoji: "⚫⚡", description: "Polluting energy" },
  { id: 17, name: "Littering", type: "not-eco-friendly", emoji: "🚮", description: "Pollutes environment" },
  { id: 18, name: "Water Waste", type: "not-eco-friendly", emoji: "💧❌", description: "Wastes resources" },
  { id: 19, name: "Incandescent Bulb", type: "not-eco-friendly", emoji: "💡🔥", description: "Energy wasting" },
  { id: 20, name: "Aerosol Spray", type: "not-eco-friendly", emoji: "💨", description: "Harmful chemicals" },
];

export function EcoFixItGame(): React.JSX.Element {
  const { trackEvent } = useGameUser();
  const sessionIdRef = useRef<string | null>(null);
  const movesRef = useRef<number>(0);
  const completedEventSentRef = useRef<boolean>(false);

  const [gameStarted, setGameStarted] = useState(false);
  const [currentItem, setCurrentItem] = useState<EcoItem | null>(null);
  const [remainingItems, setRemainingItems] = useState<EcoItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [ecoColumn, setEcoColumn] = useState<EcoItem[]>([]);
  const [notEcoColumn, setNotEcoColumn] = useState<EcoItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<EcoItem | null>(null);

  // Initialize game
  const startGame = (): void => {
    const allItems = [...ecoFriendlyItems, ...notEcoFriendlyItems];
    const shuffled = allItems.sort(() => Math.random() - 0.5);
    setRemainingItems(shuffled);
    setCurrentItem(shuffled[0]);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameStarted(true);
    setEcoColumn([]);
    setNotEcoColumn([]);
    setFeedback(null);

    // Generate new sessionId and track game start
    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;
    movesRef.current = 0;
    completedEventSentRef.current = false;
    trackEvent({
      gameId: GAME_ID,
      event: "game_started",
      sessionId: newSessionId,
    });
  };

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted && !gameOver) {
      // Time ran out - game over
      setGameOver(true);
      trackEvent({
        gameId: GAME_ID,
        event: "game_over",
        sessionId: sessionIdRef.current || undefined,
        score,
        moves: movesRef.current,
      });
    }
  }, [gameStarted, gameOver, timeLeft, score, trackEvent]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    if (currentItem) {
      setDraggedItem(currentItem);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropZone: "eco-friendly" | "not-eco-friendly"
  ): void => {
    e.preventDefault();
    if (!draggedItem || !currentItem) return;

    movesRef.current += 1;
    const isCorrect = draggedItem.type === dropZone;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setFeedback("correct");
      if (dropZone === "eco-friendly") {
        setEcoColumn((prev) => [...prev, draggedItem]);
      } else {
        setNotEcoColumn((prev) => [...prev, draggedItem]);
      }
    } else {
      setFeedback("wrong");
    }

    // Show feedback briefly then move to next item
    setTimeout(() => {
      setFeedback(null);
      const nextItems = remainingItems.slice(1);
      if (nextItems.length > 0) {
        setCurrentItem(nextItems[0]);
        setRemainingItems(nextItems);
      } else {
        // Game completed - all items sorted
        setGameOver(true);
        if (!completedEventSentRef.current) {
          completedEventSentRef.current = true;
          const finalScore = score + (isCorrect ? 10 : 0);
          trackEvent({
            gameId: GAME_ID,
            event: "game_completed",
            sessionId: sessionIdRef.current || undefined,
            score: finalScore,
            moves: movesRef.current,
            timeRemaining: timeLeft,
          });
        }
      }
    }, 500);

    setDraggedItem(null);
  };

  // Restart game
  const restartGame = (): void => {
    startGame();
  };

  // Back to menu
  const backToMenu = (): void => {
    sessionIdRef.current = null;
    movesRef.current = 0;
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setEcoColumn([]);
    setNotEcoColumn([]);
    setCurrentItem(null);
    setRemainingItems([]);
  };

  // Menu Screen
  if (!gameStarted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-8"
        style={{
          background:
            "linear-gradient(135deg, #4CAF50 0%, #8BC34A 25%, #CDDC39 50%, #81C784 75%, #2E7D32 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-green-400">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Logo size="md" />
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Eco Sort Challenge
              </h1>
            </div>

            <div className="text-center mb-6">
              <p className="text-xl text-gray-700 mb-4">
                Help save the planet by sorting items into Eco-Friendly or Not Eco-Friendly!
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 mb-6 border-2 border-green-300">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                How to Play:
              </h2>
              <ul className="text-left text-lg text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🌍</span>
                  <span>
                    <strong>Look at each item</strong> shown in the center
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">👆</span>
                  <span>
                    <strong>Drag it</strong> to the correct category
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">✅</span>
                  <span>
                    <strong>Eco-Friendly:</strong> Good for the environment
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">❌</span>
                  <span>
                    <strong>Not Eco-Friendly:</strong> Harms the environment
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">⏰</span>
                  <span>
                    Sort all 20 items before time runs out!
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">⭐</span>
                  <span>
                    Get 10 points for each correct sort!
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={startGame}
                className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Start Sorting! 🌱
              </button>

              <Link
                to="/environmental-wellbeing"
                className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-center"
              >
                ← Back to Environmental Wellbeing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameOver) {
    const maxScore = 200; // 20 items * 10 points
    const percentage = Math.round((score / maxScore) * 100);
    let message = "";
    let emoji = "";

    if (percentage === 100) {
      message = "Perfect! Eco Champion!";
      emoji = "🏆🌍";
    } else if (percentage >= 80) {
      message = "Excellent! Earth Hero!";
      emoji = "⭐🌱";
    } else if (percentage >= 60) {
      message = "Great Work!";
      emoji = "👍♻️";
    } else if (percentage >= 40) {
      message = "Good Effort!";
      emoji = "💪🌿";
    } else {
      message = "Keep Learning!";
      emoji = "📚🌍";
    }

    return (
      <div
        className="min-h-screen flex items-center justify-center py-8"
        style={{
          background:
            "linear-gradient(135deg, #4CAF50 0%, #8BC34A 25%, #CDDC39 50%, #81C784 75%, #2E7D32 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 border-yellow-400">
            <div className="text-center">
              <p className="text-7xl mb-4">{emoji}</p>
              <h2 className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                {message}
              </h2>

              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6 border-4 border-green-400">
                <p className="text-4xl font-black text-green-700 mb-2">
                  {score} / {maxScore} Points
                </p>
                <p className="text-2xl text-gray-700">
                  {percentage}% Correct!
                </p>
                {timeLeft > 0 && (
                  <p className="text-xl text-green-600 mt-2">
                    ⏰ Time Remaining: {timeLeft}s
                  </p>
                )}
                {timeLeft === 0 && (
                  <p className="text-xl text-orange-600 mt-2">
                    ⏰ Time's Up!
                  </p>
                )}
              </div>

              <div className="bg-green-50 rounded-2xl p-6 mb-6 border-2 border-green-300">
                <h3 className="text-2xl font-bold text-green-800 mb-3">
                  What You Learned:
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Making eco-friendly choices helps protect our planet! Choose renewable energy,
                  reduce waste, recycle, plant trees, and use sustainable transportation.
                  Every choice matters! 🌍💚
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={restartGame}
                  className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  🔄 Play Again
                </button>
                <button
                  onClick={backToMenu}
                  className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  📋 Back to Menu
                </button>
                <Link
                  to="/environmental-wellbeing"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  ← Back to Environmental Wellbeing
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div
      className="min-h-screen py-8"
      style={{
        background:
          "linear-gradient(135deg, #4CAF50 0%, #8BC34A 25%, #CDDC39 50%, #81C784 75%, #2E7D32 100%)",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Score and Timer */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Logo size="sm" />
            <div className="bg-white bg-opacity-90 rounded-xl px-6 py-3 shadow-lg border-2 border-green-400">
              <div className="text-sm font-bold text-green-600">SCORE</div>
              <div className="text-3xl font-black text-green-800">{score}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={`bg-white bg-opacity-90 rounded-xl px-6 py-3 shadow-lg border-2 ${
                timeLeft <= 10 ? "border-red-500 animate-pulse" : "border-orange-400"
              }`}
            >
              <div
                className={`text-sm font-bold ${
                  timeLeft <= 10 ? "text-red-600" : "text-orange-600"
                }`}
              >
                TIME LEFT
              </div>
              <div
                className={`text-3xl font-black ${
                  timeLeft <= 10 ? "text-red-800" : "text-orange-800"
                }`}
              >
                {timeLeft}s
              </div>
            </div>

            <div className="bg-white bg-opacity-90 rounded-xl px-6 py-3 shadow-lg border-2 border-emerald-400">
              <div className="text-sm font-bold text-emerald-600">ITEMS LEFT</div>
              <div className="text-3xl font-black text-emerald-800">
                {remainingItems.length}
              </div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Eco-Friendly Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "eco-friendly")}
            className="bg-green-100 bg-opacity-90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-green-500 min-h-[600px]"
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">✅</div>
              <h3 className="text-2xl font-black text-green-800">Eco-Friendly</h3>
              <p className="text-sm text-green-700">Good for Earth!</p>
            </div>

            <div className="space-y-3">
              {ecoColumn.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-md border-2 border-green-400"
                >
                  <div className="text-4xl text-center mb-1">{item.emoji}</div>
                  <div className="text-sm font-bold text-center text-green-800">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column - Current Item */}
          <div className="flex flex-col items-center justify-center">
            {currentItem && (
              <div
                draggable
                onDragStart={handleDragStart}
                className={`bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border-4 cursor-grab active:cursor-grabbing transform transition-all duration-300 ${
                  feedback === "correct"
                    ? "border-green-500 scale-110"
                    : feedback === "wrong"
                    ? "border-red-500 scale-90"
                    : "border-blue-400 hover:scale-105"
                }`}
              >
                <div className="text-center">
                  <div className="text-8xl mb-4">{currentItem.emoji}</div>
                  <h3 className="text-3xl font-black text-gray-800 mb-2">
                    {currentItem.name}
                  </h3>
                  <p className="text-lg text-gray-600">{currentItem.description}</p>
                </div>

                {feedback && (
                  <div className="mt-6 text-center">
                    {feedback === "correct" ? (
                      <div className="bg-green-100 border-4 border-green-500 rounded-xl p-4">
                        <p className="text-2xl font-black text-green-700">
                          ✨ Correct! +10 points
                        </p>
                      </div>
                    ) : (
                      <div className="bg-red-100 border-4 border-red-500 rounded-xl p-4">
                        <p className="text-2xl font-black text-red-700">
                          ❌ Wrong! Try again
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!feedback && (
                  <div className="mt-6 text-center">
                    <p className="text-xl font-bold text-blue-600 animate-bounce">
                      👆 Drag Me!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Not Eco-Friendly Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "not-eco-friendly")}
            className="bg-red-100 bg-opacity-90 backdrop-blur-md rounded-3xl p-6 shadow-2xl border-4 border-red-500 min-h-[600px]"
          >
            <div className="text-center mb-4">
              <div className="text-5xl mb-2">❌</div>
              <h3 className="text-2xl font-black text-red-800">Not Eco-Friendly</h3>
              <p className="text-sm text-red-700">Harms Earth!</p>
            </div>

            <div className="space-y-3">
              {notEcoColumn.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 shadow-md border-2 border-red-400"
                >
                  <div className="text-4xl text-center mb-1">{item.emoji}</div>
                  <div className="text-sm font-bold text-center text-red-800">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={backToMenu}
            className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
