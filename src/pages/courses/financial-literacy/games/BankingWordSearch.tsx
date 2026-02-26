import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";
import { generateSessionId } from "../../../../lib/sessionId";

// Banking vocabulary words with definitions (Grade 5 level)
interface BankingWord {
  word: string;
  definition: string;
}

// All available banking words - 5 will be randomly selected each game
const ALL_BANKING_WORDS: BankingWord[] = [
  { word: "BANK", definition: "A safe place to keep your money" },
  { word: "SAVE", definition: "To keep money for later" },
  { word: "CASH", definition: "Paper money and coins" },
  { word: "LOAN", definition: "Money borrowed that must be repaid" },
  { word: "FEES", definition: "Charges for using some services" },
  { word: "SAFE", definition: "A secure place for valuables" },
  { word: "COIN", definition: "Small round metal money" },
  { word: "CREDIT", definition: "Borrowing money to pay back later" },
  { word: "TRUST", definition: "Believing the bank keeps money safe" },
  { word: "MONEY", definition: "What we use to buy things" },
  { word: "DEPOSIT", definition: "Put money INTO your account" },
  { word: "BALANCE", definition: "How much money you have" },
  { word: "SAVINGS", definition: "Account to grow your money" },
];

// Number of words to find per game (easier for kids)
const WORDS_PER_GAME = 5;
const GRID_SIZE = 8; // Smaller grid for easier gameplay
const GAME_ID = "banking-word-search";
const GAME_TIME_SECONDS = 120; // 2 minutes

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Select random words for this game session
function selectRandomWords(): BankingWord[] {
  const shuffled = shuffleArray(ALL_BANKING_WORDS);
  // Prefer shorter words for easier gameplay (max 6 letters for 8x8 grid)
  const shortWords = shuffled.filter(w => w.word.length <= 6);
  const selectedShort = shortWords.slice(0, Math.min(WORDS_PER_GAME, shortWords.length));

  // If we need more words, add longer ones
  if (selectedShort.length < WORDS_PER_GAME) {
    const longerWords = shuffled.filter(w => w.word.length > 6);
    return [...selectedShort, ...longerWords.slice(0, WORDS_PER_GAME - selectedShort.length)];
  }

  return selectedShort;
}

type Direction = {
  dx: number;
  dy: number;
  name: string;
};

const DIRECTIONS: Direction[] = [
  { dx: 1, dy: 0, name: "horizontal" },
  { dx: 0, dy: 1, name: "vertical" },
  { dx: 1, dy: 1, name: "diagonal-down" },
  { dx: 1, dy: -1, name: "diagonal-up" },
];

interface PlacedWord {
  word: string;
  startRow: number;
  startCol: number;
  direction: Direction;
  cells: { row: number; col: number }[];
}

interface CellPosition {
  row: number;
  col: number;
}

// Generate the word search grid
function generateGrid(words: string[]): {
  grid: string[][];
  placedWords: PlacedWord[];
} {
  const grid: string[][] = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(""));
  const placedWords: PlacedWord[] = [];

  // Sort words by length (longest first for better placement)
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  for (const word of sortedWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      attempts++;
      const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
      const startRow = Math.floor(Math.random() * GRID_SIZE);
      const startCol = Math.floor(Math.random() * GRID_SIZE);

      // Check if word fits
      const endRow = startRow + direction.dy * (word.length - 1);
      const endCol = startCol + direction.dx * (word.length - 1);

      if (endRow < 0 || endRow >= GRID_SIZE || endCol < 0 || endCol >= GRID_SIZE) {
        continue;
      }

      // Check if cells are available
      let canPlace = true;
      const cells: CellPosition[] = [];

      for (let i = 0; i < word.length; i++) {
        const row = startRow + direction.dy * i;
        const col = startCol + direction.dx * i;
        const currentCell = grid[row][col];

        if (currentCell !== "" && currentCell !== word[i]) {
          canPlace = false;
          break;
        }
        cells.push({ row, col });
      }

      if (canPlace) {
        // Place the word
        for (let i = 0; i < word.length; i++) {
          const row = startRow + direction.dy * i;
          const col = startCol + direction.dx * i;
          grid[row][col] = word[i];
        }
        placedWords.push({
          word,
          startRow,
          startCol,
          direction,
          cells,
        });
        placed = true;
      }
    }

    if (!placed) {
      console.warn(`Could not place word: ${word}`);
    }
  }

  // Fill empty cells with random letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      if (grid[row][col] === "") {
        grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }

  return { grid, placedWords };
}

