import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../../components";
import { useGameUser } from "../../../../../context/GameUserContext";
import { shuffleArray } from "../../../../../lib/arrayUtils";
import { generateSessionId } from "../../../../../lib/sessionId";

const GAME_ID = "study-habits-game";
const GAME_TIME_SECONDS = 90;
const HINT_DELAY_MS = 5000;

interface StudyHabit { name: string; emoji: string; category: "good" | "bad"; }

const ALL_HABITS: StudyHabit[] = [
  { name: "Set a study schedule",        emoji: "📅", category: "good" },
  { name: "Keep a clean desk",           emoji: "🗂️", category: "good" },
  { name: "Drink water while studying",  emoji: "💧", category: "good" },
  { name: "Take short breaks",           emoji: "☕", category: "good" },
  { name: "Write notes by hand",         emoji: "✍️", category: "good" },
  { name: "Study in bright light",       emoji: "💡", category: "good" },
  { name: "Get 8 hours of sleep",        emoji: "😴", category: "good" },
  { name: "Study in a quiet room",       emoji: "🤫", category: "good" },
  { name: "Use flashcards to review",    emoji: "🃏", category: "good" },
  { name: "Turn off notifications",      emoji: "🔕", category: "good" },
  { name: "Review notes after class",    emoji: "📖", category: "good" },
  { name: "Set a study timer",           emoji: "⏱️", category: "good" },
  { name: "Watch TV while studying",     emoji: "📺", category: "bad"  },
  { name: "Use phone while studying",    emoji: "📱", category: "bad"  },
  { name: "Study with a messy desk",     emoji: "🗑️", category: "bad"  },
  { name: "Stay up all night",           emoji: "🌙", category: "bad"  },
  { name: "Skip all breaks",             emoji: "😵", category: "bad"  },
  { name: "Study in the dark",           emoji: "🌑", category: "bad"  },
  { name: "Eat junk food while studying",emoji: "🍕", category: "bad"  },
  { name: "Chat with friends instead",   emoji: "💬", category: "bad"  },
  { name: "Leave things to last minute", emoji: "⏰", category: "bad"  },
  { name: "Listen to loud music",        emoji: "🎵", category: "bad"  },
  { name: "Jump between subjects",       emoji: "🔄", category: "bad"  },
  { name: "Skip reviewing homework",     emoji: "📚", category: "bad"  },
];

function pick6() {
  return shuffleArray([
    ...shuffleArray(ALL_HABITS.filter(h => h.category === "good")).slice(0, 3),
    ...shuffleArray(ALL_HABITS.filter(h => h.category === "bad")).slice(0, 3),
  ]);
}

type GamePhase = "menu" | "playing" | "finished";
interface Pt { x: number; y: number; }

