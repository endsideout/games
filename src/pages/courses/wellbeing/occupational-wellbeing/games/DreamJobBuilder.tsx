import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../../components";
import { useGameUser } from "../../../../../context/GameUserContext";
import { generateSessionId } from "../../../../../lib/sessionId";

function speak(text: string, muted: boolean) {
  if (muted || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("samantha")) ??
    voices.find(v => v.lang.startsWith("en") && !v.name.toLowerCase().includes("compact")) ??
    voices.find(v => v.lang.startsWith("en")) ?? null;
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}

const GAME_ID = "dream-job-builder";

type TraitKey = "analytical" | "creative" | "caring" | "physical" | "social";

interface Option { label: string; emoji: string; traits: Partial<Record<TraitKey, number>>; }
interface Question { text: string; emoji: string; options: Option[]; }

const QUESTIONS: Question[] = [
  {
    text: "What do you love doing most after school?",
    emoji: "💭",
    options: [
      { label: "Reading and learning new things", emoji: "📚", traits: { analytical: 2 } },
      { label: "Making and creating things",      emoji: "🎨", traits: { creative: 2 } },
      { label: "Helping and caring for others",   emoji: "🤝", traits: { caring: 2 } },
    ],
  },
  {
    text: "Where would you love to work?",
    emoji: "🏙️",
    options: [
      { label: "Outdoors, moving around",        emoji: "🌿", traits: { physical: 2 } },
      { label: "In a cozy office or lab",         emoji: "🏢", traits: { analytical: 2 } },
      { label: "Travelling and meeting people",   emoji: "✈️", traits: { social: 2 } },
    ],
  },
  {
    text: "Which activity sounds most fun?",
    emoji: "🎯",
    options: [
      { label: "Solving a really tricky puzzle",  emoji: "🧩", traits: { analytical: 2 } },
      { label: "Creating something beautiful",    emoji: "🖌️", traits: { creative: 2 } },
      { label: "Teaching a friend something new", emoji: "📖", traits: { caring: 1, social: 1 } },
    ],
  },
  {
    text: "If you had a superpower, you would…",
    emoji: "⚡",
    options: [
      { label: "Heal anyone who is sick",           emoji: "💊", traits: { caring: 2 } },
      { label: "Build incredible things",           emoji: "🔧", traits: { physical: 1, creative: 1 } },
      { label: "Understand everything around me",   emoji: "🔬", traits: { analytical: 2 } },
    ],
  },
  {
    text: "What makes you feel most proud?",
    emoji: "🌟",
    options: [
      { label: "Finishing a creative project",     emoji: "🎨", traits: { creative: 2 } },
      { label: "Helping someone who needed me",    emoji: "🤗", traits: { caring: 2 } },
      { label: "Solving a really hard problem",    emoji: "🧠", traits: { analytical: 2 } },
    ],
  },
];

const CAREERS = [
  { title: "Doctor",    emoji: "👨‍⚕️", color: "#dc2626", bg: "#fef2f2", description: "You care deeply about people and love solving health mysteries!", weights: { caring: 5, analytical: 4, social: 2, physical: 1, creative: 0 } },
  { title: "Teacher",   emoji: "👩‍🏫", color: "#2563eb", bg: "#eff6ff", description: "You love sharing knowledge and helping others learn and grow!", weights: { caring: 4, social: 3, analytical: 2, creative: 2, physical: 0 } },
  { title: "Artist",    emoji: "🎨",   color: "#7c3aed", bg: "#faf5ff", description: "Your creativity shines — you make the world more beautiful!", weights: { creative: 6, social: 2, analytical: 0, caring: 0, physical: 0 } },
  { title: "Engineer",  emoji: "👷",   color: "#16a34a", bg: "#f0fdf4", description: "You love building things and solving big problems!", weights: { analytical: 5, creative: 3, physical: 2, caring: 0, social: 0 } },
  { title: "Chef",      emoji: "👨‍🍳", color: "#d97706", bg: "#fffbeb", description: "You're creative and love making people happy with delicious food!", weights: { creative: 4, social: 3, physical: 2, caring: 1, analytical: 0 } },
  { title: "Pilot",     emoji: "✈️",   color: "#0284c7", bg: "#f0f9ff", description: "Calm, analytical and adventurous — the sky is your office!", weights: { analytical: 4, physical: 4, social: 2, creative: 0, caring: 0 } },
  { title: "Scientist", emoji: "🔬",   color: "#059669", bg: "#ecfdf5", description: "Endlessly curious — you love discovering how the world works!", weights: { analytical: 6, creative: 2, physical: 0, caring: 0, social: 0 } },
  { title: "Athlete",   emoji: "🏃",   color: "#ea580c", bg: "#fff7ed", description: "You love being active and pushing yourself to new limits!", weights: { physical: 6, social: 2, caring: 1, analytical: 0, creative: 0 } },
];

