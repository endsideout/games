import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";
import { generateSessionId } from "../../../../lib/sessionId";
import { playCorrect, playWrong, speak as speakShared } from "./gameAudio";

const GAME_ID        = "brain-health-game";
const GAME_DURATION  = 90;
const POINTS_CORRECT = 10;

function speak(text: string, onEnd?: () => void) {
  speakShared(text, {
    keepAlive: true,
    onEnd,
    rate: 0.92,
    noTtsOnEndDelayMs: 100,
  });
}

// ── Flame-man character — matches PDF design ──────────────────────────────────
// Teal/cyan suit, flame hair, confident hero pose, concentric ring aura
function FlameManCharacter({
  state      = "idle",
  flameLevel = 0,
}: {
  state?:      "idle" | "happy" | "sad";
  flameLevel?: number;
}) {
  const isHappy = state === "happy";
  const isSad   = state === "sad";

  // Rings ordered outermost → innermost. One new ring revealed per correct answer,
  // starting from the innermost and growing outward each time.
  const RINGS = [
    { r: 170, fill: "#fffbeb", opacity: 0.28 },
    { r: 138, fill: "#fef3c7", opacity: 0.36 },
    { r: 106, fill: "#fde68a", opacity: 0.45 },
    { r:  76, fill: "#fbbf24", opacity: 0.54 },
    { r:  50, fill: "#f59e0b", opacity: 0.62 },
  ];
  // Visible slice: innermost `flameLevel` rings, from outermost-visible down to innermost
  const visibleRings = RINGS.slice(RINGS.length - flameLevel);

  return (
    <svg
      viewBox="0 0 225 330"
      width="100%"
      height="100%"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <style>{`
          @keyframes ringPop {
            0%   { transform: scale(0.25); opacity: 0; }
            65%  { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .ring-new { transform-origin: 112px 180px; animation: ringPop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        `}</style>
      </defs>

      {/* ── RINGS: rendered outer-first so inner rings sit on top visually ── */}
      {visibleRings.map((ring, i) => {
        const originalIdx = RINGS.length - flameLevel + i; // stable key
        const isNewest    = i === 0;                        // outermost visible = just added
        return (
          <circle
            key={originalIdx}
            className={isNewest ? "ring-new" : undefined}
            cx="112" cy="180"
            r={ring.r}
            fill={ring.fill}
            opacity={ring.opacity}
          />
        );
      })}

      {/* ── FLAME HAIR (drawn before head so head sits on top) ── */}
      <path d="M91,87  C83,62  85,34  93,14  C99,34  95,63  100,84  Z" fill="#f97316" />
      <path d="M101,83 C95,54  99,24  109,6  C116,27 111,57 114,80  Z" fill="#fbbf24" />
      <path d="M110,81 C109,47 115,16 124,2  C130,22 124,53 126,78  Z" fill="#ef4444" />
      <path d="M120,83 C124,55 129,28 136,12 C138,28 133,56 132,81  Z" fill="#f97316" />
      <path d="M129,86 C134,64 137,41 141,26 C143,41 139,65 136,86  Z" fill="#fde68a" />

      {/* ── HEAD ── */}
      <circle cx="112" cy="100" r="25" fill="#fcd5b5" stroke="#e8a87c" strokeWidth="1.5" />

      {/* ── EYE WHITES & IRISES ── */}
      <ellipse cx="102" cy="97" rx="5.5" ry="5" fill="white" />
      <ellipse cx="122" cy="97" rx="5.5" ry="5" fill="white" />
      <circle  cx="103" cy="98" r="3.5"  fill="#1e293b" />
      <circle  cx="122" cy="98" r="3.5"  fill="#1e293b" />
      <circle  cx="104" cy="96.5" r="1.2" fill="white" />
      <circle  cx="123" cy="96.5" r="1.2" fill="white" />

      {/* ── EYEBROWS ── */}
      {!isSad && (
        <>
          <path d="M96,88  L108,91" stroke="#6b3a1f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M116,91 L128,88" stroke="#6b3a1f" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      {isSad && (
        <>
          <path d="M96,91  L108,88" stroke="#6b3a1f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M116,88 L128,91" stroke="#6b3a1f" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* ── MOUTH ── */}
      {(isHappy || (!isHappy && !isSad)) && (
        <>
          <path d="M100,113 Q112,125 124,113"
            stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
          {/* Teeth */}
          <path d="M102,113 Q112,120 122,113"
            stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6"/>
        </>
      )}
      {isSad && (
        <path d="M100,119 Q112,111 124,119"
          stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round"/>
      )}

      {/* ── NECK ── */}
      <rect x="105" y="123" width="14" height="11" rx="4" fill="#fcd5b5" />

      {/* ── TORSO (teal V-shape) ── */}
      <path
        d="M83,132 C81,154 82,172 84,190 L140,190 C142,172 143,154 141,132
           C133,137 124,139 112,139 C100,139 91,137 83,132 Z"
        fill="#0ea5e9"
      />
      {/* Chest muscle crease */}
      <path d="M97,148 Q112,144 127,148"
        stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.5"/>
      <line x1="112" y1="138" x2="112" y2="177"
        stroke="#0284c7" strokeWidth="1.2" opacity="0.28"/>

      {/* ── CHEST EMBLEM (white circle with inner dot) ── */}
      <circle cx="112" cy="161" r="9.5" fill="white"  opacity="0.55" />
      <circle cx="112" cy="161" r="6"   fill="#0ea5e9" opacity="0.45" />

      {/* ── SHOULDER CAPS ── */}
      <ellipse cx="83"  cy="135" rx="14" ry="10" fill="#38bdf8" />
      <ellipse cx="141" cy="135" rx="14" ry="10" fill="#38bdf8" />
      <ellipse cx="83"  cy="133" rx="9"  ry="6"  fill="#7dd3fc" opacity="0.4" />
      <ellipse cx="141" cy="133" rx="9"  ry="6"  fill="#7dd3fc" opacity="0.4" />

      {/* ── ARMS ── */}
      {isHappy ? (
        <>
          {/* Both arms raised in triumph */}
          <path d="M83,135  C70,118 58,103 50,87"
            stroke="#0ea5e9" strokeWidth="15" fill="none" strokeLinecap="round"/>
          <path d="M141,135 C154,118 166,103 174,87"
            stroke="#0ea5e9" strokeWidth="15" fill="none" strokeLinecap="round"/>
          <circle cx="48"  cy="85" r="11" fill="#fcd5b5"/>
          <circle cx="176" cy="85" r="11" fill="#fcd5b5"/>
        </>
      ) : isSad ? (
        <>
          {/* Arms drooping */}
          <path d="M83,135  C73,153 65,172 61,191"
            stroke="#0ea5e9" strokeWidth="15" fill="none" strokeLinecap="round"/>
          <path d="M141,135 C151,153 159,172 163,191"
            stroke="#0ea5e9" strokeWidth="15" fill="none" strokeLinecap="round"/>
          <circle cx="59"  cy="193" r="11" fill="#fcd5b5"/>
          <circle cx="165" cy="193" r="11" fill="#fcd5b5"/>
        </>
      ) : (
        <>
          {/* Idle: RIGHT arm raised (matches PDF pose), LEFT arm at hip */}
          <path d="M141,135 C154,118 162,100 168,82"
            stroke="#0ea5e9" strokeWidth="15" fill="none" strokeLinecap="round"/>
          <path d="M83,135  C73,150 67,167 64,186"
            stroke="#0ea5e9" strokeWidth="15" fill="none" strokeLinecap="round"/>
          <circle cx="169" cy="80"  r="11" fill="#fcd5b5"/>
          <circle cx="62"  cy="188" r="11" fill="#fcd5b5"/>
        </>
      )}

      {/* ── BELT ── */}
      <rect x="86" y="186" width="52" height="9" rx="4" fill="#0284c7" />
      <rect x="107" y="186" width="10" height="9" rx="3" fill="#0369a1" />

      {/* ── HIP / UPPER LEG PANELS ── */}
      <path d="M87,193  L84,214 L110,214 L114,196 Z"  fill="#0ea5e9"/>
      <path d="M137,193 L140,214 L114,214 L110,196 Z" fill="#0ea5e9"/>

      {/* ── LEGS ── */}
      <line x1="107" y1="214" x2="96"  y2="272"
        stroke="#0ea5e9" strokeWidth="19" strokeLinecap="round"/>
      <line x1="117" y1="214" x2="128" y2="272"
        stroke="#0ea5e9" strokeWidth="19" strokeLinecap="round"/>

      {/* ── BOOTS (darker teal) ── */}
      <path d="M83,268 C79,281 83,293 95,295  C108,295 111,283 107,270 Z" fill="#0369a1"/>
      <ellipse cx="95"  cy="294" rx="14" ry="5" fill="#025d8c" opacity="0.25"/>
      <path d="M120,270 C118,283 122,295 133,295 C145,295 147,281 143,268 Z" fill="#0369a1"/>
      <ellipse cx="133" cy="294" rx="14" ry="5" fill="#025d8c" opacity="0.25"/>
    </svg>
  );
}

// ── Scenarios ─────────────────────────────────────────────────────────────────
interface Choice   { name: string; emoji: string; desc: string; }
interface Scenario {
  situation:   string;
  question:    string;
  left:        Choice;
  right:       Choice;
  answer:      "left" | "right";
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    situation:   "Flame-man has been feeling stressed all day.",
    question:    "What should he do to feel better?",
    left:  { name: "Get Active",       emoji: "🏀", desc: "Play basketball & move his body" },
    right: { name: "Scroll His Phone", emoji: "📱", desc: "Browse social media for hours" },
    answer: "left",
    explanation: "Exercise releases feel-good chemicals in the brain that melt away stress!",
  },
  {
    situation:   "Flame-man needs a snack to help his brain function.",
    question:    "Which should he choose?",
    left:  { name: "Cupcake", emoji: "🧁", desc: "Sweet & sugary treat" },
    right: { name: "Apple",   emoji: "🍎", desc: "Crunchy fruit full of vitamins" },
    answer: "right",
    explanation: "Apples fuel the brain with natural sugars and vitamins — no sugar crash!",
  },
  {
    situation:   "Flame-man can't focus on his homework.",
    question:    "What should he try first?",
    left:  { name: "Stretch & Breathe", emoji: "🤸", desc: "Take a short movement break" },
    right: { name: "Play Video Games",  emoji: "🎮", desc: "Switch to something fun instead" },
    answer: "left",
    explanation: "A short movement break refreshes the brain so you can focus better when you return!",
  },
  {
    situation:   "Flame-man is feeling lonely and sad.",
    question:    "What would help his brain health most?",
    left:  { name: "Talk to a Friend", emoji: "🗣️", desc: "Share his feelings with someone" },
    right: { name: "Stay Alone",       emoji: "😶",  desc: "Lock himself in his room" },
    answer: "left",
    explanation: "Social connection boosts brain chemicals that lift your mood — superheroes need friends too!",
  },
  {
    situation:   "It's 10pm and Flame-man is still wide awake.",
    question:    "What's best for his brain?",
    left:  { name: "Go to Sleep", emoji: "😴", desc: "Get a full night of rest" },
    right: { name: "Watch TV",    emoji: "📺", desc: "Stay up watching his favourite show" },
    answer: "left",
    explanation: "The brain cleans itself and builds memories during sleep — 8 to 10 hours is every hero's superpower!",
  },
];

type Phase  = "start" | "playing" | "result";
interface Answer { scenario: Scenario; chosen: "left" | "right"; correct: boolean; }

export function BrainHealthGame(): React.JSX.Element {
  const location  = useLocation();
  const fromSet1  = new URLSearchParams(location.search).get("from") === "set1";
  const backTo    = fromSet1 ? "/know-your-health/set-1" : "/know-your-health/module-3";
  const backLabel = fromSet1 ? "← Back to Set 1" : "← Back to Module 3";

  const [phase,      setPhase]      = useState<Phase>("start");
  const [idx,        setIdx]        = useState(0);
  const [answers,    setAnswers]    = useState<Answer[]>([]);
  const [score,      setScore]      = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(GAME_DURATION);
  const [picked,     setPicked]     = useState<"left" | "right" | null>(null);
  const [flameLevel, setFlameLevel] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const sessionIdRef = useRef("");
  const scoreRef     = useRef(0);
  const answersRef   = useRef<Answer[]>([]);
  const phaseRef     = useRef<Phase>("start");
  const advanceRef   = useRef<(() => void) | null>(null);
  const { trackEvent } = useGameUser();

  useEffect(() => { scoreRef.current   = score;   }, [score]);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { phaseRef.current   = phase;   }, [phase]);

  // ── Timer ──
  // TODO(lint-safe-pass): deferred exhaustive-deps fix; timer completion tracking depends on phase-driven lifecycle.
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          try { window.speechSynthesis?.cancel(); } catch {}
          trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current });
          setPhase("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // ── Speak each new scenario ──
  useEffect(() => {
    if (phase !== "playing") return;
    const t = setTimeout(() => {
      const s = SCENARIOS[idx];
      speak(`${s.situation} ${s.question}`);
    }, 450);
    return () => clearTimeout(t);
  }, [idx, phase]);

  // ── Cleanup voice on unmount ──
  useEffect(() => {
    return () => { try { window.speechSynthesis?.cancel(); } catch {} };
  }, []);

  function startGame() {
    setIdx(0); setAnswers([]); setScore(0);
    scoreRef.current = 0; answersRef.current = [];
    setPicked(null); setTimeLeft(GAME_DURATION);
    setFlameLevel(0); setShowLevelUp(false);
    setPhase("playing");
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current, score: 0 });
    speak("Help Flame-man make the right choices for his brain health!");
  }

  function handlePick(side: "left" | "right") {
    if (picked || phase !== "playing") return;
    const scenario   = SCENARIOS[idx];
    const correct    = side === scenario.answer;
    const currentIdx = idx;

    if (correct) {
      const newScore = scoreRef.current + POINTS_CORRECT;
      scoreRef.current = newScore;
      setScore(newScore);
      setFlameLevel(l => Math.min(l + 1, SCENARIOS.length));
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 1600);
      playCorrect();
    } else {
      playWrong();
    }

    setPicked(side);
    setAnswers(prev => [...prev, { scenario, chosen: side, correct }]);

    const feedbackText = correct
      ? `Correct! ${scenario.explanation}`
      : `Not quite. ${scenario.explanation}`;

    // Shared advance function — safe to call from speech onEnd OR Next button.
    // Local `advanced` flag prevents double-fire if both fire around the same time.
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      if (phaseRef.current !== "playing") return;
      const next = currentIdx + 1;
      if (next >= SCENARIOS.length) {
        trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current });
        setPhase("result");
      } else {
        setIdx(next);
        setPicked(null);
      }
    };

    advanceRef.current = advance;
    speak(feedbackText, advance);
  }

  const bg         = { background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #7c3aed 100%)" };
  const timerColor = timeLeft <= 15 ? "#ef4444" : timeLeft <= 30 ? "#f59e0b" : "#4ade80";

  /* ─── START ─────────────────────────────────────────────────────────────── */
  if (phase === "start") return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4" style={bg}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-400 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div style={{ width: 180, margin: "0 auto 12px" }}>
          <FlameManCharacter state="idle" flameLevel={2} />
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Help Flame-man! 🦸</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Flame-man needs YOUR help making smart choices for his{" "}
          <strong className="text-blue-600">brain health</strong>!
          Each correct answer lights up his ring — can you fill them all?
        </p>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 text-sm text-left text-blue-900 space-y-1">
          <p className="font-black mb-1">How to play:</p>
          <p>🦸 Read Flame-man's situation carefully</p>
          <p>👆 Tap the choice that best helps his brain</p>
          <p>🔆 Each correct answer expands his glow ring!</p>
          <p>⏱️ {GAME_DURATION} seconds — {SCENARIOS.length} scenarios</p>
          <p>⭐ +{POINTS_CORRECT} points per correct answer</p>
        </div>
        <button
          onClick={startGame}
          className="w-full py-5 rounded-2xl font-black text-white text-xl shadow-lg hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}
        >
          Help Flame-man! 🔥
        </button>
        <div className="mt-5">
          <Link to={backTo} className="text-gray-500 hover:text-gray-700 font-semibold text-sm">
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );

  /* ─── RESULT ─────────────────────────────────────────────────────────────── */
  if (phase === "result") {
    const correct = answers.filter(a => a.correct).length;
    const total   = answers.length;
    const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
    const medal   = pct === 100 ? "🏆" : pct >= 60 ? "🌟" : "💪";
    const msg     = pct === 100 ? "Flame-man's brain is supercharged!" : pct >= 60 ? "Great choices, hero!" : "Keep training, hero!";
    return (
      <div className="min-h-screen flex items-center justify-center py-10 px-4" style={bg}>
        <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-400 p-8 max-w-lg w-full text-center">
          <div style={{ width: 180, margin: "0 auto 8px" }}>
            <FlameManCharacter state={pct >= 60 ? "happy" : "sad"} flameLevel={flameLevel} />
          </div>
          <div className="text-5xl mb-2 animate-bounce">{medal}</div>
          <h2 className="text-2xl font-black text-gray-800 mb-1">{msg}</h2>

          {/* Ring level */}
          <div className="flex justify-center gap-3 mb-4">
            {Array.from({ length: SCENARIOS.length }, (_, i) => (
              <div key={i} className="rounded-full border-4 transition-all duration-500"
                style={{
                  width: 24, height: 24,
                  background:   i < flameLevel ? "#f59e0b" : "transparent",
                  borderColor:  i < flameLevel ? "#f59e0b" : "#d1d5db",
                  boxShadow:    i < flameLevel ? "0 0 8px #fbbf24" : "none",
                }} />
            ))}
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-yellow-600">{score}</div>
              <div className="text-xs text-yellow-700 font-bold">Points</div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl px-5 py-3">
              <div className="text-2xl font-black text-green-600">{correct} / {total}</div>
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
                style={{ borderColor: a.correct ? "#22c55e" : "#ef4444" }}>
                <span className="text-xl mt-0.5">{a.correct ? "✅" : "❌"}</span>
                <div>
                  <p className="text-xs text-gray-500 font-bold">{a.scenario.situation}</p>
                  <p className="text-xs italic mt-1" style={{ color: a.correct ? "#16a34a" : "#dc2626" }}>
                    {a.scenario.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={startGame}
              className="px-6 py-3 rounded-full font-black text-white shadow hover:scale-105 transition-transform text-sm"
              style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}>
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

  /* ─── PLAYING — split layout: character left 25%, content right 75% ──────── */
  const scenario    = SCENARIOS[idx];
  const correctSide = scenario.answer;
  const heroState   = picked ? (picked === correctSide ? "happy" : "sad") : "idle";

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
        <span className="font-black text-white text-sm">🦸 Help Flame-man!</span>
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

      {/* Main split layout */}
      <div className="flex flex-1 min-h-0">

        {/* ── LEFT PANEL: Character (25%) ── */}
        <div
          className="flex flex-col items-center justify-center relative border-r border-white/10 overflow-hidden"
          style={{ width: "25%", flexShrink: 0, background: "rgba(0,0,0,0.12)" }}
        >
          {/* Ring dots at top */}
          <div className="absolute top-3 left-0 right-0 flex justify-center gap-2 z-10">
            {Array.from({ length: SCENARIOS.length }, (_, i) => (
              <div key={i} className="rounded-full transition-all duration-500"
                style={{
                  width: 9, height: 9,
                  background:  i < flameLevel ? "#fbbf24" : "rgba(255,255,255,0.2)",
                  boxShadow:   i < flameLevel ? "0 0 6px #fbbf24" : "none",
                  transform:   i === flameLevel - 1 && showLevelUp ? "scale(1.6)" : "scale(1)",
                }} />
            ))}
          </div>

          {/* Character SVG — fills the panel */}
          <div className="w-full px-2 flex items-center justify-center" style={{ height: "calc(100% - 60px)" }}>
            <div style={{ width: "100%", maxWidth: 230 }}>
              <FlameManCharacter state={heroState} flameLevel={flameLevel} />
            </div>
          </div>

          {/* Level label */}
          <div className="absolute bottom-3 text-white/40 text-xs font-bold tracking-wider uppercase">
            Ring {flameLevel} / {SCENARIOS.length}
          </div>

          {/* Level-up pop */}
          {showLevelUp && (
            <div className="absolute inset-0 flex items-end justify-center pb-16 pointer-events-none">
              <div className="bg-yellow-400/90 text-gray-900 font-black text-sm px-3 py-1.5 rounded-full shadow-xl animate-bounce">
                ✨ Ring expanded!
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: Game content (75%) ── */}
        <div
          className="flex flex-col items-center justify-center px-8 py-6 gap-5"
          style={{ width: "75%" }}
        >
          <p className="text-white/50 text-xs font-bold uppercase tracking-widest self-start">
            Scenario {idx + 1} of {SCENARIOS.length}
          </p>

          {/* Scenario + question card */}
          <div className="w-full bg-white/10 border border-white/20 rounded-3xl p-6">
            <p className="text-white/75 text-base mb-2 leading-relaxed">{scenario.situation}</p>
            <p className="font-black text-white text-2xl leading-snug">{scenario.question}</p>
          </div>

          {/* Choice cards */}
          <div className="flex gap-4 w-full">
            {(["left", "right"] as const).map(side => {
              const choice    = side === "left" ? scenario.left : scenario.right;
              const isCorrect = !!(picked && side === correctSide);
              const isWrong   = !!(picked && side === picked && !isCorrect);
              const borderC   = !picked ? "rgba(255,255,255,0.25)"
                : isCorrect ? "#22c55e" : isWrong ? "#ef4444" : "rgba(255,255,255,0.08)";
              const cardBg    = !picked ? "rgba(255,255,255,0.10)"
                : isCorrect ? "rgba(34,197,94,0.18)" : isWrong ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.04)";

              return (
                <div
                  key={side}
                  onClick={() => handlePick(side)}
                  className="flex-1 flex flex-col items-center text-center rounded-3xl p-5 transition-all duration-200 select-none"
                  style={{
                    background: cardBg,
                    border:     `2.5px solid ${borderC}`,
                    cursor:     picked ? "default" : "pointer",
                    transform:  !picked ? undefined : isCorrect ? "scale(1.04)" : isWrong ? "scale(0.97)" : "scale(0.94)",
                    opacity:    picked && !isCorrect && !isWrong ? 0.38 : 1,
                  }}
                >
                  <div style={{ fontSize: 72, lineHeight: 1 }}>{choice.emoji}</div>
                  <p className="font-black text-white text-lg mt-3">{choice.name}</p>
                  <p className="text-white/55 text-xs mt-1">{choice.desc}</p>
                  {isCorrect && <p className="text-green-300 font-black text-sm mt-3">✅ Correct!</p>}
                  {isWrong   && <p className="text-red-300   font-black text-sm mt-3">❌ Not quite</p>}
                  {!picked   && <p className="text-white/35 text-xs mt-3">Tap to choose</p>}
                </div>
              );
            })}
          </div>

          {/* Explanation banner + Next button */}
          {picked && (
            <div className="w-full flex flex-col items-center gap-3">
              <div className="w-full rounded-2xl px-5 py-3 bg-white/10 border border-white/20">
                <p className="text-white font-semibold text-sm text-center leading-relaxed">
                  {scenario.explanation}
                </p>
              </div>
              <button
                onClick={() => advanceRef.current?.()}
                className="px-8 py-3 rounded-full font-black text-white text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #7c3aed)" }}
              >
                {idx + 1 >= SCENARIOS.length ? "See Results 🏆" : "Next →"}
              </button>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex gap-2">
            {SCENARIOS.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  width: 10, height: 10,
                  background: i < idx
                    ? (answers[i]?.correct ? "#4ade80" : "#f87171")
                    : i === idx ? "#fbbf24" : "rgba(255,255,255,0.2)",
                  transform: i === idx ? "scale(1.4)" : "scale(1)",
                }} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
