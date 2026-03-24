import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../../components";
import { useGameUser } from "../../../../../context/GameUserContext";
import { generateSessionId } from "../../../../../lib/sessionId";

const GAME_ID = "job-path-maze";
const LIVES = 3;
const SECONDS_PER_JOB = 60;

/* ── Speech helper ─────────────────────────────────────────────────────── */
function speak(text: string, muted: boolean) {
  if (muted || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate  = 0.92;
  utt.pitch = 1.05;
  utt.volume = 1;
  // prefer a friendly English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("samantha"))
    ?? voices.find(v => v.lang.startsWith("en") && !v.name.toLowerCase().includes("compact"))
    ?? voices.find(v => v.lang.startsWith("en"))
    ?? null;
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}

interface Checkpoint {
  question: string;
  options: string[];
  correct: number; // index of correct option
  explanation: string;
}

interface Job {
  title: string;
  emoji: string;
  color: string;
  accent: string;
  fact: string;
  checkpoints: Checkpoint[];
}

const ALL_JOBS: Job[] = [
  {
    title: "Doctor",
    emoji: "👨‍⚕️",
    color: "#dc2626",
    accent: "#fef2f2",
    fact: "Doctors can work in hospitals, clinics, or even on rescue helicopters!",
    checkpoints: [
      { question: "Which subject helps a doctor the most?", options: ["🎨 Art", "🔬 Science", "🎵 Music"], correct: 1, explanation: "Science helps doctors understand how the body works!" },
      { question: "A patient is scared. What should a doctor do?", options: ["Ignore them", "Speak kindly and explain", "Walk away"], correct: 1, explanation: "Doctors need empathy to help patients feel safe." },
      { question: "What does a doctor use to listen to your heartbeat?", options: ["🔭 Telescope", "🩺 Stethoscope", "📏 Ruler"], correct: 1, explanation: "A stethoscope amplifies sounds inside your body!" },
      { question: "Which skill makes a great doctor?", options: ["Swimming", "Caring for others", "Singing"], correct: 1, explanation: "Caring for people is the heart of being a doctor." },
    ],
  },
  {
    title: "Chef",
    emoji: "👨‍🍳",
    color: "#d97706",
    accent: "#fffbeb",
    fact: "Chefs can work in restaurants, hotels, cruise ships, or even the White House!",
    checkpoints: [
      { question: "What does a chef need most?", options: ["🎨 Drawing", "🍳 Cooking skills", "🔧 Fixing engines"], correct: 1, explanation: "Cooking skills are the foundation of being a great chef!" },
      { question: "A dish tastes too salty. What do you do?", options: ["Add more salt", "Taste and adjust", "Throw it away"], correct: 1, explanation: "Good chefs taste and adjust to make food just right." },
      { question: "Which skill makes a great chef?", options: ["Creativity", "Swimming", "Video gaming"], correct: 0, explanation: "Creativity helps chefs invent new and delicious recipes!" },
      { question: "Where does a chef mostly work?", options: ["Hospital", "Kitchen", "Playground"], correct: 1, explanation: "The kitchen is a chef's workplace and creative space!" },
    ],
  },
  {
    title: "Teacher",
    emoji: "👩‍🏫",
    color: "#2563eb",
    accent: "#eff6ff",
    fact: "Teachers shape the future — every doctor, engineer, and artist once had a great teacher!",
    checkpoints: [
      { question: "What is the most important skill for a teacher?", options: ["Patience", "Running fast", "Cooking"], correct: 0, explanation: "Patience helps teachers support every student's learning pace." },
      { question: "A student doesn't understand. What should a teacher do?", options: ["Move on quickly", "Explain it differently", "Give them less work"], correct: 1, explanation: "Great teachers find new ways to explain until everyone gets it!" },
      { question: "Which tool does a teacher use most?", options: ["🔨 Hammer", "📚 Books & lessons", "🚗 Car"], correct: 1, explanation: "Books and lessons are a teacher's main tools for sharing knowledge." },
      { question: "Where does a teacher work?", options: ["Farm", "Classroom", "Ocean"], correct: 1, explanation: "Classrooms are where teachers inspire the next generation!" },
    ],
  },
  {
    title: "Engineer",
    emoji: "👷",
    color: "#16a34a",
    accent: "#f0fdf4",
    fact: "Engineers built bridges, rockets, smartphones, and the internet — they solve the world's problems!",
    checkpoints: [
      { question: "Which subject is most useful for an engineer?", options: ["🎭 Drama", "📐 Math & Science", "🎨 Painting"], correct: 1, explanation: "Math and science are the building blocks of engineering!" },
      { question: "A bridge design has a problem. What does an engineer do?", options: ["Give up", "Solve and redesign", "Ignore it"], correct: 1, explanation: "Engineers are problem solvers — they keep improving until it's right." },
      { question: "What skill helps engineers most?", options: ["Dancing", "Critical thinking", "Cooking"], correct: 1, explanation: "Critical thinking helps engineers find the best solutions." },
      { question: "Which tool do engineers often use?", options: ["🖥️ Computer & blueprints", "🎸 Guitar", "🌸 Flowers"], correct: 0, explanation: "Computers and blueprints help engineers design and plan structures." },
    ],
  },
  {
    title: "Artist",
    emoji: "🎨",
    color: "#7c3aed",
    accent: "#faf5ff",
    fact: "Artists work in movies, video games, fashion, architecture, advertising — art is everywhere!",
    checkpoints: [
      { question: "What does an artist need most?", options: ["Creativity", "Strength", "Speed"], correct: 0, explanation: "Creativity is the fuel that powers all great artwork!" },
      { question: "An artwork doesn't look right. What should an artist do?", options: ["Quit", "Keep practising and improving", "Copy someone else"], correct: 1, explanation: "Great artists grow by practising and learning from mistakes." },
      { question: "Which skill helps an artist succeed?", options: ["Attention to detail", "Loud voice", "Cooking"], correct: 0, explanation: "Noticing small details helps artists create beautiful, precise work." },
      { question: "Where can an artist show their work?", options: ["🏥 Hospital only", "🖼️ Gallery, internet, anywhere!", "🏖️ Only at the beach"], correct: 1, explanation: "Artists can share their work with the whole world!" },
    ],
  },
  {
    title: "Pilot",
    emoji: "✈️",
    color: "#0284c7",
    accent: "#f0f9ff",
    fact: "Pilots can fly to over 100 different countries and see the world from above the clouds!",
    checkpoints: [
      { question: "Which skill is most important for a pilot?", options: ["Staying calm under pressure", "Singing", "Drawing"], correct: 0, explanation: "Staying calm helps pilots make safe decisions in any situation." },
      { question: "There is bad weather ahead. What should a pilot do?", options: ["Fly through it fast", "Check instruments and take a safe route", "Land immediately anywhere"], correct: 1, explanation: "Pilots use instruments and training to navigate safely." },
      { question: "What does a pilot use to navigate?", options: ["🗺️ Paper map only", "🖥️ Instruments & GPS", "🔮 Magic"], correct: 1, explanation: "Modern pilots use advanced instruments and GPS to fly safely." },
      { question: "Which subject helps a future pilot?", options: ["Math & physics", "Cooking", "Poetry"], correct: 0, explanation: "Math and physics help pilots understand speed, altitude, and navigation." },
    ],
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GamePhase = "menu" | "playing" | "job_complete" | "finished";
type AnswerState = "idle" | "correct" | "wrong";

export function JobPathMaze(): React.JSX.Element {
  const [phase,          setPhase]          = useState<GamePhase>("menu");
  const [jobs,           setJobs]           = useState<Job[]>([]);
  const [jobIndex,       setJobIndex]       = useState(0);
  const [checkpoint,     setCheckpoint]     = useState(0);
  const [lives,          setLives]          = useState(LIVES);
  const [timeLeft,       setTimeLeft]       = useState(SECONDS_PER_JOB);
  const [answerState,    setAnswerState]    = useState<AnswerState>("idle");
  const [chosenOption,   setChosenOption]   = useState<number | null>(null);
  const [totalScore,     setTotalScore]     = useState(0);
  const [characterPos,   setCharacterPos]   = useState(0); // 0–100 %
  const [shaking,        setShaking]        = useState(false);
  const [muted,          setMuted]          = useState(false);

  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef  = useRef("");
  const mutedRef      = useRef(false);
  const scoreRef      = useRef(0);   // always current, safe inside closures
  const timeLeftRef   = useRef(SECONDS_PER_JOB);
  const { trackEvent } = useGameUser();

  useEffect(() => { scoreRef.current   = totalScore; }, [totalScore]);
  useEffect(() => { timeLeftRef.current = timeLeft;  }, [timeLeft]);

  // keep mutedRef in sync so speak() always has latest value
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  // auto-speak question whenever checkpoint or job changes
  useEffect(() => {
    if (phase !== "playing" || !jobs[jobIndex]) return;
    const cp = jobs[jobIndex].checkpoints[checkpoint];
    const job = jobs[jobIndex];
    const optionsText = cp.options.map((o, i) => `Option ${String.fromCharCode(65 + i)}: ${o.replace(/[^\w\s&',.-]/g, "")}`).join(". ");
    const text = `${cp.question}. ${optionsText}`;
    const id = setTimeout(() => speak(text, mutedRef.current), 400);
    return () => clearTimeout(id);
  }, [phase, jobIndex, checkpoint, jobs]);

  // speak job-complete announcement
  useEffect(() => {
    if (phase !== "job_complete" || !jobs[jobIndex]) return;
    const job = jobs[jobIndex];
    const id = setTimeout(() => speak(`Amazing! You reached your dream job as a ${job.title}! ${job.fact}`, mutedRef.current), 300);
    return () => clearTimeout(id);
  }, [phase, jobIndex, jobs]);

  // cancel speech on unmount
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  const currentJob   = jobs[jobIndex];
  const totalJobs    = jobs.length;
  const checkpointCount = currentJob?.checkpoints.length ?? 4;

  /* ── timer ── */
  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    if (phase !== "playing" || answerState !== "idle") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopTimer();
          // time's up → lose a life, stay on same checkpoint
          setLives(l => {
            const next = l - 1;
            if (next <= 0) {
              setPhase("finished");
              trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current, timeRemaining: 0 });
            }
            return Math.max(next, 0);
          });
          setTimeLeft(SECONDS_PER_JOB);
          return SECONDS_PER_JOB;
        }
        return t - 1;
      });
    }, 1000);
    return stopTimer;
  }, [phase, answerState, stopTimer]);

  function startGame() {
    const picked = shuffleArray(ALL_JOBS).slice(0, 3);
    setJobs(picked);
    setJobIndex(0);
    setCheckpoint(0);
    setLives(LIVES);
    setTimeLeft(SECONDS_PER_JOB);
    setTotalScore(0);
    setCharacterPos(0);
    setAnswerState("idle");
    setChosenOption(null);
    sessionIdRef.current = generateSessionId();
    setPhase("playing");
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  }

  function handleAnswer(optionIdx: number) {
    if (answerState !== "idle") return;
    stopTimer();
    setChosenOption(optionIdx);
    const cp = currentJob.checkpoints[checkpoint];
    const correct = optionIdx === cp.correct;

    if (correct) {
      setAnswerState("correct");
      setTotalScore(s => s + 1);
      const nextPos = ((checkpoint + 1) / checkpointCount) * 100;
      setCharacterPos(nextPos);

      setTimeout(() => {
        setAnswerState("idle");
        setChosenOption(null);
        const nextCp = checkpoint + 1;
        if (nextCp >= checkpointCount) {
          // Job completed!
          setPhase("job_complete");
        } else {
          setCheckpoint(nextCp);
          setTimeLeft(SECONDS_PER_JOB);
        }
      }, 1800);
    } else {
      setAnswerState("wrong");
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      const nextLives = lives - 1;
      setLives(nextLives);

      setTimeout(() => {
        setAnswerState("idle");
        setChosenOption(null);
        if (nextLives <= 0) {
          setPhase("finished");
          trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current, timeRemaining: timeLeftRef.current });
        } else {
          setTimeLeft(SECONDS_PER_JOB);
        }
      }, 1800);
    }
  }

  function nextJob() {
    const next = jobIndex + 1;
    if (next >= totalJobs) {
      setPhase("finished");
      trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: scoreRef.current, timeRemaining: timeLeftRef.current });
    } else {
      setJobIndex(next);
      setCheckpoint(0);
      setCharacterPos(0);
      setTimeLeft(SECONDS_PER_JOB);
      setAnswerState("idle");
      setChosenOption(null);
      setPhase("playing");
    }
  }

  const bgStyle = { background: "linear-gradient(135deg, #f97316 0%, #ea580c 30%, #c2410c 70%, #9a3412 100%)" };
  const timerColor = timeLeft > 30 ? "#22c55e" : timeLeft > 10 ? "#f59e0b" : "#ef4444";
  const progressPct = totalJobs > 0 ? ((jobIndex + (phase === "finished" ? 1 : 0)) / totalJobs) * 100 : 0;

  /* ── MENU ── */
  if (phase === "menu") return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={bgStyle}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-orange-300 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-7xl mb-3">🗺️</div>
        <h1 className="text-4xl font-black text-orange-800 mb-2">Job Path Maze</h1>
        <p className="text-gray-600 text-lg mb-5 leading-relaxed">
          Navigate your character to their <strong>Dream Job</strong> by answering the right questions at each checkpoint!
        </p>
        <div className="grid grid-cols-3 gap-3 mb-6 text-sm">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-3 text-orange-800 text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="font-bold">3 Jobs</div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 text-red-800 text-center">
            <div className="text-2xl mb-1">❤️</div>
            <div className="font-bold">3 Lives</div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-blue-800 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="font-bold">60s / Step</div>
          </div>
        </div>
        <button onClick={startGame} className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-black rounded-full shadow-lg hover:scale-105 transition-transform">
          Start Journey! 🚀
        </button>
        <div className="mt-4">
          <Link to="/occupational-wellbeing" className="text-orange-400 hover:text-orange-600 font-semibold text-sm">← Back</Link>
        </div>
      </div>
    </div>
  );

  /* ── JOB COMPLETE ── */
  if (phase === "job_complete" && currentJob) return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={bgStyle}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-10 max-w-lg w-full text-center">
        <div className="text-7xl mb-3 animate-bounce">🏆</div>
        <h2 className="text-3xl font-black text-orange-800 mb-2">You made it!</h2>
        <div className="text-6xl mb-2">{currentJob.emoji}</div>
        <h3 className="text-2xl font-black mb-4" style={{ color: currentJob.color }}>{currentJob.title}</h3>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6 text-left">
          <p className="text-sm font-bold text-orange-700 mb-1">🌟 Fun Fact:</p>
          <p className="text-gray-700 text-base leading-relaxed">{currentJob.fact}</p>
        </div>
        {jobIndex + 1 < totalJobs ? (
          <>
            <p className="text-gray-500 mb-4">Next up: <strong>{jobs[jobIndex + 1]?.title}</strong> {jobs[jobIndex + 1]?.emoji}</p>
            <button onClick={nextJob} className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xl font-black rounded-full shadow-lg hover:scale-105 transition-transform">
              Next Job! →
            </button>
          </>
        ) : (
          <button onClick={nextJob} className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-black rounded-full shadow-lg hover:scale-105 transition-transform">
            See Final Score! 🏁
          </button>
        )}
      </div>
    </div>
  );

  /* ── FINISHED ── */
  if (phase === "finished") {
    const maxScore = totalJobs * checkpointCount;
    const pct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    return (
      <div className="min-h-screen flex items-center justify-center py-8 px-4" style={bgStyle}>
        <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-10 max-w-lg w-full text-center">
          <div className="text-6xl mb-3">{pct >= 80 ? "🏆" : pct >= 50 ? "🌟" : "💪"}</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Journey Complete!</h2>
          <div className="inline-block bg-orange-100 border-2 border-orange-300 rounded-xl px-6 py-3 mb-4">
            <div className="text-orange-800 font-black text-2xl">{totalScore} / {totalJobs * 4} correct</div>
            <div className="text-orange-600 text-sm font-semibold">{pct}% accuracy</div>
          </div>
          <div className="flex gap-4 justify-center mb-4">
            {Array.from({ length: LIVES }).map((_, i) => (
              <span key={i} className="text-3xl">{i < lives ? "❤️" : "🖤"}</span>
            ))}
          </div>
          <p className="text-gray-500 mb-6">
            {pct >= 80 ? "Amazing! You're ready for any career!" : pct >= 50 ? "Great effort! Keep exploring careers!" : "Keep learning — every expert started somewhere!"}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-lg rounded-full shadow-lg hover:scale-105 transition-transform">
              Play Again 🔄
            </button>
            <Link to="/occupational-wellbeing" className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white font-bold text-lg rounded-full shadow-lg hover:scale-105 transition-transform inline-block">
              ← Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── PLAYING ── */
  if (!currentJob) return <></>;
  const cp = currentJob.checkpoints[checkpoint];
  const pathProgress = (checkpoint / checkpointCount) * 100;

  return (
    <div className="min-h-screen flex flex-col" style={bgStyle}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2">
          {Array.from({ length: LIVES }).map((_, i) => (
            <span key={i} className={`text-2xl transition-all duration-300 ${i < lives ? "" : "opacity-20 grayscale"}`}>❤️</span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/80 text-sm font-semibold">Job {jobIndex + 1} / {totalJobs}</span>
          <div className="font-black text-xl px-4 py-1 rounded-xl border-2" style={{ color: timerColor, borderColor: timerColor, background: "rgba(0,0,0,0.3)" }}>
            ⏱️ {timeLeft}s
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 rounded-xl px-3 py-1 text-white font-bold text-sm">
            ✅ {totalScore} pts
          </div>
          <button
            onClick={() => { setMuted(m => !m); if (!muted) window.speechSynthesis?.cancel(); }}
            className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-lg transition-all"
            title={muted ? "Unmute voice" : "Mute voice"}
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Overall job progress */}
      <div className="flex gap-2 px-6 py-2 flex-shrink-0">
        {jobs.map((j, i) => (
          <div key={i} className="flex-1 h-2 rounded-full overflow-hidden bg-white/20">
            <div className="h-full bg-yellow-400 transition-all duration-500" style={{ width: i < jobIndex ? "100%" : i === jobIndex ? `${pathProgress}%` : "0%" }} />
          </div>
        ))}
      </div>

      <div className="flex-1 flex gap-4 px-4 pb-4" style={{ minHeight: 0 }}>

        {/* LEFT: Path visualization */}
        <div className="flex flex-col items-center justify-between py-4" style={{ width: 120, flexShrink: 0 }}>
          {/* Dream job at top */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border-4 border-yellow-300"
              style={{ background: currentJob.accent, fontSize: 32 }}>
              {currentJob.emoji}
            </div>
            <span className="text-white text-xs font-black mt-1 text-center leading-tight">{currentJob.title}</span>
          </div>

          {/* Path with checkpoints */}
          <div className="flex-1 flex flex-col items-center justify-around my-3 relative w-full">
            {/* Vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
            {/* Progress fill */}
            <div className="absolute left-1/2 bottom-0 w-1 -translate-x-1/2 rounded-full bg-yellow-400 transition-all duration-700"
              style={{ height: `${characterPos}%` }} />

            {/* Checkpoint dots */}
            {currentJob.checkpoints.map((_, i) => {
              const passed = i < checkpoint;
              const current = i === checkpoint;
              return (
                <div key={i} className="relative z-10 w-8 h-8 rounded-full border-3 flex items-center justify-center text-xs font-black shadow-lg transition-all duration-300"
                  style={{
                    background: passed ? "#22c55e" : current ? "#fbbf24" : "rgba(255,255,255,0.3)",
                    border: `3px solid ${passed ? "#16a34a" : current ? "#f59e0b" : "rgba(255,255,255,0.5)"}`,
                    transform: current ? "scale(1.3)" : "scale(1)",
                    color: passed || current ? "white" : "rgba(255,255,255,0.6)",
                  }}>
                  {passed ? "✓" : i + 1}
                </div>
              );
            })}
          </div>

          {/* Character at bottom */}
          <div className={`flex flex-col items-center transition-all duration-700 ${shaking ? "animate-shake" : ""}`}
            style={{ transform: `translateY(-${characterPos * 1.5}px)` }}>
            <div className="text-4xl">🧒</div>
            <span className="text-white text-xs font-bold">You!</span>
          </div>
        </div>

        {/* RIGHT: Question area */}
        <div className="flex-1 flex flex-col gap-4" style={{ minWidth: 0 }}>

          {/* Job banner */}
          <div className="rounded-2xl px-5 py-3 flex items-center gap-3 flex-shrink-0"
            style={{ background: currentJob.accent, border: `3px solid ${currentJob.color}` }}>
            <span className="text-4xl">{currentJob.emoji}</span>
            <div>
              <div className="font-black text-lg" style={{ color: currentJob.color }}>Dream Job: {currentJob.title}</div>
              <div className="text-sm text-gray-500">Checkpoint {checkpoint + 1} of {checkpointCount}</div>
            </div>
            <div className="ml-auto flex gap-1">
              {currentJob.checkpoints.map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ background: i < checkpoint ? "#22c55e" : i === checkpoint ? currentJob.color : "#d1d5db" }} />
              ))}
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-white/50 p-6 flex-shrink-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wide mb-2">Question {checkpoint + 1}</p>
                <p className="text-xl font-black text-gray-800 leading-snug">{cp.question}</p>
              </div>
              <button
                onClick={() => speak(cp.question, false)}
                className="w-10 h-10 rounded-xl bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 flex items-center justify-center text-xl flex-shrink-0 transition-all hover:scale-110"
                title="Replay question"
              >
                🔊
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-col gap-3 flex-1">
            {cp.options.map((opt, i) => {
              const isChosen  = chosenOption === i;
              const isCorrect = i === cp.correct;
              let bg = "rgba(255,255,255,0.88)";
              let border = "rgba(255,255,255,0.4)";
              let textColor = "#1f2937";
              if (answerState === "correct" && isChosen) { bg = "rgba(34,197,94,0.2)"; border = "#22c55e"; textColor = "#15803d"; }
              if (answerState === "wrong" && isChosen)   { bg = "rgba(239,68,68,0.2)"; border = "#ef4444"; textColor = "#b91c1c"; }
              if (answerState === "wrong" && isCorrect)  { bg = "rgba(34,197,94,0.15)"; border = "#22c55e"; textColor = "#15803d"; }

              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={answerState !== "idle"}
                  className="flex-1 flex items-center gap-5 rounded-2xl text-left transition-all duration-150 disabled:cursor-default"
                  style={{
                    padding: "20px 24px",
                    background: bg,
                    border: `3px solid ${border}`,
                    color: textColor,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                  onMouseEnter={e => { if (answerState === "idle") (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
                >
                  <span className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                    style={{ background: border === "rgba(255,255,255,0.4)" ? "#f3f4f6" : border, color: border === "rgba(255,255,255,0.4)" ? "#374151" : "white" }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="font-extrabold text-xl leading-snug">{opt}</span>
                  {answerState !== "idle" && isChosen && (
                    <span className="ml-auto text-3xl">{answerState === "correct" ? "✅" : "❌"}</span>
                  )}
                  {answerState === "wrong" && isCorrect && (
                    <span className="ml-auto text-3xl">✅</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation toast */}
          {answerState !== "idle" && (
            <div className="rounded-2xl px-5 py-3 flex-shrink-0"
              style={{ background: answerState === "correct" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.15)", border: `2px solid ${answerState === "correct" ? "#22c55e" : "#ef4444"}` }}>
              <p className="font-bold text-sm" style={{ color: answerState === "correct" ? "#15803d" : "#b91c1c" }}>
                {answerState === "correct" ? "✅ Correct! " : "❌ Not quite! "}
                <span className="font-normal text-gray-700">{cp.explanation}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
