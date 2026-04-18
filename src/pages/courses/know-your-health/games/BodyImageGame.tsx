import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";

const GAME_ID        = "body-image-game";
const POINTS_CORRECT = 20;

// ── Module-level utterance store — prevents Chrome GC bug ─────────────────────
// Chrome can silently garbage-collect SpeechSynthesisUtterance objects created
// inside callbacks. Keeping a module-level reference prevents this.
let _utter: SpeechSynthesisUtterance | null = null;

// ── Core speak function ────────────────────────────────────────────────────────
// No voice selection — Brave and other privacy browsers block getVoices() /
// voiceschanged. Using the system default voice works everywhere.
function speakNow(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
) {
  if (!("speechSynthesis" in window)) { onEnd?.(); return; }
  try {
    window.speechSynthesis.cancel();
    _utter = null;

    // Wait one tick after cancel before queuing the new utterance
    setTimeout(() => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        _utter   = u;       // keep alive — prevents Chrome GC bug
        u.rate   = 1.0;
        u.pitch  = 1.05;
        u.volume = 1.0;
        u.onstart = () => onStart?.();
        u.onend   = () => { _utter = null; onEnd?.(); };
        u.onerror = (e) => { console.warn("TTS error:", e.error); _utter = null; onEnd?.(); };
        window.speechSynthesis.speak(u);
      } catch (e) {
        console.warn("TTS exception:", e);
        onEnd?.();
      }
    }, 100);
  } catch (e) {
    console.warn("TTS outer exception:", e);
    onEnd?.();
  }
}

// ── Feedback speak (used for correct/wrong answers) ───────────────────────────
function speak(text: string) { speakNow(text); }

// ── Sounds ────────────────────────────────────────────────────────────────────
function playCorrect() {
  try {
    const ctx = new AudioContext();
    [[523, 0], [659, 0.14], [784, 0.28]].forEach(([freq, delay]) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = freq;
      const t = ctx.currentTime + delay;
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
    });
  } catch (_) {}
}

function playWrong() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(280, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.24, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(); osc.stop(ctx.currentTime + 0.4);
  } catch (_) {}
}

// ── Statement data ────────────────────────────────────────────────────────────
interface Statement {
  id: number;
  text: string;
  answer: "positive" | "negative";
  explanation: string;
}

const STATEMENTS: Statement[] = [
  {
    id: 1,
    text: "My appearance does not say anything about my character and values.",
    answer: "positive",
    explanation:
      "Your kindness, creativity, and values define who you are — not how you look. That's positive body image!",
  },
  {
    id: 2,
    text: "I celebrate and appreciate my body.",
    answer: "positive",
    explanation:
      "Appreciating what your body can do and celebrating it is a beautiful sign of positive body image!",
  },
  {
    id: 3,
    text: "I'm always thinking about food, exercise, and body size.",
    answer: "negative",
    explanation:
      "Constantly obsessing over food, exercise, and body size can be harmful and reflects a negative body image.",
  },
  {
    id: 4,
    text: "I compare myself to others.",
    answer: "negative",
    explanation:
      "Comparing yourself to others hurts your self-esteem. Everyone is unique and worthy just as they are!",
  },
  {
    id: 5,
    text: "I feel comfortable in my body.",
    answer: "positive",
    explanation:
      "Feeling comfortable in your body is a sign of positive body image. It means you accept and appreciate yourself just as you are!",
  },
];

