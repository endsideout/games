import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";
import { generateSessionId } from "../../../../lib/sessionId";

const GAME_ID = "budgeting-game";
const GAME_TIME_SECONDS = 120;

interface BudgetItem {
  name: string;
  emoji: string;
  category: "need" | "want";
  value: number;
}

const ALL_ITEMS: BudgetItem[] = [
  { name: "Food",       emoji: "🍎", category: "need",  value: 20  },
  { name: "Video Games",emoji: "🎮", category: "want",  value: 60  },
  { name: "Water",      emoji: "💧", category: "need",  value: 5   },
  { name: "Candy",      emoji: "🍬", category: "want",  value: 3   },
  { name: "Shelter",    emoji: "🏠", category: "need",  value: 800 },
  { name: "New Phone",  emoji: "📱", category: "want",  value: 200 },
  { name: "Clothing",   emoji: "👕", category: "need",  value: 50  },
  { name: "Vacation",   emoji: "✈️", category: "want",  value: 500 },
  { name: "Medicine",   emoji: "💊", category: "need",  value: 30  },
  { name: "Jewelry",    emoji: "💍", category: "want",  value: 150 },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type JarGlow = "correct" | "incorrect" | "hover" | null;
type GamePhase = "menu" | "playing" | "finished";

interface PlacedItem extends BudgetItem {
  placedIn: "need" | "want";
  correct: boolean;
}

export function BudgetingGame(): React.JSX.Element {
  const [phase, setPhase] = useState<GamePhase>("menu");
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME_SECONDS);
  const [needGlow, setNeedGlow] = useState<JarGlow>(null);
  const [wantGlow, setWantGlow] = useState<JarGlow>(null);
  const [animatingOut, setAnimatingOut] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef<string>("");
  const placedItemsRef = useRef<PlacedItem[]>([]);
  const { trackEvent } = useGameUser();

  const endGame = useCallback(
    (remaining: PlacedItem[], timeUsed: number) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setPhase("finished");
      const correct = remaining.filter((i) => i.correct).length;
      trackEvent({
        gameId: GAME_ID,
        event: "game_completed",
        sessionId: sessionIdRef.current,
        score: correct,
        timeRemaining: timeUsed,
      });
    },
    [trackEvent]
  );

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          endGame(placedItemsRef.current, 0);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  function startGame() {
    sessionIdRef.current = generateSessionId();
    // Always guarantee 5 needs + 5 wants, randomly interleaved
    const needs = shuffleArray(ALL_ITEMS.filter((i) => i.category === "need"));
    const wants = shuffleArray(ALL_ITEMS.filter((i) => i.category === "want"));
    const interleaved = shuffleArray([...needs.slice(0, 5), ...wants.slice(0, 5)]);
    setItems(interleaved);
    setCurrentIndex(0);
    setPlacedItems([]);
    placedItemsRef.current = [];
    setTimeLeft(GAME_TIME_SECONDS);
    setNeedGlow(null);
    setWantGlow(null);
    setAnimatingOut(false);
    setIsDragging(false);
    setPhase("playing");
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  }

  function handlePlace(jar: "need" | "want") {
    if (animatingOut || currentIndex >= items.length) return;

    const item = items[currentIndex];
    const correct = item.category === jar;
    const setGlow = jar === "need" ? setNeedGlow : setWantGlow;

    setIsDragging(false);
    setNeedGlow(null);
    setWantGlow(null);
    setGlow(correct ? "correct" : "incorrect");

    const newPlaced: PlacedItem = { ...item, placedIn: jar, correct };
    const updatedPlaced = [...placedItems, newPlaced];
    placedItemsRef.current = updatedPlaced;

    setTimeout(() => {
      setGlow(null);
      setAnimatingOut(true);
      setTimeout(() => {
        setAnimatingOut(false);
        const next = currentIndex + 1;
        setCurrentIndex(next);
        setPlacedItems(updatedPlaced);
        if (next >= items.length) endGame(updatedPlaced, timeLeft);
      }, 300);
    }, 750);
  }

  // Drag handlers
  function onDragStart(e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", "item");
    setIsDragging(true);
  }
  function onDragEnd() { setIsDragging(false); setNeedGlow(null); setWantGlow(null); }
  function onDragOver(e: React.DragEvent, jar: "need" | "want") {
    e.preventDefault();
    if (jar === "need") { setNeedGlow("hover"); setWantGlow(null); }
    else { setWantGlow("hover"); setNeedGlow(null); }
  }
  function onDragLeave(jar: "need" | "want") {
    if (jar === "need") setNeedGlow(null);
    else setWantGlow(null);
  }
  function onDrop(e: React.DragEvent, jar: "need" | "want") {
    e.preventDefault();
    handlePlace(jar);
  }

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
  const score = placedItems.filter((i) => i.correct).length;
  const needsPlaced = placedItems.filter((i) => i.placedIn === "need");
  const wantsPlaced = placedItems.filter((i) => i.placedIn === "want");
  const isLowTime = timeLeft <= 30;

  // ── MENU ──────────────────────────────────────────────────────────────────
  if (phase === "menu") {
    return (
      <div className="min-h-screen flex items-center justify-center py-8" style={bgStyle}>
        <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-10 max-w-lg w-full mx-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Logo size="md" className="mr-4" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
              Budgeting Jars
            </h1>
          </div>
          <div className="flex justify-center gap-6 mb-6">
            <GlassJar label="Needs" color="blue" items={[]} glow={null} small />
            <GlassJar label="Wants" color="purple" items={[]} glow={null} small />
          </div>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Drag each item into the correct jar —{" "}
            <strong className="text-blue-700">Needs</strong> or{" "}
            <strong className="text-purple-700">Wants</strong>!
          </p>
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-2 text-blue-800">⏱️ <strong>2 minutes</strong></div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl px-4 py-2 text-green-800">📦 <strong>10 items</strong></div>
          </div>
          <button
            onClick={startGame}
            className="px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🎮 Start Game!
          </button>
          <div className="mt-6">
            <Link to="/financial-literacy" className="text-gray-400 hover:text-gray-600 underline text-sm">
              ← Back to Financial Literacy
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── FINISHED ──────────────────────────────────────────────────────────────
  if (phase === "finished") {
    const pct = Math.round((score / ALL_ITEMS.length) * 100);

    return (
      <div className="min-h-screen py-8 px-4" style={bgStyle}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-8 text-center mb-8">
            <div className="text-5xl mb-3">{pct === 100 ? "🏆" : pct >= 70 ? "🌟" : "💪"}</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Game Over!</h2>
            <p className="text-xl text-gray-600 mb-6">
              You got <span className="font-bold text-green-600">{score}</span> out of{" "}
              <span className="font-bold">{ALL_ITEMS.length}</span> correct ({pct}%)
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all">
                🔄 Play Again
              </button>
              <Link to="/financial-literacy" className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all inline-block">
                ← Back
              </Link>
            </div>
          </div>

          {/* Result jars side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResultJar title="Needs 🧰" color="blue" placedItems={needsPlaced} />
            <ResultJar title="Wants 🎁" color="purple" placedItems={wantsPlaced} />
          </div>
        </div>
      </div>
    );
  }

  // ── PLAYING ───────────────────────────────────────────────────────────────
  const currentItem = items[currentIndex];

  return (
    <div style={{ ...bgStyle, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-xl border-b-4 border-yellow-300 px-6 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Logo size="sm" />
          <span className="font-bold text-gray-700 text-lg">Budgeting Jars</span>
        </div>
        <div className="flex gap-3 items-center">
          <div className="bg-green-100 border-2 border-green-400 rounded-xl px-4 py-1.5 font-bold text-green-800 text-sm">
            ✅ {score} / {ALL_ITEMS.length}
          </div>
          <div className={`border-2 rounded-xl px-4 py-1.5 font-bold text-lg ${isLowTime ? "bg-red-100 border-red-400 text-red-700 animate-pulse" : "bg-blue-100 border-blue-400 text-blue-800"}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white/20 h-2 w-full">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
          style={{ width: `${(currentIndex / items.length) * 100}%` }}
        />
      </div>

      {/* Main game area — fills remaining height */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* NEEDS JAR — full left section */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: "24px 16px" }}
          onDragOver={(e) => onDragOver(e, "need")}
          onDragLeave={() => onDragLeave("need")}
          onDrop={(e) => onDrop(e, "need")}
          onClick={() => !animatingOut && handlePlace("need")}
        >
          <GlassJar label="Needs" color="blue" items={needsPlaced} glow={needGlow} fill />
          <p className="mt-4 text-white/80 text-base font-semibold text-center">Things you must have</p>
        </div>

        {/* CENTER — draggable item card */}
        <div style={{ width: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "16px 0" }}>
          <div
            draggable={!animatingOut}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`bg-white rounded-3xl shadow-2xl border-4 border-yellow-300 text-center select-none transition-all duration-300 ${
              animatingOut ? "opacity-0 scale-75" : "opacity-100 scale-100"
            } ${isDragging ? "scale-110 rotate-3 cursor-grabbing" : "cursor-grab hover:scale-105"}`}
            style={{ width: 210, padding: "32px 24px" }}
          >
            <div style={{ fontSize: 100, lineHeight: 1.1 }} className="pointer-events-none mb-4">{currentItem?.emoji}</div>
            <div className="text-3xl font-extrabold text-gray-800 pointer-events-none leading-tight">{currentItem?.name}</div>
            <div className="text-2xl font-bold text-green-600 pointer-events-none mt-1">${currentItem?.value}</div>
            <div className="text-sm text-gray-400 mt-2 pointer-events-none font-medium">{currentIndex + 1} / {items.length}</div>
          </div>
          <p className="text-white/70 text-sm font-medium text-center">
            {isDragging ? "Drop it in a jar! 🎯" : "Drag to a jar\nor tap one 👆"}
          </p>
        </div>

        {/* WANTS JAR — full right section */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: "24px 16px" }}
          onDragOver={(e) => onDragOver(e, "want")}
          onDragLeave={() => onDragLeave("want")}
          onDrop={(e) => onDrop(e, "want")}
          onClick={() => !animatingOut && handlePlace("want")}
        >
          <GlassJar label="Wants" color="purple" items={wantsPlaced} glow={wantGlow} fill />
          <p className="mt-4 text-white/80 text-base font-semibold text-center">Nice but not essential</p>
        </div>

      </div>
    </div>
  );
}