// Check if selected cells match a word
function checkSelection(
  selectedCells: CellPosition[],
  placedWords: PlacedWord[],
  foundWords: string[]
): string | null {
  if (selectedCells.length < 2) return null;

  for (const placedWord of placedWords) {
    if (foundWords.includes(placedWord.word)) continue;

    if (selectedCells.length !== placedWord.cells.length) continue;

    // Check forward match
    let forwardMatch = true;
    for (let i = 0; i < selectedCells.length; i++) {
      if (
        selectedCells[i].row !== placedWord.cells[i].row ||
        selectedCells[i].col !== placedWord.cells[i].col
      ) {
        forwardMatch = false;
        break;
      }
    }

    if (forwardMatch) return placedWord.word;

    // Check reverse match (selecting backwards)
    let reverseMatch = true;
    for (let i = 0; i < selectedCells.length; i++) {
      const reverseIndex = selectedCells.length - 1 - i;
      if (
        selectedCells[i].row !== placedWord.cells[reverseIndex].row ||
        selectedCells[i].col !== placedWord.cells[reverseIndex].col
      ) {
        reverseMatch = false;
        break;
      }
    }

    if (reverseMatch) return placedWord.word;
  }

  return null;
}

// Get cells between start and end (for line drawing)
function getCellsBetween(start: CellPosition, end: CellPosition): CellPosition[] {
  const cells: CellPosition[] = [];
  const dRow = Math.sign(end.row - start.row);
  const dCol = Math.sign(end.col - start.col);

  // Only allow straight lines (horizontal, vertical, diagonal)
  const rowDiff = Math.abs(end.row - start.row);
  const colDiff = Math.abs(end.col - start.col);

  if (rowDiff !== 0 && colDiff !== 0 && rowDiff !== colDiff) {
    // Not a valid straight line
    return [start];
  }

  const steps = Math.max(rowDiff, colDiff);

  for (let i = 0; i <= steps; i++) {
    cells.push({
      row: start.row + dRow * i,
      col: start.col + dCol * i,
    });
  }

  return cells;
}