// ── Mirror / body illustration SVG ───────────────────────────────────────────
function MirrorSVG({ mood }: { mood: "neutral" | "happy" | "sad" }) {
  const faceColor =
    mood === "happy" ? "#22c55e" : mood === "sad" ? "#ef4444" : "#8b5cf6";
  return (
    <svg viewBox="0 0 120 160" width="160" height="213">
      {/* Mirror frame */}
      <ellipse cx="60" cy="72" rx="46" ry="58" fill="#e0d7f8" stroke="#7c3aed" strokeWidth="5" />
      <rect x="50" y="126" width="20" height="22" rx="4" fill="#7c3aed" />
      <rect x="36" y="144" width="48" height="10" rx="5" fill="#5b21b6" />
      {/* Reflection — simple face */}
      <circle cx="60" cy="62" r="28" fill="white" opacity={0.85} />
      {/* Eyes */}
      <circle cx="50" cy="57" r="5" fill={faceColor} />
      <circle cx="70" cy="57" r="5" fill={faceColor} />
      <circle cx="51" cy="56" r="2" fill="white" />
      <circle cx="71" cy="56" r="2" fill="white" />
      {/* Mouth */}
      {mood === "happy" ? (
        <path d="M48 72 Q60 84 72 72" stroke={faceColor} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : mood === "sad" ? (
        <path d="M48 78 Q60 68 72 78" stroke={faceColor} strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M50 74 Q60 74 70 74" stroke={faceColor} strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {/* Heart sparkles for happy */}
      {mood === "happy" && (
        <>
          <text x="96" y="28" fontSize="14" textAnchor="middle">💜</text>
          <text x="14" y="32" fontSize="12" textAnchor="middle">✨</text>
        </>
      )}
    </svg>
  );
}

// ── Speaker button component ──────────────────────────────────────────────────
function SpeakerButton({
  text,
  statementId,
}: {
  text: string;
  statementId: number;
}) {
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false); // tracks whether speak was actually initiated

  const doSpeak = useCallback(() => {
    setPlaying(false);
    startedRef.current = false;
    speakNow(
      text,
      () => { setPlaying(true);  startedRef.current = true; },
      () => { setPlaying(false); startedRef.current = false; },
    );
  }, [text]);

  // Auto-play when statementId changes (new statement shown)
  useEffect(() => {
    // Small delay so the component is fully painted before speaking
    const t = setTimeout(doSpeak, 400);
    return () => {
      clearTimeout(t);
      // Only cancel if speech hasn't started yet — avoids cutting off mid-sentence
      if (!startedRef.current && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setPlaying(false);
    };
  }, [statementId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      onClick={doSpeak}
      title="Hear the statement"
      style={{
        flexShrink: 0,
        width: 64,
        height: 64,
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: playing
          ? "linear-gradient(135deg, #7c3aed, #db2777)"
          : "linear-gradient(135deg, #ede9fe, #fce7f3)",
        boxShadow: playing
          ? "0 0 0 4px #c4b5fd, 0 4px 16px rgba(124,58,237,0.4)"
          : "0 2px 8px rgba(0,0,0,0.12)",
        transition: "all 0.25s ease",
        transform: playing ? "scale(1.1)" : "scale(1)",
      }}
    >
      {playing ? (
        // Animated speaker waves SVG
        <svg viewBox="0 0 28 28" width="32" height="32">
          <style>{`
            @keyframes wave1 { 0%,100%{opacity:1} 50%{opacity:0.3} }
            @keyframes wave2 { 0%,100%{opacity:0.3} 50%{opacity:1} }
            .w1 { animation: wave1 0.7s ease infinite; }
            .w2 { animation: wave2 0.7s ease infinite; }
          `}</style>
          <path d="M4 10H1v8h3l6 5V5L4 10z" fill="white"/>
          <path className="w1" d="M15 9a6 6 0 0 1 0 10" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path className="w2" d="M18.5 6a11 11 0 0 1 0 16" stroke="white" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </svg>
      ) : (
        // Static speaker SVG
        <svg viewBox="0 0 28 28" width="32" height="32">
          <path d="M4 10H1v8h3l6 5V5L4 10z" fill="#7c3aed"/>
          <path d="M15 9a6 6 0 0 1 0 10" stroke="#7c3aed" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.4"/>
          <path d="M18.5 6a11 11 0 0 1 0 16" stroke="#7c3aed" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity="0.2"/>
        </svg>
      )}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function BodyImageGame(): React.JSX.Element {
  const location  = useLocation();
  const { trackEvent } = useGameUser();
  const backTo    = new URLSearchParams(location.search).get("from") === "set1"
    ? "/know-your-health-set1"
    : "/know-your-health/module-7";

  const [phase, setPhase]       = useState<"start" | "playing" | "result" | "done">("start");
  const [current, setCurrent]   = useState(0);
  const [score, setScore]       = useState(0);
  const [picked, setPicked]     = useState<"positive" | "negative" | null>(null);
  const [correct, setCorrect]   = useState<boolean | null>(null);
  const [mood, setMood]         = useState<"neutral" | "happy" | "sad">("neutral");

  const stmt = STATEMENTS[current];
  const isLast = current === STATEMENTS.length - 1;

  // Reset visual state when a new question is shown (speech is handled by SpeakerButton)
  useEffect(() => {
    if (phase !== "playing") return;
    setMood("neutral");
    setPicked(null);
    setCorrect(null);
  }, [phase, current]);

  function handlePick(choice: "positive" | "negative") {
    if (picked !== null) return;
    const isCorrect = choice === stmt.answer;
    setPicked(choice);
    setCorrect(isCorrect);
    setMood(isCorrect ? "happy" : "sad");
    if (isCorrect) {
      setScore(s => s + POINTS_CORRECT);
      playCorrect();
      speak(`Correct! ${stmt.explanation}`);
    } else {
      playWrong();
      speak(`Not quite. ${stmt.explanation}`);
    }
    setPhase("result");
  }

  function handleNext() {
    if (isLast) {
      setPhase("done");
      speak(score + POINTS_CORRECT >= STATEMENTS.length * POINTS_CORRECT * 0.8
        ? "Amazing work! You have a great understanding of body image!"
        : "Good try! Keep learning about positive body image!");
      trackEvent({ gameId: GAME_ID, event: "game_completed", score });
    } else {
      setCurrent(c => c + 1);
      setPhase("playing");
    }
  }

  // ── Start screen ─────────────────────────────────────────────────────────────
  if (phase === "start") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #db2777 100%)" }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
          <Logo size="md" className="mx-auto mb-4" />
          <MirrorSVG mood="happy" />
          <h1 className="text-3xl font-black text-gray-800 mt-3 mb-2">Body Image Quiz</h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            Read each statement and decide — is it a{" "}
            <span className="text-green-600 font-bold">Positive</span> or{" "}
            <span className="text-red-500 font-bold">Negative</span> body image attitude?
          </p>
          <div className="flex gap-3 justify-center mb-6 text-sm">
            <div className="flex items-center gap-2 bg-green-50 rounded-xl px-4 py-2 border border-green-300">
              <span className="text-2xl">👍</span>
              <span className="text-green-700 font-bold">Positive</span>
            </div>
            <div className="flex items-center gap-2 bg-red-50 rounded-xl px-4 py-2 border border-red-300">
              <span className="text-2xl">👎</span>
              <span className="text-red-600 font-bold">Negative</span>
            </div>
          </div>
          <button
            onClick={() => setPhase("playing")}
            className="w-full py-4 rounded-2xl text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
            style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
          >
            Let's Start! 🪞
          </button>
          <Link to={backTo} className="mt-4 inline-block text-gray-400 hover:text-gray-600 text-sm">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  // ── Done screen ──────────────────────────────────────────────────────────────
  if (phase === "done") {
    const finalScore = score + (correct ? 0 : 0); // score already updated in handlePick
    const pct = Math.round((finalScore / (STATEMENTS.length * POINTS_CORRECT)) * 100);
    const emoji = pct >= 80 ? "🌟" : pct >= 60 ? "💜" : "💪";
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #db2777 100%)" }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div style={{ fontSize: "5rem" }}>{emoji}</div>
          <h2 className="text-3xl font-black text-gray-800 mb-1">
            {pct >= 80 ? "Excellent!" : pct >= 60 ? "Well Done!" : "Keep Learning!"}
          </h2>
          <p className="text-gray-500 text-sm mb-4">You completed the Body Image Quiz!</p>
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-black text-purple-600">{finalScore}</div>
              <div className="text-xs text-gray-500 font-semibold">pts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-pink-500">{pct}%</div>
              <div className="text-xs text-gray-500 font-semibold">correct</div>
            </div>
          </div>
          {/* Score bar */}
          <div className="w-full bg-gray-100 rounded-full h-4 mb-6 overflow-hidden">
            <div
              className="h-4 rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #7c3aed, #db2777)",
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setCurrent(0); setScore(0); setPhase("playing"); }}
              className="w-full py-3 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #7c3aed, #db2777)" }}
            >
              🔄 Play Again
            </button>
            <Link
              to={backTo}
              className="w-full py-3 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform block"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Playing / Result screen ──────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #db2777 100%)" }}
    >
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-6px); }
          80%     { transform: translateX(6px); }
        }
        @keyframes popIn {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .card-animate  { animation: cardIn 0.4s ease forwards; }
        .shake-animate { animation: shake 0.5s ease; }
        .pop-animate   { animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Logo size="sm" />
        <div className="text-center">
          <div className="text-white font-black text-lg">Body Image Quiz</div>
          <div className="text-white/70 text-xs font-semibold">
            Statement {current + 1} of {STATEMENTS.length}
          </div>
        </div>
        <div className="bg-white/20 rounded-2xl px-4 py-2 text-white font-black text-lg">
          {score} pts
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-5 mb-4 bg-white/20 rounded-full h-2.5 overflow-hidden">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{
            width: `${((current) / STATEMENTS.length) * 100}%`,
            background: "linear-gradient(90deg, #fde68a, #f9a8d4)",
          }}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-6 gap-5">

        {/* Mirror + Statement card */}
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-7 card-animate"
          style={{ animationFillMode: "both" }}
        >
          {/* Mirror illustration */}
          <div className="flex justify-center mb-4">
            <MirrorSVG mood={mood} />
          </div>

          {/* Statement label */}
          <div
            className="text-center text-xs font-black uppercase tracking-widest mb-2"
            style={{ color: "#7c3aed" }}
          >
            Statement {current + 1}
          </div>

          {/* Statement text + Speaker button */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <p style={{ flex: 1, fontSize: "1.15rem", fontWeight: 600, color: "#1f2937", lineHeight: 1.6, margin: 0 }}>
              "{stmt.text}"
            </p>
            <SpeakerButton
              text={stmt.text}
              statementId={current}
            />
          </div>

          {/* Feedback box (shown after picking) */}
          {phase === "result" && (
            <div
              className={`rounded-2xl p-4 mb-2 pop-animate ${correct ? "bg-green-50 border-2 border-green-400" : "bg-red-50 border-2 border-red-400"}`}
            >
              <div className={`text-center font-black text-lg mb-1 ${correct ? "text-green-700" : "text-red-600"}`}>
                {correct ? "✅ Correct!" : "❌ Not quite!"}
              </div>
              <p className="text-gray-700 text-sm text-center leading-relaxed">
                {stmt.explanation}
              </p>
              <div className="mt-2 text-center">
                <span
                  className={`inline-block px-4 py-1 rounded-full text-white text-xs font-bold ${stmt.answer === "positive" ? "bg-green-500" : "bg-red-500"}`}
                >
                  This statement is {stmt.answer.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Choice buttons — hidden after picking */}
        {phase === "playing" && (
          <div className="flex gap-4 w-full max-w-xl">
            <button
              onClick={() => handlePick("positive")}
              className="flex-1 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-1"
              style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "white" }}
            >
              <span style={{ fontSize: "2.5rem" }}>👍</span>
              Positive
            </button>
            <button
              onClick={() => handlePick("negative")}
              className="flex-1 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 transition-transform flex flex-col items-center gap-1"
              style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)", color: "white" }}
            >
              <span style={{ fontSize: "2.5rem" }}>👎</span>
              Negative
            </button>
          </div>
        )}

        {/* Picked answer display + Next button */}
        {phase === "result" && (
          <div className="flex flex-col items-center gap-3 w-full max-w-xl">
            {/* Show what they picked */}
            <div className="flex gap-4 w-full">
              <div
                className={`flex-1 py-4 rounded-2xl font-black text-xl flex flex-col items-center gap-1 border-4 transition-all ${
                  picked === "positive"
                    ? correct
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-red-100 border-red-400 text-red-600 opacity-60"
                    : "bg-white/30 border-white/30 text-white/50 opacity-40"
                }`}
              >
                <span style={{ fontSize: "2rem" }}>👍</span>
                Positive
              </div>
              <div
                className={`flex-1 py-4 rounded-2xl font-black text-xl flex flex-col items-center gap-1 border-4 transition-all ${
                  picked === "negative"
                    ? correct
                      ? "bg-green-100 border-green-500 text-green-700"
                      : "bg-red-100 border-red-400 text-red-600 opacity-60"
                    : "bg-white/30 border-white/30 text-white/50 opacity-40"
                }`}
              >
                <span style={{ fontSize: "2rem" }}>👎</span>
                Negative
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-xl hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #fbbf24, #f97316)" }}
            >
              {isLast ? "See Results 🏆" : "Next Statement →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
