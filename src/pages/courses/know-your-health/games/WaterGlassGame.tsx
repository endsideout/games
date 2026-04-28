import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";
import { generateSessionId } from "../../../../lib/sessionId";
import { useCountdownGameTimer } from "../../../../lib/useCountdownGameTimer";
import { useTrackedGameSession } from "../../../../lib/useTrackedGameSession";
import { playCorrect, playWrong, speak } from "./gameAudio";

const GAME_ID        = "water-glass-game";
const GAME_DURATION  = 120;
const POINTS_CORRECT = 10;
const TOTAL_Q        = 4;

// ── Water Glass SVG ───────────────────────────────────────────────────────────
// fillLevel: 0 (empty) → 1 (full). Water rises smoothly from bottom.
function WaterGlass({ fillLevel, rippling }: { fillLevel: number; rippling: boolean }) {
  const BOT_Y = 272; // bottom of glass interior

  return (
    <svg viewBox="0 0 200 310" width="100%" height="100%" style={{ display: "block" }}>
      <defs>
        {/* Clip water to glass interior shape */}
        <clipPath id="wgClip">
          <path d="M38,50 L162,50 L152,272 L48,272 Z" />
        </clipPath>

        {/* Water gradient — deeper blue at bottom, lighter at top */}
        <linearGradient id="wgWater" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.80" />
        </linearGradient>

        {/* Glass wall gradient — subtle shine */}
        <linearGradient id="wgShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="white" stopOpacity="0.22" />
          <stop offset="35%"  stopColor="white" stopOpacity="0.04" />
          <stop offset="65%"  stopColor="white" stopOpacity="0.04" />
          <stop offset="100%" stopColor="white" stopOpacity="0.14" />
        </linearGradient>

        <style>{`
          @keyframes wgRipple {
            0%   { transform: scaleX(1);    opacity: 0.8; }
            50%  { transform: scaleX(1.06); opacity: 0.5; }
            100% { transform: scaleX(1);    opacity: 0;   }
          }
          .wg-ripple { transform-origin: 100px 50px; animation: wgRipple 0.9s ease-out forwards; }
          @keyframes wgFull {
            0%,100% { opacity: 1; }
            50%     { opacity: 0.6; }
          }
          .wg-full { animation: wgFull 1.5s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* ── GLASS INTERIOR BACKGROUND (empty) ── */}
      <path d="M38,50 L162,50 L152,272 L48,272 Z" fill="rgba(219,234,254,0.07)" />

      {/* ── WATER FILL — scaleY from bottom ── */}
      <g
        clipPath="url(#wgClip)"
        style={{
          transformOrigin: `100px ${BOT_Y}px`,
          transform:       `scaleY(${fillLevel})`,
          transition:      "transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Main water body */}
        <rect x="38" y="50" width="124" height="222" fill="url(#wgWater)" />

        {/* Left highlight stripe */}
        <rect x="42" y="50" width="26" height="222" fill="#bae6fd" opacity="0.25" />

        {/* Bubbles (static decoration) */}
        {[
          [78,  210, 4.5], [128, 190, 3], [62,  165, 2.5],
          [145, 230, 3.5], [95,  140, 2], [112, 250, 4],
          [55,  240, 3], [150, 155, 2.5],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity="0.18" />
        ))}

        {/* Wave crest at top of water (slight undulation) */}
        <path
          d="M28,58 Q55,44 82,58 Q109,72 136,58 Q163,44 180,58 L180,80 L28,80 Z"
          fill="#93c5fd" opacity="0.45"
        />
      </g>

      {/* ── RIPPLE OVERLAY (plays when water fills) ── */}
      {rippling && (
        <ellipse
          className="wg-ripple"
          cx="100" cy="50" rx="62" ry="10"
          fill="none" stroke="#38bdf8" strokeWidth="3"
          clipPath="url(#wgClip)"
        />
      )}

      {/* ── GLASS WALLS (drawn over water so glass looks transparent) ── */}
      {/* Side lines */}
      <line x1="38" y1="50" x2="48" y2="272" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
      <line x1="162" y1="50" x2="152" y2="272" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />

      {/* Bottom ellipse */}
      <ellipse cx="100" cy="272" rx="52" ry="11"
        fill="rgba(147,197,253,0.2)" stroke="#93c5fd" strokeWidth="2.5" />

      {/* Top rim outer ellipse */}
      <ellipse cx="100" cy="36" rx="72" ry="15"
        fill="none" stroke="#93c5fd" strokeWidth="3" />

      {/* Top rim inner ellipse (mouth of glass) */}
      <ellipse cx="100" cy="50" rx="62" ry="11"
        fill="none" stroke="#93c5fd" strokeWidth="1.5" opacity="0.55" />

      {/* ── GLASS SHINE OVERLAY ── */}
      <path d="M38,50 L162,50 L152,272 L48,272 Z" fill="url(#wgShine)" />
      {/* Vertical reflection streak */}
      <line x1="54" y1="58" x2="60" y2="255"
        stroke="white" strokeWidth="7" strokeLinecap="round" opacity="0.16" />

      {/* ── FULL GLASS SPARKLES ── */}
      {fillLevel >= 1 && (
        <g className="wg-full">
          {[
            [28, 38], [172, 42], [100, 20], [50, 22], [150, 26],
          ].map(([cx, cy], i) => (
            <text key={i} x={cx} y={cy} textAnchor="middle" fontSize="14">✨</text>
          ))}
        </g>
      )}
    </svg>
  );
}

// ── Question data ─────────────────────────────────────────────────────────────
interface Option  { id: string; emoji?: string; numberLabel?: string; label: string; desc?: string; }
interface Question {
  question:    string;
  voiceText:   string;
  options:     Option[];
  answer:      string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question:  "Which drink is a sometimes drink?",
    voiceText: "Which drink is a sometimes drink?",
    options: [
      { id: "a", emoji: "🥤", label: "Soda",  desc: "Sweet & fizzy" },
      { id: "b", emoji: "💧", label: "Water", desc: "Clear & refreshing" },
    ],
    answer: "a",
    explanation: "Soda has lots of added sugar, so it's a sometimes drink. Water is an anytime drink!",
  },
  {
    question:  "How many cups of water should we drink each day?",
    voiceText: "How many cups of water should we drink each day?",
    options: [
      { id: "a", numberLabel: "8", label: "8 cups" },
      { id: "b", numberLabel: "1", label: "1 cup"  },
      { id: "c", numberLabel: "4", label: "4 cups" },
    ],
    answer: "a",
    explanation: "We should drink 8 cups of water every day to stay healthy and hydrated!",
  },
  {
    question:  "Which drink is the healthiest?",
    voiceText: "Which drink is the healthiest?",
    options: [
      { id: "a", emoji: "🏃", label: "Sports Drink", desc: "Like Gatorade" },
      { id: "b", emoji: "💧", label: "Water",        desc: "Plain & pure" },
      { id: "c", emoji: "🧋", label: "Milkshake",   desc: "Sweet & creamy" },
    ],
    answer: "b",
    explanation: "Water is the healthiest drink — zero sugar, zero calories, and your body loves it!",
  },
  {
    question:  "Which drink helps plants grow?",
    voiceText: "Which drink helps plants grow?",
    options: [
      { id: "a", emoji: "🥛", label: "Milk",  desc: "From a cow" },
      { id: "b", emoji: "💧", label: "Water", desc: "From a tap or bottle" },
    ],
    answer: "b",
    explanation: "Plants need water to grow and survive — just like us!",
  },
];

type Phase = "start" | "playing" | "result";

export function WaterGlassGame(): React.JSX.Element {
  const location  = useLocation();
  const fromSet1  = new URLSearchParams(location.search).get("from") === "set1";
  const backTo    = fromSet1 ? "/know-your-health/set-1"  : "/know-your-health/module-4";
  const backLabel = fromSet1 ? "← Back to Set 1"         : "← Back to Module 4";

  const [phase,        setPhase]        = useState<Phase>("start");
  const [idx,          setIdx]          = useState(0);
  const [correct,      setCorrect]      = useState(0);   // number of correct answers (fills glass)
  const [score,        setScore]        = useState(0);
  const [timeLeft,     setTimeLeft]     = useState(GAME_DURATION);
  const [picked,       setPicked]       = useState<string | null>(null);
  const [rippling,     setRippling]     = useState(false);
  const [answers,      setAnswers]      = useState<{ q: Question; chosen: string; ok: boolean }[]>([]);

  const sessionIdRef = useRef("");
  const scoreRef     = useRef(0);
  const answersRef   = useRef<typeof answers>([]);
  const { trackEvent } = useGameUser();

  useEffect(() => { scoreRef.current   = score;   }, [score]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  const onTimeUp = useCallback(() => {
    trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current });
    setPhase("result");
  }, [trackEvent]);

  const timerApi = useCountdownGameTimer({
    duration: GAME_DURATION,
    isRunning: phase === "playing",
    onTimeUp,
  });

  useEffect(() => {
    setTimeLeft(timerApi.timeLeft);
  }, [timerApi.timeLeft]);

  useTrackedGameSession({ gameId: GAME_ID, trackEvent });

  // Speak question when idx changes
  useEffect(() => {
    if (phase !== "playing") return;
    const t = setTimeout(() => speak(QUESTIONS[idx].voiceText), 400);
    return () => clearTimeout(t);
  }, [idx, phase]);

  // Cleanup voice
  useEffect(() => {
    return () => { try { window.speechSynthesis?.cancel(); } catch {} };
  }, []);

  function startGame() {
    setIdx(0); setCorrect(0); setScore(0); setAnswers([]);
    scoreRef.current = 0; answersRef.current = [];
    setPicked(null); timerApi.resetTimer(); setTimeLeft(GAME_DURATION); setRippling(false);
    setPhase("playing");
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current, score: 0 });
    speak("Fill up the glass of water by answering the questions!");
  }

  function handlePick(optionId: string) {
    if (picked || phase !== "playing") return;
    const q  = QUESTIONS[idx];
    const ok = optionId === q.answer;

    setPicked(optionId);

    if (ok) {
      setScore(s => s + POINTS_CORRECT);
      setCorrect(c => c + 1);
      setRippling(true);
      setTimeout(() => setRippling(false), 1000);
      playCorrect();
      speak(`Correct! ${q.explanation}`);
    } else {
      playWrong();
      speak(`Not quite. ${q.explanation}`);
    }

    const entry = { q, chosen: optionId, ok };
    const next  = [...answersRef.current, entry];
    setAnswers(next);

    setTimeout(() => {
      const nextIdx = idx + 1;
      if (nextIdx >= TOTAL_Q) {
        trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current });
        setPhase("result");
      } else {
        setIdx(nextIdx);
        setPicked(null);
      }
    }, 2200);
  }

  const fillLevel  = correct / TOTAL_Q;
  const timerColor = timeLeft <= 20 ? "#ef4444" : timeLeft <= 40 ? "#f59e0b" : "#4ade80";
  const bg         = { background: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)" };

  /* ─── START ──────────────────────────────────────────────────────────────── */
  if (phase === "start") return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4" style={bg}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-sky-400 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div style={{ width: 150, margin: "0 auto 12px" }}>
          <WaterGlass fillLevel={0.35} rippling={false} />
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Fill the Glass! 💧</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Answer questions about water and healthy drinks to{" "}
          <strong className="text-sky-600">fill up the glass</strong>!
          Every correct answer adds more water.
        </p>
        <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 mb-6 text-sm text-left text-sky-900 space-y-1">
          <p className="font-black mb-1">How to play:</p>
          <p>💧 Answer each question by tapping a picture</p>
          <p>✅ Each correct answer fills 25% of the glass</p>
          <p>🏆 Fill it all the way to win!</p>
          <p>⏱️ {GAME_DURATION} seconds — {TOTAL_Q} questions</p>
        </div>
        <button
          onClick={startGame}
          className="w-full py-5 rounded-2xl font-black text-white text-xl shadow-lg hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)" }}
        >
          Fill the Glass! 💧
        </button>
        <div className="mt-5">
          <Link to={backTo} className="text-gray-500 hover:text-gray-700 font-semibold text-sm">{backLabel}</Link>
        </div>
      </div>
    </div>
  );

  /* ─── RESULT ─────────────────────────────────────────────────────────────── */
  if (phase === "result") {
    const pct   = Math.round((correct / TOTAL_Q) * 100);
    const full  = correct === TOTAL_Q;
    const medal = full ? "🏆" : correct >= 2 ? "🌟" : "💪";
    const msg   = full ? "Glass full! You're a water champion! 💧" : correct >= 2 ? "Good job! Keep drinking water!" : "Keep learning — water is life!";
    return (
      <div className="min-h-screen flex items-center justify-center py-10 px-4" style={bg}>
        <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-sky-400 p-8 max-w-lg w-full text-center">
          <div style={{ width: 160, margin: "0 auto 8px" }}>
            <WaterGlass fillLevel={fillLevel} rippling={false} />
          </div>
          <div className="text-5xl mb-2 animate-bounce">{medal}</div>
          <h2 className="text-2xl font-black text-gray-800 mb-1">{msg}</h2>
          <p className="text-sky-600 font-bold text-lg mb-4">{pct}% filled</p>

          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-sky-50 border-2 border-sky-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-sky-600">{score}</div>
              <div className="text-xs text-sky-700 font-bold">Points</div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-green-600">{correct} / {TOTAL_Q}</div>
              <div className="text-xs text-green-700 font-bold">Correct</div>
            </div>
            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-blue-600">{GAME_DURATION - timeLeft}s</div>
              <div className="text-xs text-blue-700 font-bold">Time used</div>
            </div>
          </div>

          <div className="space-y-3 text-left mb-6">
            {answers.map((a, i) => (
              <div key={i}
                className="flex items-start gap-3 rounded-2xl px-4 py-3 border-2 bg-gray-50"
                style={{ borderColor: a.ok ? "#22c55e" : "#ef4444" }}>
                <span className="text-xl mt-0.5">{a.ok ? "✅" : "❌"}</span>
                <div>
                  <p className="text-xs text-gray-500 font-bold">{a.q.question}</p>
                  <p className="text-xs italic mt-1" style={{ color: a.ok ? "#16a34a" : "#dc2626" }}>
                    {a.q.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={startGame}
              className="px-6 py-3 rounded-full font-black text-white shadow hover:scale-105 transition-transform text-sm"
              style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)" }}>
              Play Again 🔄
            </button>
            <Link to={backTo}
              className="px-6 py-3 rounded-full font-black text-white shadow hover:scale-105 transition-transform text-sm inline-block"
              style={{ background: "linear-gradient(135deg, #6b7280, #374151)" }}>
              ← Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ─── PLAYING — left: glass (35%), right: question (65%) ────────────────── */
  const q           = QUESTIONS[idx];
  return (
    <div className="min-h-screen flex flex-col" style={bg}>

      {/* Timer bar */}
      <div className="h-1.5 bg-white/10 flex-shrink-0">
        <div className="h-full transition-all duration-1000"
          style={{ width: `${(timeLeft / GAME_DURATION) * 100}%`, background: timerColor }} />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-black/20 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
        <Link to={backTo} className="text-white/70 hover:text-white font-semibold text-sm">← Exit</Link>
        <span className="font-black text-white text-sm">💧 Fill the Glass!</span>
        <div className="flex items-center gap-3">
          <div className="bg-sky-400/20 border-2 border-sky-400 rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-sm">⭐</span>
            <span className="font-black text-sky-200 text-sm">{score}</span>
          </div>
          <div className="rounded-full px-3 py-1 border-2 flex items-center gap-1"
            style={{ background: "rgba(0,0,0,0.2)", borderColor: timerColor }}>
            <span className="text-sm">⏱️</span>
            <span className="font-black text-sm" style={{ color: timerColor }}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 min-h-0">

        {/* ── LEFT 35%: Water glass ── */}
        <div
          className="flex flex-col items-center justify-center gap-4 border-r border-white/10"
          style={{ width: "35%", flexShrink: 0, background: "rgba(0,0,0,0.15)" }}
        >
          <p className="text-sky-200 font-black text-sm uppercase tracking-wider">
            Fill the Glass!
          </p>

          {/* Glass — large */}
          <div style={{ width: "75%", maxWidth: 220 }}>
            <WaterGlass fillLevel={fillLevel} rippling={rippling} />
          </div>

          {/* Fill percentage */}
          <div className="text-center">
            <div className="text-4xl font-black text-white">
              {Math.round(fillLevel * 100)}%
            </div>
            <div className="text-sky-300 text-xs font-bold mt-0.5">
              {correct} of {TOTAL_Q} correct
            </div>
          </div>

          {/* Water drop progress */}
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_Q }, (_, i) => (
              <div key={i} className="text-2xl transition-all duration-500"
                style={{ opacity: i < correct ? 1 : 0.2, filter: i < correct ? "none" : "grayscale(1)" }}>
                💧
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT 65%: Question + options ── */}
        <div
          className="flex flex-col items-center justify-center px-8 py-6 gap-6"
          style={{ width: "65%" }}
        >
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest self-start">
            Question {idx + 1} of {TOTAL_Q}
          </p>

          {/* Question card */}
          <div className="w-full bg-white/10 border border-white/20 rounded-3xl p-6">
            <p className="font-black text-white text-2xl leading-snug">{q.question}</p>
          </div>

          {/* Options */}
          <div className={`grid gap-4 w-full ${q.options.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
            {q.options.map(opt => {
              const isCorrect = !!(picked && opt.id === q.answer);
              const isWrong   = !!(picked && opt.id === picked && !isCorrect);
              const dim       = !!(picked && opt.id !== picked && opt.id !== q.answer);

              const borderC = !picked ? "rgba(255,255,255,0.25)"
                : isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "rgba(255,255,255,0.08)";
              const cardBg  = !picked ? "rgba(255,255,255,0.10)"
                : isCorrect ? "rgba(34,197,94,0.20)" : isWrong ? "rgba(239,68,68,0.20)" : "rgba(255,255,255,0.04)";

              return (
                <div
                  key={opt.id}
                  onClick={() => handlePick(opt.id)}
                  className="flex flex-col items-center justify-center text-center rounded-3xl p-5 transition-all duration-200 select-none"
                  style={{
                    background: cardBg,
                    border:     `2.5px solid ${borderC}`,
                    cursor:     picked ? "default" : "pointer",
                    transform:  !picked ? undefined : isCorrect ? "scale(1.05)" : isWrong ? "scale(0.96)" : "scale(0.93)",
                    opacity:    dim ? 0.36 : 1,
                    minHeight:  140,
                  }}
                >
                  {/* Number option (Q2 style) */}
                  {opt.numberLabel && (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-lg"
                      style={{ background: isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "#f97316" }}>
                      <span className="text-white font-black text-4xl">{opt.numberLabel}</span>
                    </div>
                  )}

                  {/* Emoji option */}
                  {opt.emoji && (
                    <div className="mb-2" style={{ fontSize: 64, lineHeight: 1 }}>{opt.emoji}</div>
                  )}

                  <p className="font-black text-white text-base">{opt.label}</p>
                  {opt.desc && <p className="text-white/55 text-xs mt-0.5">{opt.desc}</p>}
                  {isCorrect && <p className="text-green-300 font-black text-xs mt-2">✅ Correct!</p>}
                  {isWrong   && <p className="text-red-300   font-black text-xs mt-2">❌ Not quite</p>}
                  {!picked   && <p className="text-white/30 text-xs mt-2">Tap to choose</p>}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {picked && (
            <div className="w-full rounded-2xl px-5 py-3 bg-white/10 border border-white/20">
              <p className="text-white font-semibold text-sm text-center leading-relaxed">
                {q.explanation}
              </p>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex gap-2">
            {QUESTIONS.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  width: 10, height: 10,
                  background: i < idx
                    ? (answers[i]?.ok ? "#4ade80" : "#f87171")
                    : i === idx ? "#38bdf8" : "rgba(255,255,255,0.2)",
                  transform: i === idx ? "scale(1.4)" : "scale(1)",
                }} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
