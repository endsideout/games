import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";

const GAME_ID        = "least-sugar-game";
const GAME_DURATION  = 120; // 2 minutes
const POINTS_CORRECT = 10;

// ── Sound effects (Web Audio API) ────────────────────────────────────────────
function playCorrect() {
  try {
    const ctx = new AudioContext();
    // Two ascending notes: C5 → E5
    [[523, 0], [659, 0.15]].forEach(([freq, delay]) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.35, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.3);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
    setTimeout(() => ctx.close(), 800);
  } catch (_) {}
}

function playWrong() {
  try {
    const ctx  = new AudioContext();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
    setTimeout(() => ctx.close(), 600);
  } catch (_) {}
}

interface FoodOption {
  name: string;
  emoji: string;
  sugar: string; // display label e.g. "~9g sugar"
  sugarG: number; // numeric for comparison
}

interface Round {
  left: FoodOption;
  right: FoodOption;
}

const ROUNDS: Round[] = [
  {
    left:  { name: "Donut",      emoji: "🍩", sugar: "~12g sugar", sugarG: 12 },
    right: { name: "Orange",     emoji: "🍊", sugar: "~9g sugar",  sugarG: 9  },
  },
  {
    left:  { name: "Cookies",    emoji: "🍪", sugar: "~14g sugar", sugarG: 14 },
    right: { name: "Cherries",   emoji: "🍒", sugar: "~8g sugar",  sugarG: 8  },
  },
  {
    left:  { name: "Grapes",     emoji: "🍇", sugar: "~15g sugar", sugarG: 15 },
    right: { name: "Candy",      emoji: "🍬", sugar: "~20g sugar", sugarG: 20 },
  },
  {
    left:  { name: "Cereal",     emoji: "🥣", sugar: "~12g sugar", sugarG: 12 },
    right: { name: "Oatmeal",    emoji: "🌾", sugar: "~1g sugar",  sugarG: 1  },
  },
  {
    left:  { name: "Watermelon", emoji: "🍉", sugar: "~9g sugar",  sugarG: 9  },
    right: { name: "Ice Cream",  emoji: "🍦", sugar: "~21g sugar", sugarG: 21 },
  },
];

type Phase = "start" | "playing" | "result";

interface Answer {
  round: Round;
  chosen: "left" | "right";
  correct: boolean;
}

