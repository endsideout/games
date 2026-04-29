import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";
import { generateSessionId } from "../../../../lib/sessionId";
import { playCorrect, playWrong, speak } from "./gameAudio";

const GAME_ID        = "finish-race-game";
const GAME_DURATION  = 120;
const POINTS_CORRECT = 10;

// ── Runner SVG — matches PDF style (dark suit + trailing scarf) ───────────────
function RunnerFigure({
  suit   = "navy",
  animate = false,
}: {
  suit?:    "red" | "navy";
  animate?: boolean;
}) {
  const bodyColor  = suit === "red" ? "#ef4444" : "#1e3a8a";
  const darkColor  = suit === "red" ? "#991b1b" : "#0f172a";
  const scarfColor = suit === "red" ? "#fca5a5" : "#3b82f6";
  const cls        = animate ? "rg-bounce" : undefined;

  return (
    <svg viewBox="0 0 56 90" width="56" height="90" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <style>{`
          @keyframes rgBounce { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-6px)} }
          @keyframes rgArmR   { 0%,100%{transform:rotate(0deg)}   50%{transform:rotate(-38deg)}  }
          @keyframes rgArmL   { 0%,100%{transform:rotate(0deg)}   50%{transform:rotate(38deg)}   }
          @keyframes rgLegR   { 0%,100%{transform:rotate(0deg)}   50%{transform:rotate(-42deg)}  }
          @keyframes rgLegL   { 0%,100%{transform:rotate(0deg)}   50%{transform:rotate(42deg)}   }
          .rg-bounce { animation: rgBounce 0.38s ease-in-out infinite; }
          .rg-arm-r  { transform-origin:32px 24px; animation: rgArmR  0.38s ease-in-out infinite; }
          .rg-arm-l  { transform-origin:24px 24px; animation: rgArmL  0.38s ease-in-out infinite; }
          .rg-leg-r  { transform-origin:29px 42px; animation: rgLegR  0.38s ease-in-out infinite; }
          .rg-leg-l  { transform-origin:27px 42px; animation: rgLegL  0.38s ease-in-out infinite; }
        `}</style>
      </defs>

      <g className={cls}>
        {/* Head */}
        <ellipse cx="28" cy="11"  rx="10" ry="11" fill={bodyColor}/>
        {/* Helmet */}
        <ellipse cx="28" cy="6"   rx="10" ry="6"  fill={darkColor}/>
        {/* Eye shine */}
        <circle  cx="32" cy="10"  r="2"   fill="white" opacity="0.7"/>

        {/* Trailing scarf */}
        <path d="M24,22 C18,20 13,26 11,33"
          stroke={scarfColor} strokeWidth="3" fill="none" strokeLinecap="round"/>

        {/* Torso */}
        <rect x="24" y="21" width="8" height="21" rx="4" fill={bodyColor}
          transform="rotate(-8, 28, 31)"/>

        {/* Right arm (forward) */}
        <g className={animate ? "rg-arm-r" : undefined}>
          <line x1="32" y1="24" x2="44" y2="18"
            stroke={bodyColor} strokeWidth="5" strokeLinecap="round"/>
        </g>

        {/* Left arm (back) */}
        <g className={animate ? "rg-arm-l" : undefined}>
          <line x1="24" y1="24" x2="12" y2="30"
            stroke={bodyColor} strokeWidth="5" strokeLinecap="round"/>
        </g>

        {/* Right leg (forward, bent) */}
        <g className={animate ? "rg-leg-r" : undefined}>
          <line x1="29" y1="42" x2="37" y2="57"
            stroke={bodyColor} strokeWidth="5" strokeLinecap="round"/>
          <line x1="37" y1="57" x2="35" y2="68"
            stroke={bodyColor} strokeWidth="5" strokeLinecap="round"/>
          <ellipse cx="37" cy="70" rx="8" ry="4" fill="white"
            transform="rotate(-12, 37, 70)"/>
        </g>

        {/* Left leg (trailing back) */}
        <g className={animate ? "rg-leg-l" : undefined}>
          <line x1="27" y1="42" x2="19" y2="55"
            stroke={bodyColor} strokeWidth="5" strokeLinecap="round"/>
          <line x1="19" y1="55" x2="17" y2="65"
            stroke={bodyColor} strokeWidth="5" strokeLinecap="round"/>
          <ellipse cx="15" cy="66" rx="7" ry="3.5" fill="white"
            transform="rotate(15, 15, 66)"/>
        </g>
      </g>
    </svg>
  );
}