// ── Glass Jar Component ───────────────────────────────────────────────────

interface GlassJarProps {
  label: string;
  color: "blue" | "purple";
  items: PlacedItem[];
  glow: JarGlow;
  small?: boolean;
  fill?: boolean; // stretches jar to fill parent container
}

function GlassJar({ label, color, items, glow, small = false, fill = false }: GlassJarProps) {
  const isBlue = color === "blue";
  const accentColor = isBlue ? "#3B82F6" : "#9333EA";
  const lidColor = isBlue ? "rgba(59,130,246,0.4)" : "rgba(147,51,234,0.4)";

  const borderColor =
    glow === "correct"   ? "#22C55E"
    : glow === "incorrect" ? "#EF4444"
    : glow === "hover"     ? accentColor
    : "rgba(255,255,255,0.55)";

  const glowShadow =
    glow === "correct"   ? "0 0 40px 12px rgba(34,197,94,0.75)"
    : glow === "incorrect" ? "0 0 40px 12px rgba(239,68,68,0.75)"
    : glow === "hover"     ? `0 0 28px 6px ${accentColor}99`
    : "0 8px 32px rgba(0,0,0,0.18)";

  // Dimensions
  const jarW      = small ? 70    : fill ? "100%" : 130;
  const jarH      = small ? 90    : fill ? "100%" : 200;
  const lidW      = small ? 80    : fill ? "110%" : 148;
  const lidH      = small ? 12    : fill ? 32     : 20;
  const labelSize = small ? "text-sm" : fill ? "text-5xl" : "text-2xl";
  const shineW    = small ? 8     : 18;
  const shineArcH = small ? 6     : 14;

  // 4 rows × 3 cols = 12 slots; always render all 12 (empty or filled)
  const TOTAL_SLOTS = 12;
  const visibleItems = items.slice(0, TOTAL_SLOTS);

  const jarBodyStyle: React.CSSProperties = {
    width: jarW,
    height: jarH,
    flex: fill ? 1 : undefined,
    background: "rgba(255,255,255,0.10)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: `4px solid ${borderColor}`,
    borderTop: "none",
    borderRadius: "0 0 36px 36px",
    position: "relative",
    overflow: "hidden",
    transition: "border-color 0.25s, box-shadow 0.25s",
    boxShadow: glowShadow,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: fill ? "85%" : undefined, height: fill ? "85%" : undefined }}>
      {/* Label */}
      <div
        className={`font-extrabold mb-3 tracking-wide ${labelSize}`}
        style={{ color: "white", textShadow: `0 0 16px ${accentColor}, 0 2px 4px rgba(0,0,0,0.4)` }}
      >
        {label}
      </div>

      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", flex: fill ? 1 : undefined }}>
        {/* Lid */}
        <div
          style={{
            width: lidW,
            height: lidH,
            background: lidColor,
            border: `3px solid ${borderColor}`,
            borderBottom: "none",
            borderRadius: "12px 12px 0 0",
            backdropFilter: "blur(6px)",
            transition: "border-color 0.25s, box-shadow 0.25s",
            boxShadow: glowShadow,
            flexShrink: 0,
          }}
        />

        {/* Jar body */}
        <div style={jarBodyStyle}>

          {/* Glass shine — vertical left strip */}
          <div style={{ position: "absolute", top: 0, left: 12, width: shineW, height: "82%", background: "linear-gradient(to right, rgba(255,255,255,0.38), transparent)", borderRadius: "0 0 10px 10px", pointerEvents: "none" }} />
          {/* Glass shine — top horizontal arc */}
          <div style={{ position: "absolute", top: 8, left: "12%", width: "76%", height: shineArcH, background: "rgba(255,255,255,0.22)", borderRadius: "50%", pointerEvents: "none" }} />
          {/* Bottom shine */}
          <div style={{ position: "absolute", bottom: 10, left: "10%", width: "80%", height: 6, background: "rgba(255,255,255,0.12)", borderRadius: "50%", pointerEvents: "none" }} />

          {fill ? (
            /* FILL MODE — 4 rows × 3 cols = 12 slots, always visible as a grid */
            <div style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridTemplateRows: "1fr 1fr 1fr 1fr",
              padding: "10px 8px 16px",
              gap: 5,
            }}>
              {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
                const item = visibleItems[i] as PlacedItem | undefined;
                const filled = !!item;
                const isCorrect = filled ? item!.correct : false;
                const boxBg = filled
                  ? isCorrect ? "rgba(34,197,94,0.32)" : "rgba(239,68,68,0.32)"
                  : "transparent";
                const boxBorder = filled
                  ? isCorrect ? "rgba(34,197,94,0.6)" : "rgba(239,68,68,0.6)"
                  : "transparent";
                const mark = isCorrect ? "✅" : "❌";

                return (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      background: boxBg,
                      border: `1.5px solid ${boxBorder}`,
                      borderRadius: 10,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      overflow: "hidden",
                      transition: "background 0.3s, border-color 0.3s",
                    }}
                  >
                    {filled ? (
                      <>
                        {/* Faded watermark */}
                        <span style={{ position: "absolute", top: 2, right: 3, fontSize: 11, opacity: 0.3, lineHeight: 1, pointerEvents: "none" }}>
                          {mark}
                        </span>
                        {/* Emoji */}
                        <span style={{ fontSize: 34, lineHeight: 1, filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.4))" }}>
                          {item!.emoji}
                        </span>
                        {/* Name */}
                        <span style={{ color: "white", fontWeight: 700, fontSize: 11, textShadow: "0 1px 3px rgba(0,0,0,0.8)", textAlign: "center", lineHeight: 1.1, padding: "0 2px" }}>
                          {item!.name}
                        </span>
                        {/* Value */}
                        <span style={{ color: "#86efac", fontWeight: 800, fontSize: 11, textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
                          ${item!.value}
                        </span>
                        {/* Mark */}
                        <span style={{ fontSize: 12, lineHeight: 1 }}>{mark}</span>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : (
            /* SMALL / DEFAULT MODE — plain emoji cluster */
            <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, padding: "0 6px" }}>
              {visibleItems.map((item, i) => (
                <span key={i} style={{ fontSize: small ? 12 : 20, lineHeight: 1.2 }} title={item.name}>
                  {item.emoji}
                </span>
              ))}
            </div>
          )}

          {/* Count badge */}
          {items.length > 0 && !small && (
            <div style={{ position: "absolute", top: 10, right: 10, background: accentColor, color: "white", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: "bold", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}>
              {items.length}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Result Jar (end screen) ───────────────────────────────────────────────

interface ResultJarProps {
  title: string;
  color: "blue" | "purple";
  placedItems: PlacedItem[];
}

function ResultJar({ title, color, placedItems }: ResultJarProps) {
  const border = color === "blue" ? "border-blue-300" : "border-purple-300";
  const header = color === "blue" ? "text-blue-800" : "text-purple-800";
  const total = placedItems.reduce((sum, i) => sum + i.value, 0);

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-4 ${border} p-6`}>
      <h3 className={`text-xl font-bold ${header} mb-1 text-center`}>{title}</h3>
      <p className="text-center text-green-700 font-bold text-lg mb-4">Total: ${total}</p>
      {placedItems.length === 0 ? (
        <p className="text-center text-gray-400 text-sm">No items placed here</p>
      ) : (
        <ul className="space-y-2">
          {placedItems.map((item, i) => (
            <li
              key={i}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl border-2 ${
                item.correct
                  ? "bg-green-50 border-green-300 text-green-800"
                  : "bg-red-50 border-red-300 text-red-800"
              }`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="font-semibold flex-1">{item.name}</span>
              <span className="font-bold text-green-700">${item.value}</span>
              <span className="text-lg">{item.correct ? "✅" : "❌"}</span>
              {!item.correct && (
                <span className="text-xs text-gray-500 italic">(is a {item.category})</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const bgStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #22C55E 0%, #16A34A 25%, #15803D 50%, #166534 75%, #14532D 100%)",
};