export function LeastSugarGame(): React.JSX.Element {
  const [phase,       setPhase]       = useState<Phase>("start");
  const [roundIdx,    setRoundIdx]    = useState(0);
  const [answers,     setAnswers]     = useState<Answer[]>([]);
  const [score,       setScore]       = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(GAME_DURATION);
  const [picked,      setPicked]      = useState<"left" | "right" | null>(null); // chosen this round

  const sessionIdRef = useRef("");
  const scoreRef     = useRef(0);
  const answersRef   = useRef<Answer[]>([]);
  const { trackEvent } = useGameUser();

  useEffect(() => { scoreRef.current   = score;   }, [score]);
  useEffect(() => { answersRef.current = answers; }, [answers]);

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

  function startGame() {
    setRoundIdx(0);
    setAnswers([]);
    setScore(0);
    scoreRef.current   = 0;
    answersRef.current = [];
    setPicked(null);
    setTimeLeft(GAME_DURATION);
    setPhase("playing");
    sessionIdRef.current = `${GAME_ID}-${Date.now().toString(36)}`;
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current, score: 0 });
  }

  function handlePick(side: "left" | "right") {
    if (picked || phase !== "playing") return;
    const round   = ROUNDS[roundIdx];
    const chosen  = side === "left" ? round.left : round.right;
    const other   = side === "left" ? round.right : round.left;
    const correct = chosen.sugarG < other.sugarG;

    if (correct) { setScore(s => s + POINTS_CORRECT); playCorrect(); }
    else         { playWrong(); }
    setPicked(side);

    const newAnswers = [...answersRef.current, { round, chosen: side, correct }];
    setAnswers(newAnswers);

    setTimeout(() => {
      const nextIdx = roundIdx + 1;
      if (nextIdx >= ROUNDS.length) {
        trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current });
        setPhase("result");
      } else {
        setRoundIdx(nextIdx);
        setPicked(null);
      }
    }, 1600);
  }

  const bg = { background: "linear-gradient(135deg, #fdf4ff 0%, #fce7f3 40%, #ede9fe 100%)" };
  const timerColor = timeLeft <= 20 ? "#ef4444" : timeLeft <= 40 ? "#f59e0b" : "#22c55e";
  const timerBg    = timeLeft <= 20 ? "#fee2e2" : timeLeft <= 40 ? "#fef3c7" : "#f0fdf4";
  const timerBorder= timeLeft <= 20 ? "#ef4444" : timeLeft <= 40 ? "#f59e0b" : "#22c55e";

  /* ── START ── */
  if (phase === "start") return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4" style={bg}>
      <div className="bg-white/90 rounded-3xl shadow-2xl border-4 border-purple-300 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-6xl mb-3">🍬🚫</div>
        <h1 className="text-3xl font-black text-gray-800 mb-2">Least Sugar!</h1>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Two foods appear — pick the one with <strong className="text-purple-600">less sugar</strong>!
          Earn <strong className="text-yellow-600">10 points</strong> for each correct choice.
        </p>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-4 mb-6 text-sm text-left text-purple-900 space-y-1">
          <p className="font-black mb-1">How to play:</p>
          <p>🍩 Two foods are shown side by side</p>
          <p>👆 Tap the one with LESS sugar</p>
          <p>⏱️ You have <strong>2 minutes</strong> — 5 rounds!</p>
          <p>⭐ +{POINTS_CORRECT} points per correct answer</p>
        </div>
        <button
          onClick={startGame}
          className="w-full py-5 rounded-2xl font-black text-white text-xl shadow-lg hover:scale-105 transition-transform"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
        >
          Let's Go! 🚀
        </button>
      </div>
      <div className="mt-6">
        <Link to="/know-your-health/module-2" className="text-gray-500 hover:text-gray-700 font-semibold text-sm">
          ← Back to Module 2
        </Link>
      </div>
    </div>
  );

  /* ── RESULT ── */
  if (phase === "result") {
    const correct = answers.filter(a => a.correct).length;
    const total   = answers.length;
    const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
    const medal   = pct === 100 ? "🏆" : pct >= 60 ? "🌟" : "💪";
    const msg     = pct === 100 ? "Sugar Expert! 🎉" : pct >= 60 ? "Great job!" : "Keep learning!";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4" style={bg}>
        <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-purple-300 p-8 max-w-lg w-full text-center">
          <div className="text-6xl mb-2 animate-bounce">{medal}</div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">{msg}</h2>

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

          {/* Round breakdown */}
          <div className="space-y-3 text-left mb-6">
            {answers.map((a, i) => {
              const low  = a.round.left.sugarG < a.round.right.sugarG ? a.round.left : a.round.right;
              const high = a.round.left.sugarG < a.round.right.sugarG ? a.round.right : a.round.left;
              return (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border-2"
                  style={{ borderColor: a.correct ? "#22c55e" : "#ef4444" }}>
                  <span className="text-2xl">{a.correct ? "✅" : "❌"}</span>
                  <div className="flex-1 text-sm">
                    <p className="font-black text-gray-800">
                      {a.round.left.emoji} {a.round.left.name} vs {a.round.right.emoji} {a.round.right.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {low.emoji} <strong>{low.name}</strong> has less sugar ({low.sugar}) vs {high.emoji} {high.name} ({high.sugar})
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button onClick={startGame}
              className="px-6 py-3 rounded-full font-black text-white shadow hover:scale-105 transition-transform text-sm"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              Play Again 🔄
            </button>
            <Link to="/know-your-health/module-2"
              className="px-6 py-3 rounded-full font-black text-white shadow hover:scale-105 transition-transform text-sm inline-block"
              style={{ background: "linear-gradient(135deg, #6b7280, #374151)" }}>
              ← Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── PLAYING ── */
  const round        = ROUNDS[roundIdx];
  const correctSide  = round.left.sugarG < round.right.sugarG ? "left" : "right";

  function cardStyle(side: "left" | "right"): React.CSSProperties {
    if (!picked) return {
      background: "white",
      border: "4px solid rgba(0,0,0,0.06)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      transform: "scale(1)",
      transition: "all 0.2s",
      cursor: "pointer",
    };
    if (side === correctSide) return {
      background: "#f0fdf4",
      border: "4px solid #22c55e",
      boxShadow: "0 8px 32px rgba(34,197,94,0.25)",
      transition: "all 0.2s",
    };
    if (side === picked) return {
      background: "#fef2f2",
      border: "4px solid #ef4444",
      boxShadow: "0 8px 32px rgba(239,68,68,0.2)",
      transition: "all 0.2s",
    };
    return {
      background: "white",
      border: "4px solid rgba(0,0,0,0.06)",
      opacity: 0.5,
      transition: "all 0.2s",
    };
  }

  return (
    <div className="min-h-screen flex flex-col" style={bg}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/60 backdrop-blur-sm border-b border-white/40 flex-shrink-0">
        <Link to="/know-your-health/module-2" className="text-gray-500 hover:text-gray-700 font-semibold text-sm">← Exit</Link>
        <span className="font-black text-gray-700">🍬 Least Sugar!</span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-yellow-100 border-2 border-yellow-400 rounded-full px-3 py-1">
            <span className="text-sm">⭐</span>
            <span className="font-black text-yellow-700 text-sm">{score}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full px-3 py-1 border-2"
            style={{ background: timerBg, borderColor: timerBorder }}>
            <span className="text-sm">⏱️</span>
            <span className="font-black text-sm" style={{ color: timerColor }}>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 bg-gray-200 flex-shrink-0">
        <div className="h-full transition-all duration-1000"
          style={{ width: `${(timeLeft / GAME_DURATION) * 100}%`, background: timerColor }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 gap-10">

        {/* Question + round indicator */}
        <div className="text-center">
          <p className="text-base font-bold text-gray-400 uppercase tracking-widest mb-3">
            Round {roundIdx + 1} of {ROUNDS.length}
          </p>
          <h2 className="text-5xl font-black text-gray-800">Which has less sugar? 🍬</h2>
        </div>

        {/* Food cards */}
        <div className="flex gap-10 w-full max-w-3xl">
          {(["left", "right"] as const).map(side => {
            const food = side === "left" ? round.left : round.right;
            const isCorrect = picked && side === correctSide;
            const isWrong   = picked && side === picked && side !== correctSide;
            return (
              <div
                key={side}
                onClick={() => handlePick(side)}
                className="flex-1 flex flex-col items-center rounded-3xl select-none"
                style={{ ...cardStyle(side), padding: "40px 32px" }}
              >
                <div style={{ fontSize: 160, lineHeight: 1 }}>{food.emoji}</div>
                <p className="font-black text-gray-800 text-3xl mt-7">{food.name}</p>

                {/* Sugar reveal after pick */}
                {picked && (
                  <div className="mt-4 text-center">
                    <p className="text-lg font-bold"
                      style={{ color: side === correctSide ? "#16a34a" : "#dc2626" }}>
                      {food.sugar}
                    </p>
                    {isCorrect && <p className="text-green-600 font-black text-base mt-1">✅ Less sugar!</p>}
                    {isWrong   && <p className="text-red-500 font-black text-base mt-1">❌ More sugar</p>}
                  </div>
                )}

                {!picked && (
                  <p className="text-gray-400 text-sm mt-4 font-semibold">Tap to choose</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="flex gap-3">
          {ROUNDS.map((_, i) => (
            <div key={i} className="rounded-full transition-all duration-300"
              style={{
                width: 14, height: 14,
                background: i < roundIdx
                  ? (answers[i]?.correct ? "#22c55e" : "#ef4444")
                  : i === roundIdx ? "#a855f7" : "#d1d5db",
                transform: i === roundIdx ? "scale(1.4)" : "scale(1)",
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}
