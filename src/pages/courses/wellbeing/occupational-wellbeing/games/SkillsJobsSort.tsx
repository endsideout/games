import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../../components";
import { useGameUser } from "../../../../../context/GameUserContext";
import { shuffleArray } from "../../../../../lib/arrayUtils";
import { generateSessionId } from "../../../../../lib/sessionId";

const GAME_ID = "skills-jobs-sort";
const GAME_DURATION = 90;
const POINTS_PER_CORRECT = 10;

interface Skill  { id: string; name: string; emoji: string; correctCareer: string; }
interface Career { id: string; title: string; emoji: string; color: string; bg: string; }

const SKILLS: Skill[] = [
  { id: "treating",   name: "Treating Patients", emoji: "🩺", correctCareer: "doctor"   },
  { id: "xray",       name: "Reading X-Rays",    emoji: "🩻", correctCareer: "doctor"   },
  { id: "lessons",    name: "Teaching Lessons",  emoji: "📖", correctCareer: "teacher"  },
  { id: "grading",    name: "Grading Homework",  emoji: "📝", correctCareer: "teacher"  },
  { id: "cooking",    name: "Cooking Meals",     emoji: "🍳", correctCareer: "chef"     },
  { id: "recipes",    name: "Following Recipes", emoji: "📋", correctCareer: "chef"     },
  { id: "blueprints", name: "Drawing Blueprints",emoji: "📐", correctCareer: "engineer" },
  { id: "building",   name: "Building Structures",emoji: "🏗️", correctCareer: "engineer" },
];

const CAREERS: Career[] = [
  { id: "doctor",   title: "Doctor",   emoji: "👨‍⚕️", color: "#dc2626", bg: "rgba(254,242,242,0.95)" },
  { id: "teacher",  title: "Teacher",  emoji: "👩‍🏫", color: "#2563eb", bg: "rgba(239,246,255,0.95)" },
  { id: "chef",     title: "Chef",     emoji: "👨‍🍳", color: "#d97706", bg: "rgba(255,251,235,0.95)" },
  { id: "engineer", title: "Engineer", emoji: "👷",   color: "#16a34a", bg: "rgba(240,253,244,0.95)" },
];

type Phase = "menu" | "playing" | "finished";
type FeedbackState = { correct: boolean; careerTitle: string } | null;
type Result = { skill: Skill; careerId: string; correct: boolean };