// ── Race Track Scene ──────────────────────────────────────────────────────────
const TRACK_W   = 900;
const TRACK_H   = 260;
const SKY_H     = 95;
const START_X   = 75;
const FINISH_X  = 840;
const LANE_H    = 33;
const LANES     = 5;
const TRACK_TOP = SKY_H;

// Fixed background runners (decorative opponents)
const BG_RUNNERS = [
  { x: 220, lane: 1 },
  { x: 360, lane: 0 },
  { x: 500, lane: 3 },
];

function RaceTrack({
  position,
  finished,
}: {
  position: number;   // 0 to 1
  finished: boolean;
}) {
  const playerX = START_X + position * (FINISH_X - START_X);

  // Player runs in lane 2 (0-indexed), centered Y
  const laneY = (lane: number) => TRACK_TOP + lane * LANE_H + LANE_H / 2;

  return (
    <svg
      viewBox={`0 0 ${TRACK_W} ${TRACK_H}`}
      width="100%"
      style={{ display: "block" }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0284c7"/>
          <stop offset="100%" stopColor="#38bdf8"/>
        </linearGradient>
        <linearGradient id="trackGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#0f766e"/>
          <stop offset="100%" stopColor="#115e59"/>
        </linearGradient>
        <style>{`
          @keyframes finishPulse {
            0%,100% { opacity:1; } 50% { opacity:0.55; }
          }
          .finish-flag { animation: finishPulse 0.7s ease-in-out infinite; }
        `}</style>
      </defs>

      {/* ── SKY ── */}
      <rect x="0" y="0" width={TRACK_W} height={SKY_H} fill="url(#skyGrad)"/>

      {/* Clouds */}
      {[
        [120, 30, 1.0], [280, 18, 0.85], [500, 35, 1.1],
        [680, 22, 0.9], [800, 40, 0.75],
      ].map(([cx, cy, sc], i) => (
        <g key={i} transform={`translate(${cx},${cy}) scale(${sc})`}>
          <ellipse cx="0"   cy="0"  rx="30" ry="18" fill="white" opacity="0.92"/>
          <ellipse cx="-18" cy="5"  rx="20" ry="14" fill="white" opacity="0.88"/>
          <ellipse cx="18"  cy="5"  rx="22" ry="14" fill="white" opacity="0.88"/>
        </g>
      ))}

      {/* ── TRACK ── */}
      <rect x="0" y={TRACK_TOP} width={TRACK_W} height={TRACK_H - TRACK_TOP} fill="url(#trackGrad)"/>

      {/* Lane dividers */}
      {Array.from({ length: LANES + 1 }, (_, i) => (
        <line key={i}
          x1="0" y1={TRACK_TOP + i * LANE_H}
          x2={TRACK_W} y2={TRACK_TOP + i * LANE_H}
          stroke="white" strokeWidth={i === 0 || i === LANES ? 2.5 : 1}
          opacity={i === 0 || i === LANES ? 0.7 : 0.35}
        />
      ))}

      {/* Start line */}
      <rect x={START_X - 4} y={TRACK_TOP} width="5" height={LANES * LANE_H}
        fill="white" opacity="0.85"/>
      <text x={START_X - 2} y={TRACK_TOP - 8}
        fill="white" fontSize="13" fontWeight="bold" textAnchor="middle"
        opacity="0.8">START</text>

      {/* Finish line — checkered pattern */}
      {Array.from({ length: LANES * 3 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return (
          <rect key={i}
            x={FINISH_X + col * 9}
            y={TRACK_TOP + row * LANE_H / 1}
            width="9" height={LANE_H / 1}
            fill={(row + col) % 2 === 0 ? "#111" : "white"}
            opacity="0.9"
          />
        );
      })}
      <text x={FINISH_X + 14} y={TRACK_TOP - 8}
        fill="white" fontSize="13" fontWeight="bold" textAnchor="middle"
        opacity="0.8">FINISH</text>

      {/* Checkered flag icon */}
      <text x={FINISH_X + 14} y={TRACK_TOP - 22} fontSize="20" textAnchor="middle">
        🏁
      </text>

      {/* ── BACKGROUND RUNNERS (navy, static) ── */}
      {BG_RUNNERS.map((r, i) => (
        <g key={i}
          transform={`translate(${r.x - 28}, ${laneY(r.lane) - 60})`}>
          <RunnerFigure suit="navy" animate={false}/>
        </g>
      ))}

      {/* ── PLAYER RUNNER (red, animated, moves with position) ── */}
      <g
        style={{
          transform:  `translate(${playerX - 28}px, ${laneY(2) - 60}px)`,
          transition: "transform 1.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <RunnerFigure suit="red" animate={true}/>
      </g>

      {/* ── FINISH CELEBRATION ── */}
      {finished && (
        <g className="finish-flag">
          <rect x="0" y="0" width={TRACK_W} height={TRACK_H} fill="#fbbf24" opacity="0.15"/>
          <text x={TRACK_W / 2} y={TRACK_TOP + 70}
            textAnchor="middle" fontSize="42" fontWeight="bold" fill="white"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            🏁 FINISH!
          </text>
        </g>
      )}
    </svg>
  );
}

// ── Questions ─────────────────────────────────────────────────────────────────
interface Option   { id: string; text: string; emoji?: string; }
interface Question {
  question:    string;
  options:     Option[];
  answer:      string;
  explanation: string;
}

const ALL_QUESTIONS: Question[] = [
  {
    question:    "How many minutes a day should we be active?",
    options: [
      { id: "a", text: "20 minutes", emoji: "😴" },
      { id: "b", text: "30 minutes", emoji: "🙂" },
      { id: "c", text: "60 minutes", emoji: "💪" },
    ],
    answer: "c",
    explanation: "We should be active for at least 60 minutes every day to keep our body strong and healthy!",
  },
  {
    question:    "True or false: Screen time is healthier than moving your body.",
    options: [
      { id: "a", text: "True",  emoji: "📱" },
      { id: "b", text: "False", emoji: "🏃" },
    ],
    answer: "b",
    explanation: "False! Moving your body is always healthier than screen time. Exercise keeps your body and brain strong!",
  },
  {
    question:    "What is a way we can stay active?",
    options: [
      { id: "a", text: "Playing soccer",     emoji: "⚽" },
      { id: "b", text: "Run outside",        emoji: "🏃" },
      { id: "c", text: "Play basketball",    emoji: "🏀" },
      { id: "d", text: "All of the above",   emoji: "🎉" },
    ],
    answer: "d",
    explanation: "All of the above! Soccer, running, and basketball are all great ways to stay active every day.",
  },
  {
    question:    "What happens when we exercise more?",
    options: [
      { id: "a", text: "Less energy",              emoji: "😴" },
      { id: "b", text: "Less focused in school",   emoji: "😕" },
      { id: "c", text: "Better grades in school",  emoji: "📚" },
    ],
    answer: "c",
    explanation: "Exercise helps your brain focus better and gives you more energy — leading to better grades in school!",
  },
  {
    question:    "Which is a muscle strengthening exercise?",
    options: [
      { id: "a", text: "Walking",  emoji: "🚶" },
      { id: "b", text: "Swimming", emoji: "🏊" },
      { id: "c", text: "Push ups", emoji: "💪" },
    ],
    answer: "c",
    explanation: "Push ups are a great muscle strengthening exercise that builds strong arms and chest!",
  },
];

type Phase = "start" | "playing" | "result";
type Mode  = "prek" | "grade3";

interface Answer { q: Question; chosen: string; ok: boolean; }

export function FinishRaceGame(): React.JSX.Element {
  const location  = useLocation();
  const fromSet1  = new URLSearchParams(location.search).get("from") === "set1";
  const backTo    = fromSet1 ? "/know-your-health/set-1"  : "/know-your-health/module-5";
  const backLabel = fromSet1 ? "← Back to Set 1"         : "← Back to Module 5";

  const [phase,    setPhase]    = useState<Phase>("start");
  const [mode,     setMode]     = useState<Mode>("grade3");
  const [idx,      setIdx]      = useState(0);
  const [answers,  setAnswers]  = useState<Answer[]>([]);
  const [score,    setScore]    = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [picked,   setPicked]   = useState<string | null>(null);
  const [correct,  setCorrect]  = useState(0);   // # correct (moves runner)

  const sessionIdRef = useRef("");
  const scoreRef     = useRef(0);
  const answersRef   = useRef<Answer[]>([]);
  const { trackEvent } = useGameUser();

  // Derived
  const questions = mode === "prek"
    ? ALL_QUESTIONS.slice(0, 3)
    : ALL_QUESTIONS;
  const totalQ    = questions.length;
  const position  = correct / totalQ;          // 0 → 1

  useEffect(() => { scoreRef.current   = score;   }, [score]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  // Timer
  // TODO(lint-safe-pass): deferred exhaustive-deps fix; timer completion tracking is intentionally phase-scoped.
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

  // Speak question on change
  // TODO(lint-safe-pass): deferred exhaustive-deps fix; speech effect intentionally follows idx/phase only.
  useEffect(() => {
    if (phase !== "playing") return;
    const t = setTimeout(() => speak(questions[idx].question), 400);
    return () => clearTimeout(t);
  }, [idx, phase]);

  // Cleanup voice
  useEffect(() => {
    return () => { try { window.speechSynthesis?.cancel(); } catch {} };
  }, []);

  function startGame(m: Mode) {
    setMode(m);
    setIdx(0); setAnswers([]); setScore(0); setCorrect(0);
    scoreRef.current = 0; answersRef.current = [];
    setPicked(null); setTimeLeft(GAME_DURATION);
    setPhase("playing");
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current, score: 0 });
    speak("Answer each question to move your runner closer to the finish line!");
  }

  function handlePick(optId: string) {
    if (picked || phase !== "playing") return;
    const q  = questions[idx];
    const ok = optId === q.answer;
    setPicked(optId);
    if (ok) {
      setScore(s => s + POINTS_CORRECT);
      setCorrect(c => c + 1);
      playCorrect();
      speak(`Correct! ${q.explanation}`);
    } else {
      playWrong();
      speak(`Not quite. ${q.explanation}`);
    }
    const entry  = { q, chosen: optId, ok };
    const next   = [...answersRef.current, entry];
    setAnswers(next);
    setTimeout(() => {
      const nextIdx = idx + 1;
      if (nextIdx >= totalQ) {
        trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current });
        setPhase("result");
      } else {
        setIdx(nextIdx);
        setPicked(null);
      }
    }, 2200);
  }

  const timerColor = timeLeft <= 20 ? "#ef4444" : timeLeft <= 40 ? "#f59e0b" : "#4ade80";
  const bg = { background: "linear-gradient(135deg, #0c4a6e 0%, #0e7490 40%, #0891b2 100%)" };

  /* ─── START ──────────────────────────────────────────────────────────────── */
  if (phase === "start") return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4" style={bg}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-cyan-400 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4"/>

        {/* Mini race track preview */}
        <div className="rounded-2xl overflow-hidden border-2 border-cyan-200 mb-5">
          <RaceTrack position={0.45} finished={false}/>
        </div>

        <h1 className="text-3xl font-black text-gray-800 mb-2">Finish the Race! 🏁</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Answer questions about{" "}
          <strong className="text-cyan-600">physical activity</strong> to move your
          runner down the track — finish first to win!
        </p>

        {/* Mode selection */}
        <p className="text-gray-600 font-black text-sm mb-3">Choose your grade level:</p>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => startGame("prek")}
            className="flex-1 py-4 rounded-2xl font-black text-white text-base shadow-lg hover:scale-105 transition-transform border-4 border-green-400"
            style={{ background: "linear-gradient(135deg, #16a34a, #22c55e)" }}
          >
            🌱 PreK – 2nd<br/>
            <span className="text-xs font-semibold opacity-80">3 questions</span>
          </button>
          <button
            onClick={() => startGame("grade3")}
            className="flex-1 py-4 rounded-2xl font-black text-white text-base shadow-lg hover:scale-105 transition-transform border-4 border-cyan-400"
            style={{ background: "linear-gradient(135deg, #0369a1, #0ea5e9)" }}
          >
            🚀 3rd – 8th<br/>
            <span className="text-xs font-semibold opacity-80">5 questions</span>
          </button>
        </div>

        <Link to={backTo} className="text-gray-500 hover:text-gray-700 font-semibold text-sm">
          {backLabel}
        </Link>
      </div>
    </div>
  );

  /* ─── RESULT ─────────────────────────────────────────────────────────────── */
  if (phase === "result") {
    const won   = correct === totalQ;
    const pct   = Math.round((correct / totalQ) * 100);
    const medal = won ? "🏆" : correct >= Math.ceil(totalQ / 2) ? "🌟" : "💪";
    const msg   = won ? "You finished the race! Incredible!" : correct >= Math.ceil(totalQ / 2) ? "Great effort, keep training!" : "Keep practising — you'll get there!";
    return (
      <div className="min-h-screen flex items-center justify-center py-10 px-4" style={bg}>
        <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-cyan-400 p-8 max-w-lg w-full text-center">
          {/* Track showing final position */}
          <div className="rounded-2xl overflow-hidden border-2 border-cyan-200 mb-4">
            <RaceTrack position={position} finished={won}/>
          </div>

          <div className="text-5xl mb-2 animate-bounce">{medal}</div>
          <h2 className="text-2xl font-black text-gray-800 mb-1">{msg}</h2>
          <p className="text-cyan-600 font-bold mb-4">{pct}% of the race completed</p>

          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-cyan-50 border-2 border-cyan-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-cyan-600">{score}</div>
              <div className="text-xs text-cyan-700 font-bold">Points</div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-green-600">{correct} / {totalQ}</div>
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
            <button
              onClick={() => setPhase("start")}
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

  /* ─── PLAYING ────────────────────────────────────────────────────────────── */
  const q           = questions[idx];
  const gridCols    = q.options.length === 4 ? "grid-cols-2" : q.options.length === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="min-h-screen flex flex-col" style={bg}>

      {/* Timer bar */}
      <div className="h-1.5 bg-white/10 flex-shrink-0">
        <div className="h-full transition-all duration-1000"
          style={{ width: `${(timeLeft / GAME_DURATION) * 100}%`, background: timerColor }}/>
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-black/20 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
        <Link to={backTo} className="text-white/70 hover:text-white font-semibold text-sm">← Exit</Link>
        <span className="font-black text-white text-sm">🏁 Finish the Race!</span>
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400/20 border-2 border-yellow-400 rounded-full px-3 py-1 flex items-center gap-1">
            <span className="text-sm">⭐</span>
            <span className="font-black text-yellow-300 text-sm">{score}</span>
          </div>
          <div className="rounded-full px-3 py-1 border-2 flex items-center gap-1"
            style={{ background: "rgba(0,0,0,0.2)", borderColor: timerColor }}>
            <span className="text-sm">⏱️</span>
            <span className="font-black text-sm" style={{ color: timerColor }}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* ── RACE TRACK (top ~38%) ── */}
      <div className="flex-shrink-0 border-b border-white/10" style={{ flex: "0 0 38%" }}>
        <RaceTrack position={position} finished={false}/>

        {/* Progress info bar under track */}
        <div className="flex items-center justify-between px-6 py-1.5 bg-black/25">
          <span className="text-white/60 text-xs font-bold uppercase tracking-wider">
            Question {idx + 1} of {totalQ}
          </span>
          <div className="flex gap-1.5">
            {questions.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  width: 9, height: 9,
                  background: i < idx
                    ? (answers[i]?.ok ? "#4ade80" : "#f87171")
                    : i === idx ? "#38bdf8" : "rgba(255,255,255,0.2)",
                  transform: i === idx ? "scale(1.4)" : "scale(1)",
                }}/>
            ))}
          </div>
          <span className="text-cyan-300 text-xs font-bold">
            {correct}/{totalQ} correct
          </span>
        </div>
      </div>

      {/* ── QUESTION + OPTIONS (bottom ~62%) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-5 gap-5 overflow-auto">

        {/* Question */}
        <div className="w-full max-w-2xl bg-white/10 border border-white/20 rounded-3xl p-5">
          <p className="font-black text-white text-xl leading-snug text-center">
            {q.question}
          </p>
        </div>

        {/* Options grid */}
        <div className={`grid ${gridCols} gap-3 w-full max-w-2xl`}>
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
                className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 select-none"
                style={{
                  background: cardBg,
                  border:     `2.5px solid ${borderC}`,
                  cursor:     picked ? "default" : "pointer",
                  transform:  !picked ? undefined : isCorrect ? "scale(1.03)" : isWrong ? "scale(0.97)" : "scale(0.94)",
                  opacity:    dim ? 0.35 : 1,
                }}
              >
                {/* Letter badge */}
                <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-black text-lg"
                  style={{
                    background: isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "rgba(255,255,255,0.15)",
                    color: "white",
                  }}>
                  {opt.id.toUpperCase()}
                </div>

                {/* Emoji */}
                {opt.emoji && (
                  <span className="text-3xl flex-shrink-0">{opt.emoji}</span>
                )}

                {/* Text */}
                <span className="font-black text-white text-base leading-tight">{opt.text}</span>

                {/* Result indicator */}
                {isCorrect && <span className="ml-auto text-green-300 text-xl">✅</span>}
                {isWrong   && <span className="ml-auto text-red-300   text-xl">❌</span>}
              </div>
            );
          })}
        </div>

        {/* Explanation */}
        {picked && (
          <div className="w-full max-w-2xl rounded-2xl px-5 py-3 bg-white/10 border border-white/20">
            <p className="text-white font-semibold text-sm text-center leading-relaxed">
              {q.explanation}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
