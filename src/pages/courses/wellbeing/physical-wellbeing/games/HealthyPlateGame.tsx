import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../../components";
import { useGameUser } from "../../../../../context/GameUserContext";
import { generateSessionId } from "../../../../../lib/sessionId";

const GAME_ID = "healthy-plate";
const GAME_DURATION = 90;
const MAX_PLATE = 6;

interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  healthScore: number;
  category: "vegetable" | "fruit" | "protein" | "grain" | "junk";
}

const ALL_FOODS: FoodItem[] = [
  { id: "broccoli", name: "Broccoli",    emoji: "🥦", healthScore: 10, category: "vegetable" },
  { id: "carrot",   name: "Carrot",      emoji: "🥕", healthScore: 10, category: "vegetable" },
  { id: "spinach",  name: "Spinach",     emoji: "🥬", healthScore: 10, category: "vegetable" },
  { id: "corn",     name: "Corn",        emoji: "🌽", healthScore: 9,  category: "vegetable" },
  { id: "apple",    name: "Apple",       emoji: "🍎", healthScore: 9,  category: "fruit"     },
  { id: "orange",   name: "Orange",      emoji: "🍊", healthScore: 9,  category: "fruit"     },
  { id: "grapes",   name: "Grapes",      emoji: "🍇", healthScore: 9,  category: "fruit"     },
  { id: "chicken",  name: "Chicken",     emoji: "🍗", healthScore: 8,  category: "protein"   },
  { id: "fish",     name: "Fish",        emoji: "🐟", healthScore: 9,  category: "protein"   },
  { id: "egg",      name: "Egg",         emoji: "🥚", healthScore: 8,  category: "protein"   },
  { id: "rice",     name: "Brown Rice",  emoji: "🍚", healthScore: 7,  category: "grain"     },
  { id: "bread",    name: "Whole Bread", emoji: "🍞", healthScore: 6,  category: "grain"     },
  { id: "pizza",    name: "Pizza",       emoji: "🍕", healthScore: 2,  category: "junk"      },
  { id: "burger",   name: "Burger",      emoji: "🍔", healthScore: 1,  category: "junk"      },
  { id: "fries",    name: "Fries",       emoji: "🍟", healthScore: 1,  category: "junk"      },
  { id: "candy",    name: "Candy",       emoji: "🍬", healthScore: 0,  category: "junk"      },
  { id: "soda",     name: "Soda",        emoji: "🥤", healthScore: 0,  category: "junk"      },
  { id: "donut",    name: "Donut",       emoji: "🍩", healthScore: 0,  category: "junk"      },
];

// 6 hexagonal slot centres — radius 33% from plate centre, one per sector (30°, 90°, 150°, 210°, 270°, 330° clockwise from top)
const R = 33;
const SLOT_POSITIONS = [30, 90, 150, 210, 270, 330].map(deg => {
  const rad = (deg - 90) * (Math.PI / 180);
  return {
    left: `${50 + R * Math.cos(rad)}%`,
    top:  `${50 + R * Math.sin(rad)}%`,
  };
});

// 6 division lines from centre to circumference (0°, 60°, 120°, 180°, 240°, 300° from top)
const DIVISION_LINES = [0, 60, 120, 180, 240, 300].map(deg => {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x2: 50 + 50 * Math.cos(rad), y2: 50 + 50 * Math.sin(rad) };
});

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcHealthPct(items: FoodItem[]) {
  if (!items.length) return 0;
  return Math.round(items.reduce((s, f) => s + f.healthScore, 0) / (items.length * 10) * 100);
}

interface FoodCardProps { food: FoodItem; placed: boolean; }