// Building pieces that appear as user answers each question
const BUILD_PIECES = [
  { part: "👟", label: "Shoes" },
  { part: "👖", label: "Legs" },
  { part: "👕", label: "Body" },
  { part: "🙌", label: "Arms" },
  { part: "🧢", label: "Hat" },
];

function matchCareers(traits: Record<TraitKey, number>) {
  return [...CAREERS]
    .map(c => ({
      ...c,
      score: (Object.entries(c.weights) as [TraitKey, number][]).reduce(
        (sum, [t, w]) => sum + (traits[t] ?? 0) * w, 0
      ),
    }))
    .sort((a, b) => b.score - a.score);
}

type Phase = "menu" | "quiz" | "reveal";

export function DreamJobBuilder(): React.JSX.Element {
  const location = useLocation();
  const backTo = new URLSearchParams(location.search).get("from") === "3dw-set1"
    ? "/3d-wellness/set-1"
    : "/occupational-wellbeing";
  const [phase,       setPhase]       = useState<Phase>("menu");
  const [currentQ,   setCurrentQ]    = useState(0);
  const [traits,     setTraits]      = useState<Record<TraitKey, number>>({ analytical: 0, creative: 0, caring: 0, physical: 0, social: 0 });
  const [pieces,     setPieces]      = useState<string[]>([]);
  const [chosen,     setChosen]      = useState<number | null>(null);
  const [topCareers, setTopCareers]  = useState<ReturnType<typeof matchCareers>>([]);
  const [muted,      setMuted]       = useState(false);
  const mutedRef = useRef(false);
  const sessionIdRef = useRef("");
  const { trackEvent } = useGameUser();

  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // Speak question + options whenever the question changes (quiz phase only)
  useEffect(() => {
    if (phase !== "quiz") return;
    const q = QUESTIONS[currentQ];
    const optText = q.options.map((o, i) => `Option ${String.fromCharCode(65 + i)}: ${o.label}`).join(". ");
    speak(`${q.text}. ${optText}`, mutedRef.current);
  }, [currentQ, phase]);

  // Cancel speech on unmount
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  function startGame() {
    setPhase("quiz"); setCurrentQ(0); setPieces([]);
    setTraits({ analytical: 0, creative: 0, caring: 0, physical: 0, social: 0 });
    setChosen(null);
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  }

  function handleAnswer(idx: number) {
    if (chosen !== null) return;
    setChosen(idx);
    const opt = QUESTIONS[currentQ].options[idx];
    const newTraits = { ...traits };
    for (const [k, v] of Object.entries(opt.traits) as [TraitKey, number][]) {
      newTraits[k] = (newTraits[k] ?? 0) + v;
    }
    const newPieces = [...pieces, opt.emoji];

    setTimeout(() => {
      setChosen(null);
      setTraits(newTraits);
      setPieces(newPieces);
      if (currentQ + 1 >= QUESTIONS.length) {
        setTopCareers(matchCareers(newTraits).slice(0, 3));
        setPhase("reveal");
        trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: 5 });
      } else {
        setCurrentQ(q => q + 1);
      }
    }, 700);
  }

  const bgStyle = { background: "linear-gradient(135deg, #f97316 0%, #ea580c 30%, #c2410c 70%, #9a3412 100%)" };

  /* ── MENU ── */
  if (phase === "menu") return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={bgStyle}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-orange-300 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-7xl mb-3">🏗️</div>
        <h1 className="text-4xl font-black text-orange-800 mb-2">Dream Job Builder</h1>
        <p className="text-gray-600 text-lg mb-5 leading-relaxed">
          Answer <strong>5 fun questions</strong> and discover which career matches your personality!
        </p>
        <div className="flex justify-center gap-4 mb-6 text-sm">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl px-4 py-2 text-orange-800">
            <div className="text-2xl">❓</div><div className="font-bold">5 Questions</div>
          </div>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-2 text-amber-800">
            <div className="text-2xl">🏗️</div><div className="font-bold">Build your job</div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl px-4 py-2 text-yellow-800">
            <div className="text-2xl">🎯</div><div className="font-bold">Top 3 matches</div>
          </div>
        </div>
        <button onClick={startGame} className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-black rounded-full shadow-lg hover:scale-105 transition-transform">
          Build My Dream Job! 🚀
        </button>
        <div className="mt-4">
          <Link to={backTo} className="text-orange-400 hover:text-orange-600 font-semibold text-sm">← Back</Link>
        </div>
      </div>
    </div>
  );

  /* ── REVEAL ── */
  if (phase === "reveal") {
    const [first, second, third] = topCareers;
    return (
      <div className="min-h-screen py-8 px-4" style={bgStyle}>
        <div className="max-w-xl mx-auto space-y-5">
          <div className="text-center">
            <div className="text-5xl mb-2 animate-bounce">🎉</div>
            <h2 className="text-3xl font-black text-white mb-1">Your Dream Job is…</h2>
          </div>

          {/* #1 match — big card */}
          <div className="rounded-3xl shadow-2xl border-4 p-8 text-center" style={{ background: first.bg, borderColor: first.color }}>
            <div className="text-8xl mb-3">{first.emoji}</div>
            <h3 className="text-4xl font-black mb-2" style={{ color: first.color }}>{first.title}!</h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">{first.description}</p>
            <div className="inline-block px-4 py-1 rounded-full text-sm font-bold" style={{ background: first.color, color: "white" }}>
              🥇 Best Match
            </div>
          </div>

          {/* #2 and #3 */}
          <p className="text-white/80 text-center font-semibold text-sm">You could also be great as…</p>
          <div className="grid grid-cols-2 gap-4">
            {[second, third].map((c, i) => (
              <div key={i} className="rounded-2xl shadow-xl border-3 p-5 text-center" style={{ background: c.bg, border: `3px solid ${c.color}` }}>
                <div className="text-5xl mb-2">{c.emoji}</div>
                <div className="font-black text-lg" style={{ color: c.color }}>{c.title}</div>
                <div className="text-xs text-gray-500 mt-1">{i === 0 ? "🥈 2nd Match" : "🥉 3rd Match"}</div>
              </div>
            ))}
          </div>

          {/* Built character */}
          <div className="bg-white/20 rounded-2xl p-4 text-center">
            <p className="text-white/80 text-sm font-semibold mb-2">You built yourself step by step!</p>
            <div className="flex justify-center gap-3 text-4xl">
              {pieces.map((p, i) => <span key={i}>{p}</span>)}
            </div>
          </div>

          <div className="flex gap-3 justify-center pb-4">
            <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-full shadow-lg hover:scale-105 transition-transform">
              Try Again 🔄
            </button>
            <Link to={backTo} className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform inline-block">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUIZ ── */
  const q = QUESTIONS[currentQ];
  const progress = ((currentQ) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={bgStyle}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-sm">
        <Link to={backTo} className="text-white/70 hover:text-white font-semibold text-sm">← Exit</Link>
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div key={i} className="w-8 h-2 rounded-full transition-all duration-500"
              style={{ background: i < currentQ ? "#fbbf24" : i === currentQ ? "white" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/80 text-sm font-semibold">{currentQ + 1} / {QUESTIONS.length}</span>
          <button onClick={() => setMuted(m => !m)} className="text-white/80 hover:text-white text-lg leading-none" title={muted ? "Unmute" : "Mute"}>
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/20">
        <div className="h-full bg-yellow-400 transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex gap-4 px-4 py-6" style={{ minHeight: 0 }}>

        {/* LEFT — building character */}
        <div className="flex flex-col items-center justify-end pb-4" style={{ width: 90, flexShrink: 0 }}>
          <p className="text-white/60 text-xs font-bold mb-3 text-center">Building<br/>You!</p>
          <div className="flex flex-col items-center gap-2">
            {BUILD_PIECES.map((bp, i) => (
              <div key={i}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all duration-500"
                style={{
                  background: i < pieces.length ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
                  border: `2px solid ${i < pieces.length ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"}`,
                  transform: i < pieces.length ? "scale(1)" : "scale(0.85)",
                  opacity: i < pieces.length ? 1 : 0.4,
                }}
              >
                {i < pieces.length ? pieces[i] : bp.part}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — question + options */}
        <div className="flex-1 flex flex-col gap-4" style={{ minWidth: 0 }}>

          {/* Question card */}
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-white/50 p-6 text-center flex-shrink-0">
            <div className="text-5xl mb-3">{q.emoji}</div>
            <p className="text-2xl font-black text-gray-800 leading-snug">{q.text}</p>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 items-center">
            {q.options.map((opt, i) => {
              const isChosen = chosen === i;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={chosen !== null}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl text-center transition-all duration-150 disabled:cursor-default"
                  style={{
                    width: "480px",
                    maxWidth: "100%",
                    padding: "22px 28px",
                    background: isChosen ? "rgba(251,191,36,0.95)" : "rgba(255,255,255,0.9)",
                    border: `3px solid ${isChosen ? "#f59e0b" : "rgba(255,255,255,0.4)"}`,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    transform: isChosen ? "scale(1.02)" : "scale(1)",
                  }}
                  onMouseEnter={e => { if (chosen === null) (e.currentTarget as HTMLElement).style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { if (!isChosen) (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
                >
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className="font-black text-2xl text-gray-800 leading-snug">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