export function BankingWordSearch(): React.JSX.Element {
  const { trackEvent } = useGameUser();
  const sessionIdRef = useRef<string | null>(null);
  const completedEventSentRef = useRef<boolean>(false);

  const [showMenu, setShowMenu] = useState(true);
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<CellPosition[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState<CellPosition | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; word?: string } | null>(null);
  const [score, setScore] = useState(0);
  const [showDefinition, setShowDefinition] = useState<BankingWord | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentGameWords, setCurrentGameWords] = useState<BankingWord[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [gameOver, setGameOver] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const gameOverEventSentRef = useRef<boolean>(false);

  // Initialize game with random words
  const initializeGame = useCallback(() => {
    // Select 5 random words for this game
    const selectedWords = selectRandomWords();
    setCurrentGameWords(selectedWords);

    const words = selectedWords.map((w: BankingWord) => w.word);
    const { grid: newGrid, placedWords: newPlacedWords } = generateGrid(words);
    setGrid(newGrid);
    setPlacedWords(newPlacedWords);
    setFoundWords([]);
    setSelectedCells([]);
    setScore(0);
    setFeedback(null);
    setShowDefinition(null);
    setGameComplete(false);
    setGameOver(false);
    setTimeLeft(GAME_TIME_SECONDS);
    gameOverEventSentRef.current = false;
  }, []);

  // Timer effect
  useEffect(() => {
    if (showMenu || gameComplete || gameOver) return;

    if (timeLeft <= 0) {
      // Time's up!
      if (!gameOverEventSentRef.current && sessionIdRef.current) {
        gameOverEventSentRef.current = true;
        setGameOver(true);
        trackEvent({
          gameId: GAME_ID,
          event: "game_over",
          sessionId: sessionIdRef.current,
          score,
          metadata: {
            wordsFound: foundWords.length,
            totalWords: currentGameWords.length,
            reason: "time_up",
          },
        });
      }
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showMenu, gameComplete, gameOver, score, foundWords.length, currentGameWords.length, trackEvent]);

  // Track game completion
  useEffect(() => {
    if (
      currentGameWords.length > 0 &&
      foundWords.length === currentGameWords.length &&
      sessionIdRef.current &&
      !completedEventSentRef.current
    ) {
      completedEventSentRef.current = true;
      setGameComplete(true);
      trackEvent({
        gameId: GAME_ID,
        event: "game_completed",
        sessionId: sessionIdRef.current,
        score,
        metadata: {
          wordsFound: foundWords.length,
          totalWords: currentGameWords.length,
        },
      });
    }
  }, [foundWords, score, trackEvent, currentGameWords]);

  const handleStartGame = (): void => {
    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;
    completedEventSentRef.current = false;
    trackEvent({
      gameId: GAME_ID,
      event: "game_started",
      sessionId: newSessionId,
    });
    initializeGame();
    setShowMenu(false);
  };

  const handlePlayAgain = (): void => {
    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;
    completedEventSentRef.current = false;
    trackEvent({
      gameId: GAME_ID,
      event: "game_started",
      sessionId: newSessionId,
    });
    initializeGame();
  };

  const handleBackToMenu = (): void => {
    sessionIdRef.current = null;
    setShowMenu(true);
  };

  // Handle cell selection start
  const handleCellMouseDown = (row: number, col: number): void => {
    setIsSelecting(true);
    setStartCell({ row, col });
    setSelectedCells([{ row, col }]);
    setFeedback(null);
  };

  // Handle cell selection during drag
  const handleCellMouseEnter = (row: number, col: number): void => {
    if (!isSelecting || !startCell) return;

    const cells = getCellsBetween(startCell, { row, col });
    setSelectedCells(cells);
  };

  // Handle selection end
  const handleMouseUp = (): void => {
    if (!isSelecting) return;
    setIsSelecting(false);

    // Check if selection matches a word
    const matchedWord = checkSelection(selectedCells, placedWords, foundWords);

    if (matchedWord) {
      // Found a word!
      setFoundWords([...foundWords, matchedWord]);
      setScore((prev) => prev + 10);
      const wordData = currentGameWords.find((w: BankingWord) => w.word === matchedWord);
      setShowDefinition(wordData || null);
      setFeedback({ type: "success", word: matchedWord });

      // Clear feedback after delay
      setTimeout(() => {
        setFeedback(null);
        setShowDefinition(null);
      }, 2500);
    } else if (selectedCells.length > 1) {
      // Invalid selection
      setFeedback({ type: "error" });
      setTimeout(() => {
        setFeedback(null);
      }, 1000);
    }

    // Clear selection after checking (keep if found)
    if (!matchedWord) {
      setSelectedCells([]);
    } else {
      setSelectedCells([]);
    }
    setStartCell(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (row: number, col: number, e: React.TouchEvent): void => {
    e.preventDefault();
    handleCellMouseDown(row, col);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    e.preventDefault();
    if (!isSelecting || !gridRef.current) return;

    const touch = e.touches[0];
    const gridRect = gridRef.current.getBoundingClientRect();
    const cellSize = gridRect.width / GRID_SIZE;

    const col = Math.floor((touch.clientX - gridRect.left) / cellSize);
    const row = Math.floor((touch.clientY - gridRect.top) / cellSize);

    if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
      handleCellMouseEnter(row, col);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent): void => {
    e.preventDefault();
    handleMouseUp();
  };

  // Check if a cell is part of a found word
  const isCellInFoundWord = (row: number, col: number): string | null => {
    for (const placedWord of placedWords) {
      if (!foundWords.includes(placedWord.word)) continue;
      for (const cell of placedWord.cells) {
        if (cell.row === row && cell.col === col) {
          return placedWord.word;
        }
      }
    }
    return null;
  };

  // Check if a cell is currently selected
  const isCellSelected = (row: number, col: number): boolean => {
    return selectedCells.some((c) => c.row === row && c.col === col);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Generate a consistent color for each word
  const getWordColor = (word: string): string => {
    const colors = [
      "bg-green-400",
      "bg-blue-400",
      "bg-purple-400",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-orange-400",
      "bg-teal-400",
      "bg-indigo-400",
      "bg-rose-400",
      "bg-cyan-400",
      "bg-lime-400",
      "bg-amber-400",
    ];
    const index = currentGameWords.findIndex((w: BankingWord) => w.word === word);
    return colors[index % colors.length];
  };

  // Menu Screen
  if (showMenu) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-4"
        style={{
          background:
            "linear-gradient(135deg, #22C55E 0%, #16A34A 25%, #15803D 50%, #166534 75%, #14532D 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="text-center bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-6 border-4 border-green-400 shadow-2xl max-h-[95vh] overflow-y-auto">
            {/* Logo and Emojis */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Logo size="md" />
              <div className="text-6xl">🏦🔍</div>
            </div>

            <h1 className="text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Banking Word Hunt
            </h1>
            <p className="text-lg text-gray-700 mb-2 leading-relaxed">
              Find all the banking words hidden in the puzzle!
            </p>
            <p className="text-base text-gray-600 mb-4">
              Learn important money words while having fun!
            </p>

            <div className="bg-green-50 rounded-2xl p-4 mb-4 border-2 border-green-300">
              <h2 className="text-xl font-bold text-green-800 mb-3">
                How to Play:
              </h2>
              <ul className="text-left text-base text-gray-700 space-y-1">
                <li className="flex items-start">
                  <span className="text-xl mr-2">👆</span>
                  <span>Click and drag across letters to select a word</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">↔️</span>
                  <span>Words can go horizontal, vertical, or diagonal</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">✅</span>
                  <span>Find a word = Green highlight + learn what it means!</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">❌</span>
                  <span>Wrong selection = Red flash, try again!</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">⏰</span>
                  <span>You have 2 minutes to find all words!</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">⭐</span>
                  <span>Find all 5 banking words before time runs out!</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleStartGame}
              className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-3"
            >
              Start Word Hunt! 🔍
            </button>

            <div>
              <Link
                to="/financial-literacy"
                className="inline-block px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                ← Back to Financial Literacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen (Time's Up)
  if (gameOver) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-4"
        style={{
          background:
            "linear-gradient(135deg, #EF4444 0%, #DC2626 25%, #B91C1C 50%, #991B1B 75%, #7F1D1D 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <div className="max-w-3xl mx-auto px-4 w-full">
          <div className="text-center bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-6 border-4 border-orange-400 shadow-2xl max-h-[95vh] overflow-y-auto">
            <p className="text-6xl mb-4">⏰💪</p>
            <h2 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
              Time's Up!
            </h2>

            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-4 mb-4 border-4 border-orange-400">
              <p className="text-3xl font-black text-orange-700 mb-1">
                Score: {score} points
              </p>
              <p className="text-xl text-gray-700">
                You found {foundWords.length} of {currentGameWords.length} words!
              </p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-4 mb-5 border-2 border-yellow-300">
              <h3 className="text-xl font-bold text-yellow-800 mb-3">
                Words to Learn:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-left">
                {currentGameWords.map((word: BankingWord) => {
                  const wasFound = foundWords.includes(word.word);
                  return (
                    <div
                      key={word.word}
                      className={`rounded-lg p-2 border ${
                        wasFound
                          ? "bg-green-50 border-green-300"
                          : "bg-red-50 border-red-300"
                      }`}
                    >
                      <span className={`font-bold ${wasFound ? "text-green-700" : "text-red-700"}`}>
                        {wasFound ? "✅" : "❌"} {word.word}
                      </span>
                      <span className="text-gray-600 text-sm block">{word.definition}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlayAgain}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🔄 Try Again
              </button>
              <button
                onClick={handleBackToMenu}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                📋 Back to Menu
              </button>
              <Link
                to="/financial-literacy"
                className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                ← Back to Financial Literacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Complete Screen
  if (gameComplete) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-4"
        style={{
          background:
            "linear-gradient(135deg, #22C55E 0%, #16A34A 25%, #15803D 50%, #166534 75%, #14532D 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <div className="max-w-3xl mx-auto px-4 w-full">
          <div className="text-center bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-6 border-4 border-yellow-400 shadow-2xl max-h-[95vh] overflow-y-auto">
            <p className="text-6xl mb-4">🏆💰🎉</p>
            <h2 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Amazing! You Found All The Words!
            </h2>

            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 mb-4 border-4 border-green-400">
              <p className="text-3xl font-black text-green-700 mb-1">
                Final Score: {score} points!
              </p>
              <p className="text-xl text-gray-700">
                You learned {currentGameWords.length} banking words!
              </p>
              <p className="text-lg text-green-600 mt-1">
                Time remaining: {formatTime(timeLeft)}
              </p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-4 mb-5 border-2 border-yellow-300">
              <h3 className="text-xl font-bold text-yellow-800 mb-3">
                Words You Learned:
              </h3>
              <div className="grid grid-cols-2 gap-2 text-left">
                {currentGameWords.map((word: BankingWord) => (
                  <div key={word.word} className="bg-white rounded-lg p-2 border border-green-200">
                    <span className="font-bold text-green-700">{word.word}</span>
                    <span className="text-gray-600 text-sm block">{word.definition}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlayAgain}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🔍 Play Again
              </button>
              <button
                onClick={handleBackToMenu}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                📋 Back to Menu
              </button>
              <Link
                to="/financial-literacy"
                className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                ← Back to Financial Literacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div
      className="min-h-screen flex flex-col py-2 sm:py-4"
      style={{
        background:
          "linear-gradient(135deg, #22C55E 0%, #16A34A 25%, #15803D 50%, #166534 75%, #14532D 100%)",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
      }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <Logo size="sm" />
            <div className="bg-white bg-opacity-90 rounded-xl p-2 sm:p-3 border-2 border-green-300 shadow-lg">
              <div className="text-xs sm:text-sm font-bold text-green-600">SCORE</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black text-green-800">{score}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="text-center">
              <h1 className="text-lg sm:text-xl md:text-2xl font-black text-white drop-shadow-lg">
                🏦 Banking Word Hunt 🔍
              </h1>
            </div>
            <div className={`bg-white bg-opacity-90 rounded-xl p-2 sm:p-3 border-2 shadow-lg ${
              timeLeft <= 30 ? "border-red-500 animate-pulse" : "border-orange-300"
            }`}>
              <div className={`text-xs sm:text-sm font-bold ${timeLeft <= 30 ? "text-red-600" : "text-orange-600"}`}>
                TIME
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-black ${timeLeft <= 30 ? "text-red-700" : "text-orange-700"}`}>
                ⏰ {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-90 rounded-xl p-2 sm:p-3 border-2 border-emerald-300 shadow-lg">
            <div className="text-xs sm:text-sm font-bold text-emerald-600">FOUND</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-emerald-800">
              {foundWords.length}/{currentGameWords.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-90 rounded-full h-3 sm:h-4 mb-3 sm:mb-4 border-2 border-green-300 overflow-hidden shadow-lg">
          <div
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${currentGameWords.length > 0 ? (foundWords.length / currentGameWords.length) * 100 : 0}%` }}
          />
        </div>

        {/* Main Game Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Word Search Grid */}
          <div className="flex-1 flex items-center justify-center">
            <div
              ref={gridRef}
              className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 border-4 border-green-400 shadow-2xl select-none"
              style={{ touchAction: "none" }}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="grid gap-1 sm:gap-1.5 md:gap-2"
                style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => {
                    const foundWord = isCellInFoundWord(rowIndex, colIndex);
                    const isSelected = isCellSelected(rowIndex, colIndex);
                    const hasError = feedback?.type === "error" && isSelected;

                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`
                          w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                          flex items-center justify-center
                          text-base sm:text-xl md:text-2xl lg:text-3xl font-black
                          rounded-lg sm:rounded-xl
                          cursor-pointer
                          transition-all duration-150
                          border-2 border-transparent
                          ${
                            foundWord
                              ? `${getWordColor(foundWord)} text-white shadow-md line-through decoration-2 border-white`
                              : isSelected
                              ? hasError
                                ? "bg-red-400 text-white scale-95 border-red-600"
                                : "bg-green-300 text-green-900 scale-105 shadow-lg border-green-500"
                              : "bg-gray-100 text-gray-800 hover:bg-green-100 hover:scale-105 hover:border-green-300"
                          }
                        `}
                        onMouseDown={() => !foundWord && handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onTouchStart={(e) => !foundWord && handleTouchStart(rowIndex, colIndex, e)}
                      >
                        {letter}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Word List Panel */}
          <div className="lg:w-72 xl:w-80">
            <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border-4 border-yellow-400 shadow-2xl h-full">
              <h2 className="text-xl sm:text-2xl md:text-2xl font-black text-center text-yellow-800 mb-3 sm:mb-4">
                📋 Find These Words:
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-1 gap-2 sm:gap-3 md:gap-4">
                {currentGameWords.map((wordData: BankingWord) => {
                  const isFound = foundWords.includes(wordData.word);
                  return (
                    <div
                      key={wordData.word}
                      className={`
                        px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl md:text-2xl
                        transition-all duration-300 text-center lg:text-left
                        ${
                          isFound
                            ? `${getWordColor(wordData.word)} text-white line-through decoration-2 shadow-lg`
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }
                      `}
                    >
                      <span className="mr-2 text-xl sm:text-2xl">{isFound ? "✅" : "⬜"}</span>
                      {wordData.word}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {feedback && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            {feedback.type === "success" ? (
              <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-4 sm:p-6 animate-bounce shadow-2xl text-center">
                <p className="text-2xl sm:text-3xl font-black text-green-700 mb-2">
                  ✨ Found: {feedback.word}! ✨
                </p>
                {showDefinition && (
                  <p className="text-base sm:text-lg text-green-600">
                    {showDefinition.definition}
                  </p>
                )}
                <p className="text-sm sm:text-base text-green-500 mt-2">+10 points!</p>
              </div>
            ) : (
              <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-4 sm:p-6 shadow-2xl animate-shake">
                <p className="text-xl sm:text-2xl font-black text-red-700">
                  ❌ Not a banking word!
                </p>
                <p className="text-sm sm:text-base text-red-500 mt-1">Try again!</p>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-2 sm:mt-3">
          <button
            onClick={handleBackToMenu}
            className="px-4 sm:px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-sm sm:text-base font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