function FoodCard({ food, placed }: FoodCardProps) {
  const isJunk = food.healthScore < 6;
  return (
    <div
      draggable={!placed}
      onDragStart={e => { if (!placed) e.dataTransfer.setData("foodId", food.id); }}
      className="flex flex-col items-center justify-center gap-1 rounded-2xl select-none transition-all duration-200"
      style={{
        background: placed
          ? "rgba(255,255,255,0.1)"
          : isJunk
          ? "rgba(254,202,202,0.92)"
          : "rgba(255,255,255,0.92)",
        border: `2px solid ${placed ? "rgba(255,255,255,0.12)" : isJunk ? "#fca5a5" : "rgba(255,255,255,0.5)"}`,
        opacity: placed ? 0.3 : 1,
        cursor: placed ? "default" : "grab",
        boxShadow: placed ? "none" : "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <span style={{ fontSize: "clamp(28px, 3.5vw, 48px)", lineHeight: 1 }}>{food.emoji}</span>
      <span
        className="font-bold text-center leading-tight px-1"
        style={{
          fontSize: "clamp(10px, 1vw, 13px)",
          color: placed ? "rgba(255,255,255,0.35)" : isJunk ? "#b91c1c" : "#14532d",
        }}
      >
        {food.name}
      </span>
    </div>
  );
}

type Phase = "menu" | "playing" | "finished";

export function HealthyPlateGame(): React.JSX.Element {
  const [phase,      setPhase]      = useState<Phase>("menu");
  const [foods,      setFoods]      = useState<FoodItem[]>([]);
  const [plateFoods, setPlateFoods] = useState<FoodItem[]>([]);
  const [timeLeft,   setTimeLeft]   = useState(GAME_DURATION);
  const [plateOver,  setPlateOver]  = useState(false);
  const [flash,      setFlash]      = useState<{ text: string; good: boolean } | null>(null);

  const sessionIdRef  = useRef("");
  const plateFoodsRef = useRef<FoodItem[]>([]);
  const { trackEvent } = useGameUser();

  useEffect(() => { plateFoodsRef.current = plateFoods; }, [plateFoods]);

  function startGame() {
    const shuffled = shuffle(ALL_FOODS);
    setFoods(shuffled);
    setPlateFoods([]);
    plateFoodsRef.current = [];
    setTimeLeft(GAME_DURATION);
    setFlash(null);
    setPhase("playing");
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          finishGame(plateFoodsRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  function finishGame(items: FoodItem[]) {
    const score = calcHealthPct(items);
    trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score });
    setPlateFoods(items);
    setPhase("finished");
  }

  function handleDrop(foodId: string) {
    const current = plateFoodsRef.current;
    if (current.length >= MAX_PLATE) return;
    const food = foods.find(f => f.id === foodId);
    if (!food || current.find(f => f.id === foodId)) return;
    const good = food.healthScore >= 6;
    setFlash({ text: good ? `Healthy! ${food.emoji}` : `Junk food! ${food.emoji}`, good });
    setTimeout(() => setFlash(null), 1000);
    const newPlate = [...current, food];
    setPlateFoods(newPlate);
    plateFoodsRef.current = newPlate;
    if (newPlate.length >= MAX_PLATE) setTimeout(() => finishGame(newPlate), 700);
  }

  function removeFromPlate(foodId: string) {
    if (phase !== "playing") return;
    const newPlate = plateFoodsRef.current.filter(f => f.id !== foodId);
    setPlateFoods(newPlate);
    plateFoodsRef.current = newPlate;
  }

  const bgStyle = { background: "linear-gradient(135deg, #86efac 0%, #4ade80 25%, #22c55e 60%, #15803d 100%)" };
  const healthPct  = calcHealthPct(plateFoods);
  const timerPct   = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 30 ? "#16a34a" : timeLeft > 10 ? "#f59e0b" : "#ef4444";
  const placedIds  = new Set(plateFoods.map(f => f.id));
  const leftFoods  = foods.slice(0, 9);
  const rightFoods = foods.slice(9);

  /* ── MENU ── */
  if (phase === "menu") return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={bgStyle}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-green-300 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-7xl mb-3">🍽️</div>
        <h1 className="text-4xl font-black text-green-800 mb-2">Healthy Plate Builder</h1>
        <p className="text-gray-600 text-lg mb-5 leading-relaxed">
          Build a healthy meal! Drag <strong>6 foods</strong> onto the plate — choose wisely!
        </p>
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-6 text-left text-sm text-green-800 space-y-1">
          <p className="font-black mb-1">How to play:</p>
          <p>1️⃣ Drag foods from the sides onto the plate</p>
          <p>2️⃣ Fill all 6 sections of the plate</p>
          <p>3️⃣ The healthier your picks, the higher your score!</p>
          <p>🥦 Vegetables, fruits & proteins = top marks</p>
          <p>⏱️ You have {GAME_DURATION} seconds!</p>
        </div>
        <button onClick={startGame} className="px-10 py-4 bg-gradient-to-r from-green-500 to-lime-500 text-white text-2xl font-black rounded-full shadow-lg hover:scale-105 transition-transform">
          Build My Plate! 🍽️
        </button>
        <div className="mt-4">
          <Link to="/physical-wellbeing" className="text-green-600 hover:text-green-800 font-semibold text-sm">← Back</Link>
        </div>
      </div>
    </div>
  );

  /* ── FINISHED ── */
  if (phase === "finished") {
    const pct   = calcHealthPct(plateFoods);
    const medal = pct >= 80 ? "🏆" : pct >= 60 ? "🌟" : pct >= 40 ? "💪" : "😬";
    const msg   = pct >= 80 ? "Super Healthy Plate!" : pct >= 60 ? "Pretty Good Choice!" : pct >= 40 ? "Needs more veggies!" : "Too much junk food!";
    const barBg = pct >= 70 ? "linear-gradient(90deg,#22c55e,#4ade80)" : pct >= 40 ? "linear-gradient(90deg,#f59e0b,#fbbf24)" : "linear-gradient(90deg,#ef4444,#f87171)";
    return (
      <div className="min-h-screen py-8 px-4" style={bgStyle}>
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-green-300 p-8 text-center">
            <div className="text-6xl mb-3 animate-bounce">{medal}</div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">{msg}</h2>
            <div className="flex justify-center gap-6 mb-5">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-6 py-3">
                <div className="text-3xl font-black text-green-600">{pct}</div>
                <div className="text-sm text-green-800 font-bold">Health Score</div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-6 py-3">
                <div className="text-3xl font-black text-green-600">
                  {plateFoods.filter(f => f.healthScore >= 6).length}/{plateFoods.length}
                </div>
                <div className="text-sm text-green-800 font-bold">Healthy Picks</div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-full h-5 overflow-hidden mb-6">
              <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, background: barBg }} />
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {plateFoods.map(food => {
                const good = food.healthScore >= 6;
                return (
                  <div key={food.id} className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl"
                    style={{ background: good ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", border: `2px solid ${good ? "#22c55e" : "#ef4444"}` }}>
                    <span className="text-4xl">{food.emoji}</span>
                    <span className="text-xs font-bold" style={{ color: good ? "#15803d" : "#b91c1c" }}>{food.name} {good ? "✅" : "❌"}</span>
                    <span className="text-xs text-gray-400">{food.healthScore}/10</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 justify-center pb-4">
            <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white font-black text-lg rounded-full shadow-lg hover:scale-105 transition-transform">Try Again 🔄</button>
            <Link to="/physical-wellbeing" className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform inline-block">← Back</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── PLAYING ── */
  return (
    <div className="min-h-screen flex flex-col relative" style={bgStyle}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-sm flex-shrink-0">
        <Link to="/physical-wellbeing" className="text-white/70 hover:text-white font-semibold text-sm">← Exit</Link>
        <span className="text-white font-black text-lg">🍽️ Healthy Plate</span>
        <span className="text-white/80 text-sm font-semibold">{plateFoods.length} / {MAX_PLATE} filled</span>
      </div>

      {/* Timer bar */}
      <div className="h-2 bg-white/20 flex-shrink-0">
        <div className="h-full transition-all duration-1000" style={{ width: `${timerPct}%`, background: timerColor }} />
      </div>
      <div className="flex justify-between px-6 py-1 flex-shrink-0">
        <span className="font-black text-base" style={{ color: timeLeft <= 10 ? "#fca5a5" : "white" }}>⏱️ {timeLeft}s</span>
        <span className="text-white/70 text-sm">Drag foods onto the plate!</span>
      </div>

      {/* Flash toast */}
      {flash && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-2xl font-black px-10 py-5 rounded-3xl shadow-2xl animate-bounce"
            style={{ background: flash.good ? "#22c55e" : "#ef4444", color: "white" }}>
            {flash.text}
          </div>
        </div>
      )}

      {/* 3-column layout — fills remaining height */}
      <div className="flex-1 flex gap-3 px-3 pb-3 pt-1 overflow-hidden">

        {/* LEFT food panel — 2-column grid filling full height */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest text-center flex-shrink-0 mb-1">Foods</p>
          <div className="flex-1 grid grid-cols-2 gap-2" style={{ gridTemplateRows: `repeat(${Math.ceil(leftFoods.length / 2)}, 1fr)` }}>
            {leftFoods.map(food => (
              <FoodCard key={food.id} food={food} placed={placedIds.has(food.id)} />
            ))}
          </div>
        </div>

        {/* CENTER — plate */}
        <div className="flex flex-col items-center justify-center gap-2 flex-shrink-0" style={{ width: "clamp(280px, 40vw, 520px)" }}>

          {/* Health bar */}
          <div className="w-full">
            <div className="flex justify-between text-xs font-bold text-white/80 mb-1">
              <span>Health Score</span><span>{healthPct}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${healthPct}%`, background: healthPct >= 70 ? "#22c55e" : healthPct >= 40 ? "#f59e0b" : "#ef4444" }} />
            </div>
          </div>

          {/* The Plate — outer rim */}
          <div
            className="rounded-full flex-shrink-0 transition-all duration-200 flex items-center justify-center"
            style={{
              width:  "clamp(260px, 38vw, 500px)",
              height: "clamp(260px, 38vw, 500px)",
              background: "conic-gradient(from 0deg, #ef4444 0deg, #f97316 60deg, #eab308 120deg, #22c55e 180deg, #3b82f6 240deg, #a855f7 300deg, #ef4444 360deg)",
              boxShadow: plateOver
                ? "0 0 48px rgba(34,197,94,0.6), 0 12px 48px rgba(0,0,0,0.3)"
                : "0 12px 48px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)",
              transform: plateOver ? "scale(1.025)" : "scale(1)",
              padding: "clamp(10px, 1.4vw, 18px)",
            }}
          >
            {/* Eating surface */}
            <div
              onDragOver={e => { e.preventDefault(); setPlateOver(true); }}
              onDragLeave={() => setPlateOver(false)}
              onDrop={e => { e.preventDefault(); setPlateOver(false); handleDrop(e.dataTransfer.getData("foodId")); }}
              className="relative rounded-full w-full h-full overflow-hidden"
              style={{
                background: plateOver
                  ? "radial-gradient(circle at 38% 32%, #ffffff 0%, #fdfbf5 50%, #f5f0e4 100%)"
                  : "radial-gradient(circle at 38% 32%, #fffef8 0%, #faf7ef 50%, #ede8d8 100%)",
                boxShadow: "inset 0 4px 18px rgba(0,0,0,0.09), inset 0 -3px 8px rgba(255,255,255,0.7)",
              }}
            >
            {/* Division lines SVG */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
            >
              {/* Subtle inner rim shadow ring */}
              <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1.5" />
              {/* Centre hub */}
              <circle cx="50" cy="50" r="8" fill="rgba(0,0,0,0.03)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" />
              {/* 6 division lines */}
              {DIVISION_LINES.map((pt, i) => (
                <line key={i} x1="50" y1="50" x2={pt.x2} y2={pt.y2}
                  stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" strokeDasharray="none" />
              ))}
            </svg>

            {/* Empty hint */}
            {plateFoods.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="text-center">
                  <div className="text-5xl mb-1 opacity-20">🍽️</div>
                  <div className="text-sm font-bold text-gray-300">Drop food here</div>
                </div>
              </div>
            )}

            {/* Food slots — one per sector */}
            {SLOT_POSITIONS.map((pos, i) => {
              const food = plateFoods[i];
              return (
                <div
                  key={i}
                  onClick={() => food && removeFromPlate(food.id)}
                  className="absolute flex flex-col items-center justify-center rounded-full transition-all duration-300 z-20"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    width: "clamp(52px, 6vw, 78px)",
                    height: "clamp(52px, 6vw, 78px)",
                    transform: "translate(-50%, -50%)",
                    background: food ? "rgba(255,255,255,0.96)" : "rgba(0,0,0,0.03)",
                    border: food
                      ? `3px solid ${food.healthScore >= 6 ? "#22c55e" : "#ef4444"}`
                      : "2px dashed rgba(0,0,0,0.1)",
                    boxShadow: food ? "0 3px 12px rgba(0,0,0,0.18)" : "none",
                    cursor: food ? "pointer" : "default",
                  }}
                  title={food ? `${food.name} — tap to remove` : ""}
                >
                  {food ? (
                    <>
                      <span style={{ fontSize: "clamp(20px, 2.5vw, 32px)", lineHeight: 1 }}>{food.emoji}</span>
                      <span className="text-center font-bold px-1 mt-0.5 leading-none"
                        style={{ fontSize: "clamp(7px, 0.7vw, 10px)", color: food.healthScore >= 6 ? "#15803d" : "#b91c1c" }}>
                        {food.name}
                      </span>
                    </>
                  ) : (
                    <span className="font-black text-gray-200" style={{ fontSize: "clamp(14px, 1.5vw, 22px)" }}>{i + 1}</span>
                  )}
                </div>
              );
            })}
            </div>{/* end eating surface */}
          </div>{/* end rim */}

          {/* Label */}
          <div className="text-center">
            <p className="text-white font-black" style={{ fontSize: "clamp(13px, 1.3vw, 18px)" }}>My Healthy Plate</p>
            {plateFoods.length > 0 && plateFoods.length < MAX_PLATE && (
              <p className="text-white/60 text-xs mt-0.5">{MAX_PLATE - plateFoods.length} more · tap item to remove</p>
            )}
            {plateFoods.length === MAX_PLATE && (
              <p className="text-yellow-300 font-black text-sm mt-0.5 animate-pulse">Plate full! Scoring…</p>
            )}
          </div>
        </div>

        {/* RIGHT food panel — 2-column grid filling full height */}
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest text-center flex-shrink-0 mb-1">Foods</p>
          <div className="flex-1 grid grid-cols-2 gap-2" style={{ gridTemplateRows: `repeat(${Math.ceil(rightFoods.length / 2)}, 1fr)` }}>
            {rightFoods.map(food => (
              <FoodCard key={food.id} food={food} placed={placedIds.has(food.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