export function StudyHabitsGame(): React.JSX.Element {
  const location = useLocation();
  const backTo = new URLSearchParams(location.search).get("from") === "3dw-set1"
    ? "/3d-wellness/set-1"
    : "/intellectual-wellbeing";
  const [phase,       setPhase]       = useState<GamePhase>("menu");
  const [habits,      setHabits]      = useState<StudyHabit[]>([]);
  const [connections, setConnections] = useState<Record<number, "good" | "bad">>({});
  const [submitted,   setSubmitted]   = useState(false);
  const [timeLeft,    setTimeLeft]    = useState(GAME_TIME_SECONDS);
  const [dragFrom,    setDragFrom]    = useState<number | null>(null);
  const [mousePos,    setMousePos]    = useState<Pt | null>(null);
  const [hintOn,      setHintOn]      = useState(false);
  const [hoveredRight, setHoveredRight] = useState<"good" | "bad" | null>(null);
  const [, forceRedraw]               = useState(0);

  const containerRef  = useRef<HTMLDivElement>(null);
  const leftRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const goodRef       = useRef<HTMLDivElement>(null);
  const badRef        = useRef<HTMLDivElement>(null);
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionIdRef  = useRef("");
  const habitsRef     = useRef<StudyHabit[]>([]);
  const connectionsRef= useRef<Record<number, "good" | "bad">>({});

  const { trackEvent } = useGameUser();
  useEffect(() => { habitsRef.current = habits; }, [habits]);
  useEffect(() => { connectionsRef.current = connections; }, [connections]);

  const resetHintTimer = () => {
    setHintOn(false);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setHintOn(true), HINT_DELAY_MS);
  };

  const endGame = useCallback((conns: Record<number, "good" | "bad">, timeUsed: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setSubmitted(true);
    setPhase("finished");
    const correct = Object.entries(conns).filter(([i, v]) => habitsRef.current[+i]?.category === v).length;
    trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score: correct, timeRemaining: timeUsed });
  }, [trackEvent]);

  // timer
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current!); return 0; } return t - 1; }), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && timeLeft === 0) endGame(connectionsRef.current, 0);
  }, [timeLeft, phase, endGame]);

  // redraw arrows on resize
  useEffect(() => {
    const h = () => forceRedraw(n => n + 1);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    if (phase === "playing") { setTimeout(() => forceRedraw(n => n + 1), 60); resetHintTimer(); }
  }, [phase]);

  const startGame = () => {
    const picked = pick6();
    setHabits(picked); habitsRef.current = picked;
    setConnections({}); connectionsRef.current = {};
    setSubmitted(false); setDragFrom(null); setMousePos(null); setHintOn(false);
    setTimeLeft(GAME_TIME_SECONDS);
    leftRefs.current = Array(6).fill(null);
    sessionIdRef.current = generateSessionId();
    setPhase("playing");
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  };

  /* ── coordinate helpers ── */
  function relPt(el: HTMLElement): Pt {
    const cr = containerRef.current!.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return { x: er.right - cr.left, y: er.top + er.height / 2 - cr.top };
  }
  function relLeft(el: HTMLElement): Pt {
    const cr = containerRef.current!.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    return { x: er.left - cr.left, y: er.top + er.height / 2 - cr.top };
  }
  function getNearestUnconnected(mx: number, my: number): { idx: number; pt: Pt } | null {
    if (!containerRef.current) return null;
    let best: { idx: number; pt: Pt } | null = null;
    let minD = Infinity;
    leftRefs.current.forEach((el, i) => {
      if (!el || connections[i] !== undefined) return;
      const pt = relPt(el);
      const d  = Math.hypot(pt.x - mx, pt.y - my);
      if (d < minD) { minD = d; best = { idx: i, pt }; }
    });
    return best && minD < 260 ? best : null;
  }

  /* ── mouse handlers on game area ── */
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || submitted) return;
    resetHintTimer();
    const cr = containerRef.current.getBoundingClientRect();
    const mp = { x: e.clientX - cr.left, y: e.clientY - cr.top };
    setMousePos(mp);
    // detect hover over right boxes for highlight
    if (dragFrom !== null) {
      const gr = goodRef.current?.getBoundingClientRect();
      const br = badRef.current?.getBoundingClientRect();
      if (gr && e.clientX >= gr.left && e.clientX <= gr.right && e.clientY >= gr.top && e.clientY <= gr.bottom) setHoveredRight("good");
      else if (br && e.clientX >= br.left && e.clientX <= br.right && e.clientY >= br.top && e.clientY <= br.bottom) setHoveredRight("bad");
      else setHoveredRight(null);
    }
  };
  const onMouseLeave = () => { setMousePos(null); setDragFrom(null); setHoveredRight(null); };
  const onMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragFrom === null || submitted) return;
    const gr = goodRef.current?.getBoundingClientRect();
    const br = badRef.current?.getBoundingClientRect();
    let target: "good" | "bad" | null = null;
    if (gr && e.clientX >= gr.left && e.clientX <= gr.right && e.clientY >= gr.top && e.clientY <= gr.bottom) target = "good";
    if (br && e.clientX >= br.left && e.clientX <= br.right && e.clientY >= br.top && e.clientY <= br.bottom) target = "bad";
    if (target !== null) {
      const newConns = { ...connectionsRef.current, [dragFrom]: target };
      setConnections(newConns); connectionsRef.current = newConns;
      forceRedraw(n => n + 1);
      if (Object.keys(newConns).length === 6) setTimeout(() => endGame(newConns, timeLeft), 400);
    }
    setDragFrom(null); setHoveredRight(null);
  };

  /* ── arrow path helper ── */
  function curvePath(x1: number, y1: number, x2: number, y2: number) {
    const mx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  }

  /* ── live arrow (drag or hover-nearest) ── */
  function liveArrow() {
    if (!mousePos || !containerRef.current) return null;
    if (dragFrom !== null) {
      const el = leftRefs.current[dragFrom];
      if (!el) return null;
      const from = relPt(el);
      return { x1: from.x, y1: from.y, x2: mousePos.x, y2: mousePos.y, isDrag: true };
    }
    // hover: only in left 55%
    const cw = containerRef.current.offsetWidth;
    if (mousePos.x > cw * 0.55) return null;
    const near = getNearestUnconnected(mousePos.x, mousePos.y);
    if (!near) return null;
    return { x1: near.pt.x, y1: near.pt.y, x2: mousePos.x, y2: mousePos.y, isDrag: false };
  }

  /* ── hint arrow ── */
  function hintArrow() {
    if (!hintOn || !containerRef.current) return null;
    const unconn = habits.findIndex((_, i) => connections[i] === undefined);
    if (unconn === -1) return null;
    const lEl = leftRefs.current[unconn]; const rEl = goodRef.current;
    if (!lEl || !rEl) return null;
    const from = relPt(lEl); const to = relLeft(rEl);
    return { x1: from.x, y1: from.y, x2: to.x - 10, y2: to.y };
  }

  const la   = liveArrow();
  const hint = hintArrow();
  const score = Object.entries(connections).filter(([i, v]) => habits[+i]?.category === v).length;
  const connectedCount = Object.keys(connections).length;
  const bgStyle = { background: "linear-gradient(135deg, #312e81 0%, #4338ca 30%, #6d28d9 70%, #7c3aed 100%)" };
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerColor = timeLeft > 30 ? "#22c55e" : timeLeft > 10 ? "#f59e0b" : "#ef4444";

  /* ── MENU ── */
  if (phase === "menu") return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={bgStyle}>
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-indigo-300 p-10 max-w-lg w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-6xl mb-3">📚</div>
        <h1 className="text-4xl font-black text-indigo-800 mb-2">Study Habits Sort</h1>
        <p className="text-gray-600 text-lg mb-5 leading-relaxed">
          Match each habit to <span className="font-bold text-green-600">Good Habit</span> or{" "}
          <span className="font-bold text-red-600">Bad Habit</span> by drawing a line!
        </p>
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 mb-6 text-left text-sm text-indigo-800 space-y-1">
          <p className="font-black mb-1">How to play:</p>
          <p>🖱️ Hover near a habit card — a line appears</p>
          <p>🤏 Click &amp; drag from a habit to Good or Bad</p>
          <p>✅ Match all 6 before time runs out!</p>
        </div>
        <button onClick={startGame} className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-2xl font-black rounded-full shadow-lg hover:scale-105 transition-transform">
          Let's Study! 📖
        </button>
        <div className="mt-4">
          <Link to={backTo} className="text-indigo-400 hover:text-indigo-600 font-semibold text-sm">← Back</Link>
        </div>
      </div>
    </div>
  );

  /* ── FINISHED ── */
  if (phase === "finished") {
    const pct = Math.round((score / habits.length) * 100);
    return (
      <div className="min-h-screen py-8 px-4" style={bgStyle}>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-8 text-center">
            <div className="text-5xl mb-3">{pct === 100 ? "🏆" : pct >= 70 ? "🌟" : "💪"}</div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Game Over!</h2>
            <div className="inline-block bg-indigo-100 border-2 border-indigo-300 rounded-xl px-6 py-2 mb-4">
              <span className="text-indigo-800 font-bold text-xl">Score: {score} / {habits.length}</span>
            </div>
            <p className="text-gray-500 mb-6">
              {pct === 100 ? "Perfect match! You're a study pro!" : pct >= 70 ? "Great job! Keep practising!" : "Keep learning — you'll get it!"}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={startGame} className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-black rounded-full shadow-lg hover:scale-105 transition-transform">Play Again 🔄</button>
              <Link to={backTo} className="px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform inline-block">← Back</Link>
            </div>
          </div>
          <div className="bg-white/90 rounded-3xl border-4 border-indigo-200 p-6 shadow-xl">
            <h3 className="text-xl font-black text-indigo-800 mb-4 text-center">Your Answers</h3>
            <div className="space-y-3">
              {habits.map((h, i) => {
                const answered = connections[i];
                const correct  = answered === h.category;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: correct ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `2px solid ${correct ? "#22c55e" : "#ef4444"}` }}>
                    <span className="text-2xl">{h.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-800 truncate">{h.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: correct ? "#166534" : "#991b1b" }}>
                        {answered ? (correct ? `✅ Correct — ${h.category === "good" ? "Good" : "Bad"} Habit` : `❌ You said ${answered === "good" ? "Good" : "Bad"}, it's a ${h.category === "good" ? "Good" : "Bad"} Habit`) : "❌ Not answered"}
                      </div>
                    </div>
                    <span className="text-xl flex-shrink-0">{correct ? "✅" : "❌"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── PLAYING ── */
  return (
    <div className="min-h-screen flex flex-col" style={bgStyle}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-sm flex-shrink-0">
        <Link to={backTo} className="text-white/70 hover:text-white font-semibold text-sm">← Exit</Link>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-900/60 border border-indigo-400 rounded-xl px-4 py-1.5 font-bold text-white text-sm">✅ {score} / {habits.length}</div>
          <div className="font-black text-2xl px-5 py-1.5 rounded-xl border-2" style={{ color: timerColor, borderColor: timerColor, background: "rgba(0,0,0,0.3)" }}>
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
        </div>
        <div className="text-white/70 text-sm font-semibold">{connectedCount} / 6 matched</div>
      </div>

      {/* Hint text */}
      <div className="text-center py-2 flex-shrink-0 h-8">
        {hintOn && !dragFrom && (
          <p className="text-white/60 text-xs animate-pulse">💡 Drag a line from a habit card on the left → to Good or Bad on the right</p>
        )}
        {dragFrom !== null && (
          <p className="text-yellow-300 text-xs font-bold animate-pulse">Release over Good Habit or Bad Habit →</p>
        )}
      </div>

      {/* Game canvas */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-stretch px-4 pb-4 gap-0"
        style={{ cursor: dragFrom !== null ? "grabbing" : "crosshair", userSelect: "none", minHeight: 0 }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
      >
        {/* SVG overlay */}
        <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%", overflow: "visible", zIndex: 30 }}>
          <defs>
            <style>{`@keyframes dashAnim { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }`}</style>
            <marker id="ah-dark"  markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#1e1b4b" /></marker>
            <marker id="ah-green" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#15803d" /></marker>
            <marker id="ah-red"   markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#b91c1c" /></marker>
            <marker id="ah-hint"  markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="rgba(255,255,255,0.5)" /></marker>
            <marker id="ah-hover" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="rgba(255,255,255,0.7)" /></marker>
          </defs>

          {/* Committed connections */}
          {Object.entries(connections).map(([idxStr, rt]) => {
            const idx = +idxStr;
            const lEl = leftRefs.current[idx];
            const rEl = rt === "good" ? goodRef.current : badRef.current;
            if (!lEl || !rEl || !containerRef.current) return null;
            const from = relPt(lEl); const to = relLeft(rEl);
            const correct = submitted ? habits[idx]?.category === rt : null;
            const color = submitted ? (correct ? "#15803d" : "#b91c1c") : "#1e1b4b";
            const mk = submitted ? (correct ? "ah-green" : "ah-red") : "ah-dark";
            return (
              <path key={idxStr} d={curvePath(from.x, from.y, to.x - 10, to.y)}
                fill="none" stroke={color} strokeWidth="2.5" markerEnd={`url(#${mk})`} />
            );
          })}

          {/* Live drag/hover line */}
          {la && (
            <line x1={la.x1} y1={la.y1} x2={la.x2} y2={la.y2}
              stroke={la.isDrag ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)"}
              strokeWidth={la.isDrag ? 2.5 : 1.8}
              strokeDasharray={la.isDrag ? "none" : "6 3"}
              markerEnd={`url(#${la.isDrag ? "ah-dark" : "ah-hover"})`}
            />
          )}

          {/* Hint animated line */}
          {hint && (
            <path d={curvePath(hint.x1, hint.y1, hint.x2, hint.y2)}
              fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5"
              strokeDasharray="8 4" markerEnd="url(#ah-hint)"
              style={{ animation: "dashAnim 1.2s linear infinite" }}
            />
          )}
        </svg>

        {/* Left column: 6 habit cards stacked vertically, filling full height */}
        <div className="flex flex-col gap-3 relative" style={{ width: "45%", zIndex: 10 }}>
          {habits.map((h, i) => {
            const connectedTo = connections[i];
            const isConnected = connectedTo !== undefined;
            const isDraggingThis = dragFrom === i;
            return (
              <div
                key={i}
                ref={el => { leftRefs.current[i] = el; }}
                onMouseDown={e => { e.preventDefault(); if (!submitted && !isConnected) { setDragFrom(i); resetHintTimer(); } }}
                className="flex-1 flex items-center gap-4 rounded-2xl select-none transition-all duration-150 relative"
                style={{
                  padding: "0 20px",
                  background: isDraggingThis
                    ? "rgba(253,224,71,0.97)"
                    : "rgba(255,255,255,0.9)",
                  border: isDraggingThis
                    ? "3px solid #ca8a04"
                    : isConnected
                    ? `3px solid ${connectedTo === "good" ? "#22c55e" : "#ef4444"}`
                    : "3px solid rgba(255,255,255,0.3)",
                  boxShadow: isDraggingThis ? "0 0 24px rgba(253,224,71,0.7)" : "0 3px 12px rgba(0,0,0,0.25)",
                  cursor: isConnected ? "default" : "grab",
                  transform: isDraggingThis ? "scale(1.04)" : "scale(1)",
                  opacity: isConnected ? 0.85 : 1,
                }}
              >
                {isConnected && (
                  <span className="absolute top-2 right-2 text-base">
                    {connectedTo === "good" ? "🟢" : "🔴"}
                  </span>
                )}
                <span className="text-4xl flex-shrink-0">{h.emoji}</span>
                <span className="font-bold text-base text-gray-800 leading-tight">{h.name}</span>
              </div>
            );
          })}
        </div>

        {/* Gap for arrows */}
        <div style={{ width: "10%", flexShrink: 0 }} />

        {/* Right column: 2 target boxes */}
        <div className="flex flex-col justify-center gap-8 relative" style={{ width: "45%", zIndex: 10 }}>
          {/* Good Habit */}
          <div
            ref={goodRef}
            className="rounded-3xl flex flex-col items-center justify-center transition-all duration-150"
            style={{
              padding: "36px 24px",
              background: hoveredRight === "good"
                ? "rgba(220,252,231,0.99)"
                : "rgba(240,253,244,0.88)",
              border: hoveredRight === "good"
                ? "4px solid #16a34a"
                : "4px solid #86efac",
              boxShadow: hoveredRight === "good"
                ? "0 0 36px rgba(34,197,94,0.6)"
                : "0 4px 20px rgba(0,0,0,0.15)",
              transform: hoveredRight === "good" ? "scale(1.04)" : "scale(1)",
            }}
          >
            <div className="text-6xl mb-3">🌟</div>
            <div className="font-black text-2xl text-green-800">Good Habit</div>
            <div className="text-sm text-green-600 mt-1">Helps you learn better</div>
            <div className="mt-3 bg-green-100 text-green-700 font-bold text-sm rounded-full px-4 py-1">
              {Object.values(connections).filter(v => v === "good").length} matched
            </div>
          </div>

          {/* Bad Habit */}
          <div
            ref={badRef}
            className="rounded-3xl flex flex-col items-center justify-center transition-all duration-150"
            style={{
              padding: "36px 24px",
              background: hoveredRight === "bad"
                ? "rgba(254,226,226,0.99)"
                : "rgba(255,241,242,0.88)",
              border: hoveredRight === "bad"
                ? "4px solid #dc2626"
                : "4px solid #fca5a5",
              boxShadow: hoveredRight === "bad"
                ? "0 0 36px rgba(239,68,68,0.6)"
                : "0 4px 20px rgba(0,0,0,0.15)",
              transform: hoveredRight === "bad" ? "scale(1.04)" : "scale(1)",
            }}
          >
            <div className="text-6xl mb-3">🚫</div>
            <div className="font-black text-2xl text-red-800">Bad Habit</div>
            <div className="text-sm text-red-600 mt-1">Hurts your learning</div>
            <div className="mt-3 bg-red-100 text-red-700 font-bold text-sm rounded-full px-4 py-1">
              {Object.values(connections).filter(v => v === "bad").length} matched
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      {connectedCount === 6 && !submitted && (
        <div className="text-center py-3 flex-shrink-0">
          <button onClick={() => endGame(connections, timeLeft)} className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xl font-black rounded-full shadow-xl hover:scale-105 transition-transform">
            Check Answers! ✅
          </button>
        </div>
      )}
    </div>
  );
}