export function SkillsJobsSort(): React.JSX.Element {
  const [phase,      setPhase]      = useState<Phase>("menu");
  const [skillQueue, setSkillQueue] = useState<Skill[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results,    setResults]    = useState<Result[]>([]);
  const [feedback,   setFeedback]   = useState<FeedbackState>(null);
  const [timeLeft,   setTimeLeft]   = useState(GAME_DURATION);
  const [dragOver,   setDragOver]   = useState<string | null>(null);

  const sessionIdRef = useRef("");
  const timeLeftRef  = useRef(GAME_DURATION);
  const resultsRef   = useRef<Result[]>([]);
  const feedbackRef  = useRef<FeedbackState>(null);
  const { trackEvent } = useGameUser();

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);
  useEffect(() => { resultsRef.current = results; }, [results]);
  useEffect(() => { feedbackRef.current = feedback; }, [feedback]);

  function startGame() {
    const shuffled = shuffleArray(SKILLS);
    setSkillQueue(shuffled);
    setCurrentIdx(0);
    setResults([]);
    resultsRef.current = [];
    setFeedback(null);
    setTimeLeft(GAME_DURATION);
    timeLeftRef.current = GAME_DURATION;
    setPhase("playing");
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  }

  // Countdown timer
  // TODO(lint-safe-pass): deferred exhaustive-deps fix; timer completion tracking is intentionally phase-scoped.
  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          const score = resultsRef.current.filter(r => r.correct).length * POINTS_PER_CORRECT;
          trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score });
          setPhase("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  function handleDrop(careerId: string, skill: Skill) {
    if (feedbackRef.current) return;
    const correct = skill.correctCareer === careerId;
    const career = CAREERS.find(c => c.id === careerId)!;
    const newFeedback = { correct, careerTitle: career.title };
    setFeedback(newFeedback);
    feedbackRef.current = newFeedback;

    const newResult: Result = { skill, careerId, correct };
    const newResults = [...resultsRef.current, newResult];
    setResults(newResults);
    resultsRef.current = newResults;

    setTimeout(() => {
      setFeedback(null);
      feedbackRef.current = null;
      setCurrentIdx(idx => {
        const next = idx + 1;
        if (next >= SKILLS.length) {
          const score = newResults.filter(r => r.correct).length * POINTS_PER_CORRECT;
          trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score });
          setPhase("finished");
        }
        return next;
      });
    }, 900);
  }

  const bgStyle = { background: "linear-gradient(135deg, #f97316 0%, #ea580c 30%, #c2410c 70%, #9a3412 100%)" };
  const currentSkill = skillQueue[currentIdx];
  const score = results.filter(r => r.correct).length * POINTS_PER_CORRECT;
  const timerPct = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 30 ? "#22c55e" : timeLeft > 10 ? "#f59e0b" : "#ef4444";

  /* ── MENU ── */
  if (phase === "menu") return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={bgStyle}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-orange-300 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-7xl mb-3">🔧</div>
        <h1 className="text-4xl font-black text-orange-800 mb-2">Skills & Jobs Sort</h1>
        <p className="text-gray-600 text-lg mb-5 leading-relaxed">
          Drag each skill to the career that needs it most!
        </p>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6 text-left text-sm text-orange-800 space-y-1">
          <p className="font-black mb-1">How to play:</p>
          <p>1️⃣ A skill card appears on the left</p>
          <p>2️⃣ Drag it to the matching career box</p>
          <p>3️⃣ +{POINTS_PER_CORRECT} points for each correct match!</p>
          <p>⏱️ You have {GAME_DURATION} seconds — be quick!</p>
        </div>
        <button
          onClick={startGame}
          className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-black rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Start Sorting! 🎯
        </button>
        <div className="mt-4">
          <Link to="/occupational-wellbeing" className="text-orange-400 hover:text-orange-600 font-semibold text-sm">← Back</Link>
        </div>
      </div>
    </div>
  );

  /* ── FINISHED ── */
  if (phase === "finished") {
    const correct = results.filter(r => r.correct).length;
    const total = results.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return (
      <div className="min-h-screen py-8 px-4" style={bgStyle}>
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-8 text-center">
            <div className="text-6xl mb-3 animate-bounce">{pct >= 80 ? "🏆" : pct >= 50 ? "🌟" : "💪"}</div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">
              {pct >= 80 ? "Excellent!" : pct >= 50 ? "Good job!" : "Keep practising!"}
            </h2>
            <div className="flex justify-center gap-6 mb-4">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl px-6 py-3">
                <div className="text-3xl font-black text-orange-600">{score}</div>
                <div className="text-sm text-orange-800 font-bold">Points</div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-6 py-3">
                <div className="text-3xl font-black text-green-600">{correct}/{total}</div>
                <div className="text-sm text-green-800 font-bold">Correct</div>
              </div>
            </div>
          </div>

          {/* Result breakdown */}
          <div className="space-y-2">
            {results.map((r, i) => {
              const placed = CAREERS.find(c => c.id === r.careerId)!;
              const correct = CAREERS.find(c => c.id === r.skill.correctCareer)!;
              return (
                <div key={i} className="bg-white/90 rounded-2xl px-5 py-3 flex items-center gap-3 shadow">
                  <span className="text-2xl">{r.skill.emoji}</span>
                  <span className="font-bold text-gray-800 flex-1">{r.skill.name}</span>
                  <span className="text-xl">{placed.emoji}</span>
                  <span className="font-semibold text-sm" style={{ color: r.correct ? "#16a34a" : "#dc2626" }}>
                    {r.correct ? `✅ +${POINTS_PER_CORRECT}` : `❌ → ${correct.title}`}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center pb-4">
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              Try Again 🔄
            </button>
            <Link
              to="/occupational-wellbeing"
              className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform inline-block"
            >
              ← Back
            </Link>
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
        <Link to="/occupational-wellbeing" className="text-white/70 hover:text-white font-semibold text-sm">← Exit</Link>
        <span className="text-white font-black text-lg">🔧 Skills & Jobs</span>
        <span className="text-yellow-300 font-black text-lg">⭐ {score}</span>
      </div>

      {/* Timer bar */}
      <div className="h-2 bg-white/20 flex-shrink-0">
        <div className="h-full transition-all duration-1000" style={{ width: `${timerPct}%`, background: timerColor }} />
      </div>
      <div className="flex justify-between items-center px-6 py-1 flex-shrink-0">
        <span className="font-black text-base" style={{ color: timeLeft <= 10 ? "#fca5a5" : "white" }}>
          ⏱️ {timeLeft}s
        </span>
        <span className="text-white/70 text-sm font-semibold">
          {currentIdx + 1} / {SKILLS.length}
        </span>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div
            className="text-3xl font-black px-10 py-5 rounded-3xl shadow-2xl animate-bounce"
            style={{ background: feedback.correct ? "#22c55e" : "#ef4444", color: "white" }}
          >
            {feedback.correct ? `✅ Correct! +${POINTS_PER_CORRECT}` : "❌ Not quite!"}
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="flex-1 flex gap-6 px-6 pb-6 pt-2" style={{ minHeight: 0 }}>

        {/* LEFT — skill card */}
        <div className="flex flex-col items-center justify-center gap-6" style={{ width: "25%", flexShrink: 0 }}>
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest text-center">Drag this →</p>

          {currentSkill && (
            <div
              draggable={!feedback}
              onDragStart={e => { e.dataTransfer.setData("skillId", currentSkill.id); }}
              className="bg-white/95 rounded-3xl shadow-2xl border-4 border-white/60 p-8 text-center select-none transition-all duration-200 w-full"
              style={{
                cursor: feedback ? "default" : "grab",
                opacity: feedback ? 0.4 : 1,
                transform: feedback ? "scale(0.95)" : "scale(1)",
              }}
            >
              <div className="text-7xl mb-4">{currentSkill.emoji}</div>
              <div className="font-black text-xl text-gray-800 leading-tight">{currentSkill.name}</div>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex flex-wrap gap-2 justify-center" style={{ maxWidth: 160 }}>
            {SKILLS.map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full transition-all duration-300"
                style={{
                  background: i < currentIdx
                    ? "#22c55e"
                    : i === currentIdx
                    ? "white"
                    : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — career drop zones */}
        <div className="flex-1 grid grid-cols-2 gap-4" style={{ minHeight: 0 }}>
          {CAREERS.map(career => {
            const isOver = dragOver === career.id;
            return (
              <div
                key={career.id}
                onDragOver={e => { e.preventDefault(); setDragOver(career.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => {
                  e.preventDefault();
                  setDragOver(null);
                  if (!currentSkill) return;
                  handleDrop(career.id, currentSkill);
                }}
                className="rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-150"
                style={{
                  background: isOver ? career.bg : "rgba(255,255,255,0.12)",
                  border: `4px solid ${isOver ? career.color : "rgba(255,255,255,0.25)"}`,
                  boxShadow: isOver ? `0 0 32px ${career.color}99` : "0 3px 12px rgba(0,0,0,0.15)",
                  transform: isOver ? "scale(1.04)" : "scale(1)",
                }}
              >
                <div className="text-7xl">{career.emoji}</div>
                <div
                  className="font-black text-2xl"
                  style={{ color: isOver ? career.color : "white" }}
                >
                  {career.title}
                </div>
                {isOver && (
                  <div className="text-sm font-bold" style={{ color: career.color }}>
                    Drop here!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
