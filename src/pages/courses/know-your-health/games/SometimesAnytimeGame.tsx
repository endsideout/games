import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";

const GAME_ID       = "sometimes-anytime-food";
const GAME_DURATION = 60; // seconds
const POINTS_CORRECT = 10;

// ── Benefit SVGs (anytime foods) ─────────────────────────────────────────────

function GradesPaperSVG() {
  return (
    <svg viewBox="0 0 110 130" width="110" height="130">
      <g transform="rotate(-10 55 65)">
        <rect x="12" y="8" width="78" height="104" rx="5" fill="#f9f5c0" stroke="#ccc" strokeWidth="1.5" />
        <text x="68" y="40" textAnchor="middle" fill="#cc0000" fontSize="28" fontWeight="bold" fontFamily="Georgia, serif">A+</text>
        <line x1="22" y1="30" x2="50" y2="30" stroke="#555" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="22" y1="38" x2="48" y2="38" stroke="#555" strokeWidth="1.4" strokeLinecap="round" />
        {[52, 63, 74, 85, 96].map(y => (
          <line key={y} x1="22" y1={y} x2="82" y2={y} stroke="#555" strokeWidth="1.3" strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
}

function BooksSVG() {
  return (
    <svg viewBox="0 0 150 120" width="140" height="112">
      <rect x="4"  y="92" width="60" height="12" rx="3" fill="#aed6f1" stroke="#1a252f" strokeWidth="1.8" transform="rotate(-6 34 98)" />
      <rect x="68" y="93" width="52" height="10" rx="3" fill="#e8e8d8" stroke="#1a252f" strokeWidth="1.8" transform="rotate(-6 94 98)" />
      <line x1="72" y1="95" x2="116" y2="93" stroke="#999" strokeWidth="0.8" transform="rotate(-6 94 94)" />
      <line x1="72" y1="99" x2="116" y2="97" stroke="#999" strokeWidth="0.8" transform="rotate(-6 94 98)" />
      <rect x="22" y="68" width="90" height="16" rx="4" fill="#e74c3c" stroke="#1a252f" strokeWidth="1.8" />
      <rect x="26" y="52" width="85" height="16" rx="4" fill="#27ae60" stroke="#1a252f" strokeWidth="1.8" />
      <rect x="24" y="36" width="88" height="16" rx="4" fill="#f39c12" stroke="#1a252f" strokeWidth="1.8" />
      <rect x="28" y="20" width="82" height="16" rx="4" fill="#3498db" stroke="#1a252f" strokeWidth="1.8" />
    </svg>
  );
}

function ImmunitySVG() {
  return (
    <svg viewBox="0 0 120 120" width="110" height="110">
      <path d="M60 8 L100 24 L100 60 Q100 90 60 110 Q20 90 20 60 L20 24 Z"
        fill="#d5f5e3" stroke="#27ae60" strokeWidth="3" />
      <polyline points="40,62 55,77 82,45" fill="none" stroke="#27ae60" strokeWidth="5"
        strokeLinecap="round" strokeLinejoin="round" />
      <text x="30" y="28" fontSize="14">⭐</text>
      <text x="78" y="28" fontSize="10">✨</text>
    </svg>
  );
}

// ── Non-benefit SVGs (sometimes foods) ───────────────────────────────────────

function ToothSVG() {
  return (
    <svg viewBox="0 0 100 130" width="90" height="117">
      <path d="M20 42 Q14 22 28 14 Q38 8 50 18 Q62 8 72 14 Q86 22 80 42 Q77 68 70 84 Q65 98 58 98 Q53 97 51 87 Q50 82 49 87 Q47 97 42 98 Q35 98 30 84 Q23 68 20 42Z"
        fill="white" stroke="#d1d5db" strokeWidth="2.5" />
      <ellipse cx="48" cy="60" rx="10" ry="8" fill="#fca5a5" opacity="0.7" />
      <line x1="42" y1="54" x2="54" y2="66" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <line x1="54" y1="54" x2="42" y2="66" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <text x="50" y="26" textAnchor="middle" fontSize="14">😬</text>
    </svg>
  );
}

function BadHeartSVG() {
  return (
    <svg viewBox="0 0 120 110" width="110" height="100">
      <path d="M60 92 C22 68 10 44 10 34 C10 19 22 9 35 9 C45 9 55 15 60 23 C65 15 75 9 85 9 C98 9 110 19 110 34 C110 44 98 68 60 92 Z"
        fill="#fca5a5" stroke="#ef4444" strokeWidth="2.5" />
      <text x="60" y="58" textAnchor="middle" fontSize="26">😢</text>
    </svg>
  );
}

function SugarSpikeSVG() {
  return (
    <svg viewBox="0 0 120 120" width="110" height="110">
      {/* Warning triangle */}
      <polygon points="60,10 110,100 10,100" fill="#fef3c7" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round" />
      <text x="60" y="78" textAnchor="middle" fontSize="42" fill="#d97706">!</text>
      <text x="60" y="100" textAnchor="middle" fontSize="10" fill="#92400e" fontWeight="bold">HIGH SUGAR</text>
    </svg>
  );
}

type EffectIcon = "grades" | "books" | "immunity" | "tooth" | "badheart" | "sugar";

interface FoodEffect {
  icon: EffectIcon;
  text: string;
}

function EffectIllustration({ icon }: { icon: EffectIcon }) {
  if (icon === "grades")   return <GradesPaperSVG />;
  if (icon === "books")    return <BooksSVG />;
  if (icon === "immunity") return <ImmunitySVG />;
  if (icon === "tooth")    return <ToothSVG />;
  if (icon === "badheart") return <BadHeartSVG />;
  return <SugarSpikeSVG />;
}

// ── Food data ─────────────────────────────────────────────────────────────────

interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  category: "sometimes" | "anytime";
  hint?: string;
  benefit?: FoodEffect;
  nonBenefit?: FoodEffect;
}

const MODE1_FOODS: FoodItem[] = [
  { id: "cookie",    name: "Cookie",    emoji: "🍪", category: "sometimes" },
  { id: "apple",     name: "Apple",     emoji: "🍎", category: "anytime" },
  { id: "banana",    name: "Banana",    emoji: "🍌", category: "anytime" },
  { id: "chocolate", name: "Chocolate", emoji: "🍫", category: "sometimes" },
  { id: "broccoli",  name: "Broccoli",  emoji: "🥦", category: "anytime" },
];

const MODE2_FOODS: FoodItem[] = [
  {
    id: "fries", name: "French Fries", emoji: "🍟", category: "sometimes",
    hint: "High in fat & sodium — save it for special days!",
    nonBenefit: { icon: "badheart", text: "Too much fat is bad for your heart!" },
  },
  {
    id: "cookie", name: "Cookie", emoji: "🍪", category: "sometimes",
    hint: "High in added sugar — enjoy occasionally!",
    nonBenefit: { icon: "tooth", text: "Too much sugar harms your teeth!" },
  },
  {
    id: "chocolate", name: "Chocolate", emoji: "🍫", category: "sometimes",
    hint: "High in sugar & fat — a treat, not everyday!",
    nonBenefit: { icon: "sugar", text: "High sugar spikes your energy & crashes it!" },
  },
  {
    id: "apple", name: "Apple", emoji: "🍎", category: "anytime",
    hint: "Packed with fibre & vitamins!",
    benefit: { icon: "books", text: "Helps focus in class" },
  },
  {
    id: "banana", name: "Banana", emoji: "🍌", category: "anytime",
    hint: "Great source of energy & potassium!",
    benefit: { icon: "grades", text: "Helps get better grades" },
  },
  {
    id: "broccoli", name: "Broccoli", emoji: "🥦", category: "anytime",
    hint: "Packed with vitamins & fibre!",
    benefit: { icon: "immunity", text: "Boosts your immunity" },
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "mode-select" | "playing" | "result";
type Mode  = "mode1" | "mode2";

interface PlacedEntry { food: FoodItem; correct: boolean; }

interface Flash {
  zone: "sometimes" | "anytime";
  food: FoodItem;
  correct: boolean;
}

// ── Mini placed card ──────────────────────────────────────────────────────────
function PlacedCard({ entry, dim }: { entry: PlacedEntry; dim: boolean }) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        background: "white",
        borderRadius: 18,
        border: `3px solid ${entry.correct ? "#22c55e" : "#ef4444"}`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        padding: "10px 12px",
        width: 100,
        opacity: dim ? 0.2 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <span style={{ fontSize: 40, lineHeight: 1 }}>{entry.food.emoji}</span>
      <p className="font-black text-gray-800 text-xs mt-2 leading-tight">{entry.food.name}</p>
      <span className="text-base mt-1">{entry.correct ? "✅" : "❌"}</span>
    </div>
  );
}

// ── Zone flash overlay ────────────────────────────────────────────────────────
function FlashOverlay({ food, mode }: { food: FoodItem; mode: Mode }) {
  const effect    = food.benefit ?? food.nonBenefit ?? null;
  const isBenefit = !!food.benefit;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-20"
      style={{
        background: isBenefit ? "rgba(220,252,231,0.97)" : "rgba(254,243,199,0.97)",
        borderRadius: 20,
      }}
    >
      <div className="flex items-center justify-center gap-6 flex-wrap px-4">
        {/* Food emoji card — large */}
        <div
          className="flex flex-col items-center bg-white rounded-3xl shadow-xl"
          style={{
            border: `4px solid ${isBenefit ? "#22c55e" : "#f59e0b"}`,
            padding: "20px 24px",
            minWidth: 140,
          }}
        >
          <span style={{ fontSize: 90, lineHeight: 1 }}>{food.emoji}</span>
          <p className="font-black text-gray-800 text-lg mt-3">{food.name}</p>
        </div>

        {/* Effect illustration — large */}
        {mode === "mode2" && effect ? (
          <div className="flex flex-col items-center text-center" style={{ maxWidth: 180 }}>
            <div style={{ transform: "scale(1.5)", transformOrigin: "top center", marginBottom: 60 }}>
              <EffectIllustration icon={effect.icon} />
            </div>
            <p className={`font-black text-base leading-snug ${isBenefit ? "text-green-700" : "text-orange-700"}`}>
              {effect.text}
            </p>
          </div>
        ) : (
          <span style={{ fontSize: 80 }}>{isBenefit ? "✅" : "🍬"}</span>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function SometimesAnytimeGame(): React.JSX.Element {
  const [phase,           setPhase]           = useState<Phase>("mode-select");
  const [mode,            setMode]            = useState<Mode>("mode1");
  const [queue,           setQueue]           = useState<FoodItem[]>([]);
  const [results,         setResults]         = useState<{ food: FoodItem; chosen: "sometimes" | "anytime"; correct: boolean }[]>([]);
  const [flash,           setFlash]           = useState<Flash | null>(null);
  const [overZone,        setOverZone]        = useState<"sometimes" | "anytime" | null>(null);
  const [placedSometimes, setPlacedSometimes] = useState<PlacedEntry[]>([]);
  const [placedAnytime,   setPlacedAnytime]   = useState<PlacedEntry[]>([]);
  const [timeLeft,        setTimeLeft]        = useState(GAME_DURATION);
  const [score,           setScore]           = useState(0);

  const sessionIdRef = useRef("");
  const resultsRef   = useRef<{ food: FoodItem; chosen: "sometimes" | "anytime"; correct: boolean }[]>([]);
  const scoreRef     = useRef(0);
  const { trackEvent } = useGameUser();

  // Sync refs for use inside timer callback
  useEffect(() => { resultsRef.current = results; }, [results]);
  useEffect(() => { scoreRef.current   = score;   }, [score]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current });
          setPhase("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  function startGame(m: Mode) {
    setMode(m);
    const foods = shuffle(m === "mode1" ? MODE1_FOODS : MODE2_FOODS);
    setQueue(foods);
    setResults([]);
    setPlacedSometimes([]);
    setPlacedAnytime([]);
    setFlash(null);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    scoreRef.current   = 0;
    resultsRef.current = [];
    setPhase("playing");
    sessionIdRef.current = `${GAME_ID}-${Date.now().toString(36)}`;
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current, score: 0 });
  }

  function handleDrop(zone: "sometimes" | "anytime") {
    if (!queue.length || flash) return;
    const food    = queue[0];
    const correct = food.category === zone;

    if (correct) setScore(s => s + POINTS_CORRECT);

    setFlash({ zone, food, correct });
    setOverZone(null);

    setTimeout(() => {
      const entry = { food, correct };
      if (zone === "sometimes") setPlacedSometimes(p => [...p, entry]);
      else                      setPlacedAnytime(p => [...p, entry]);

      const newResults = [...resultsRef.current, { food, chosen: zone, correct }];
      const newQueue   = queue.slice(1);
      setResults(newResults);
      setQueue(newQueue);
      setFlash(null);

      if (newQueue.length === 0) {
        trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current });
        setPhase("result");
      }
    }, 1200);
  }

  const current = queue[0];
  const dim     = flash !== null;
  const bg      = { background: "linear-gradient(135deg, #fef9c3 0%, #bbf7d0 40%, #bae6fd 100%)" };

  /* ── MODE SELECT ── */
  if (phase === "mode-select") return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4" style={bg}>
      <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-green-300 p-10 max-w-lg w-full text-center mb-8">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-5xl mb-3">🍎🍪</div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Sometimes or Anytime?</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Drag each food to the right group —{" "}
          <strong className="text-orange-500">Sometimes</strong> foods are treats,{" "}
          <strong className="text-green-600">Anytime</strong> foods are always good for you!
        </p>
        <p className="text-gray-700 font-black text-base mb-4">Choose your level:</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => startGame("mode1")}
            className="w-full py-5 rounded-2xl font-black text-white text-xl shadow-lg hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #f59e0b, #10b981)" }}>
            🌱 PreK – 3rd Grade
          </button>
          <button onClick={() => startGame("mode2")}
            className="w-full py-5 rounded-2xl font-black text-white text-xl shadow-lg hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
            🚀 4th – 8th Grade
          </button>
        </div>
      </div>
      <Link to="/know-your-health/module-1" className="text-gray-500 hover:text-gray-700 font-semibold text-sm">
        ← Back to Module 1
      </Link>
    </div>
  );

  /* ── RESULT ── */
  if (phase === "result") {
    const correctCount = results.filter(r => r.correct).length;
    const total        = results.length;
    const pct          = Math.round((correctCount / total) * 100);
    const medal = pct === 100 ? "🏆" : pct >= 60 ? "🌟" : "💪";
    const msg   = pct === 100 ? "Perfect! You're a food expert!" : pct >= 60 ? "Great effort!" : "Keep practising!";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4" style={bg}>
        <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-green-300 p-8 max-w-lg w-full text-center">
          <div className="text-6xl mb-2 animate-bounce">{medal}</div>
          <h2 className="text-3xl font-black text-gray-800 mb-1">{msg}</h2>
          <div className="flex justify-center gap-4 mb-5">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-yellow-600">{score}</div>
              <div className="text-xs text-yellow-700 font-bold">Points</div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-green-600">{correctCount} / {total}</div>
              <div className="text-xs text-green-700 font-bold">Correct</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-blue-600">{GAME_DURATION - timeLeft}s</div>
              <div className="text-xs text-blue-700 font-bold">Time used</div>
            </div>
          </div>
          <div className="space-y-3 text-left mb-6">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border-2"
                style={{ borderColor: r.correct ? "#22c55e" : "#ef4444" }}>
                <span className="text-3xl">{r.food.emoji}</span>
                <div className="flex-1">
                  <p className="font-black text-gray-800 text-sm">{r.food.name}</p>
                  <p className="text-xs text-gray-500">
                    {r.correct
                      ? `✅ Correct — ${r.food.category === "sometimes" ? "Sometimes" : "Anytime"} food`
                      : `❌ It's a ${r.food.category === "sometimes" ? "Sometimes" : "Anytime"} food`}
                  </p>
                  {r.food.benefit    && <p className="text-xs text-green-600 font-semibold mt-0.5">✨ {r.food.benefit.text}</p>}
                  {r.food.nonBenefit && <p className="text-xs text-orange-600 font-semibold mt-0.5">⚠️ {r.food.nonBenefit.text}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => startGame(mode)}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-black rounded-full shadow hover:scale-105 transition-transform text-sm">
              Play Again 🔄
            </button>
            <button onClick={() => setPhase("mode-select")}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black rounded-full shadow hover:scale-105 transition-transform text-sm">
              Change Level
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── PLAYING ── */
  const progress = results.length;
  const total    = queue.length + results.length;

  return (
    <div className="min-h-screen flex flex-col" style={bg}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/60 backdrop-blur-sm border-b border-white/40 flex-shrink-0">
        <Link to="/know-your-health/module-1" className="text-gray-500 hover:text-gray-700 font-semibold text-sm">← Exit</Link>
        <span className="font-black text-gray-700">🍎 Sometimes or Anytime?</span>
        <div className="flex items-center gap-4">
          {/* Score */}
          <div className="flex items-center gap-1 bg-yellow-100 border-2 border-yellow-400 rounded-full px-3 py-1">
            <span className="text-sm">⭐</span>
            <span className="font-black text-yellow-700 text-sm">{score}</span>
          </div>
          {/* Timer */}
          <div className="flex items-center gap-1 rounded-full px-3 py-1 border-2"
            style={{
              background: timeLeft <= 10 ? "#fee2e2" : "#f0fdf4",
              borderColor: timeLeft <= 10 ? "#ef4444" : "#22c55e",
            }}>
            <span className="text-sm">⏱️</span>
            <span className="font-black text-sm" style={{ color: timeLeft <= 10 ? "#ef4444" : "#16a34a" }}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Timer progress bar */}
      <div className="h-2 bg-gray-200 flex-shrink-0">
        <div className="h-full transition-all duration-1000"
          style={{
            width: `${(timeLeft / GAME_DURATION) * 100}%`,
            background: timeLeft <= 10 ? "#ef4444" : timeLeft <= 20 ? "#f59e0b" : "#22c55e",
          }} />
      </div>

      {/* Main game area */}
      <div className="flex flex-1 min-h-0">

        {/* LEFT — Sometimes */}
        <div
          onDragOver={e => { e.preventDefault(); if (!flash) setOverZone("sometimes"); }}
          onDragLeave={() => setOverZone(null)}
          onDrop={() => handleDrop("sometimes")}
          className="flex flex-col transition-all duration-150"
          style={{
            flex: 1, position: "relative",
            background: overZone === "sometimes" ? "rgba(251,146,60,0.35)" : "rgba(251,146,60,0.12)",
            border: `4px dashed ${overZone === "sometimes" ? "#f97316" : "rgba(249,115,22,0.35)"}`,
            borderRadius: 24, margin: 12,
            transform: overZone === "sometimes" ? "scale(1.02)" : "scale(1)",
            padding: 12,
          }}
        >
          <div className="text-center mb-3 flex-shrink-0">
            <div className="text-4xl">🎉</div>
            <p className="text-xl font-black text-orange-600">Sometimes</p>
            <p className="text-xs text-orange-500 font-semibold">Treat foods</p>
          </div>
          <div className="flex-1 flex flex-wrap gap-3 content-start justify-center overflow-y-auto">
            {placedSometimes.map((entry, i) => <PlacedCard key={i} entry={entry} dim={dim} />)}
          </div>
          {placedSometimes.length === 0 && !flash && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-4xl text-orange-300">←</div>
            </div>
          )}
          {/* Flash overlay */}
          {flash?.zone === "sometimes" && <FlashOverlay food={flash.food} mode={mode} />}
        </div>

        {/* CENTER — food card */}
        <div className="flex flex-col items-center justify-center gap-4 px-2" style={{ flex: "0 0 300px" }}>

          {current && !flash && (
            <>
              <div
                draggable
                onDragStart={() => {}}
                className="select-none cursor-grab active:cursor-grabbing"
                style={{
                  background: "white", borderRadius: 28,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  border: "4px solid rgba(0,0,0,0.06)",
                  padding: 32, textAlign: "center", width: 220,
                }}
              >
                <div style={{ fontSize: 100, lineHeight: 1 }}>{current.emoji}</div>
                <p className="font-black text-gray-800 text-2xl mt-4">{current.name}</p>
                <p className="text-gray-400 text-xs mt-2 font-semibold">Drag to Sometimes or Anytime →</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleDrop("sometimes")}
                  className="px-4 py-2 rounded-full text-white font-bold text-sm shadow hover:scale-105 transition-transform"
                  style={{ background: "#f97316" }}>
                  ← Sometimes
                </button>
                <button onClick={() => handleDrop("anytime")}
                  className="px-4 py-2 rounded-full text-white font-bold text-sm shadow hover:scale-105 transition-transform"
                  style={{ background: "#22c55e" }}>
                  Anytime →
                </button>
              </div>
            </>
          )}

          {/* Progress dots */}
          <div className="flex gap-2">
            {Array(total).fill(null).map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  width: 10, height: 10,
                  background: i < progress
                    ? (results[i]?.correct ? "#22c55e" : "#ef4444")
                    : i === progress ? "#6366f1" : "#d1d5db",
                  transform: i === progress ? "scale(1.4)" : "scale(1)",
                }} />
            ))}
          </div>
        </div>

        {/* RIGHT — Anytime */}
        <div
          onDragOver={e => { e.preventDefault(); if (!flash) setOverZone("anytime"); }}
          onDragLeave={() => setOverZone(null)}
          onDrop={() => handleDrop("anytime")}
          className="flex flex-col transition-all duration-150"
          style={{
            flex: 1, position: "relative",
            background: overZone === "anytime" ? "rgba(34,197,94,0.35)" : "rgba(34,197,94,0.12)",
            border: `4px dashed ${overZone === "anytime" ? "#22c55e" : "rgba(34,197,94,0.35)"}`,
            borderRadius: 24, margin: 12,
            transform: overZone === "anytime" ? "scale(1.02)" : "scale(1)",
            padding: 12,
          }}
        >
          <div className="text-center mb-3 flex-shrink-0">
            <div className="text-4xl">✅</div>
            <p className="text-xl font-black text-green-600">Anytime</p>
            <p className="text-xs text-green-500 font-semibold">Healthy foods</p>
          </div>
          <div className="flex-1 flex flex-wrap gap-3 content-start justify-center overflow-y-auto">
            {placedAnytime.map((entry, i) => <PlacedCard key={i} entry={entry} dim={dim} />)}
          </div>
          {placedAnytime.length === 0 && !flash && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-4xl text-green-300">→</div>
            </div>
          )}
          {/* Flash overlay */}
          {flash?.zone === "anytime" && <FlashOverlay food={flash.food} mode={mode} />}
        </div>

      </div>
    </div>
  );
}
