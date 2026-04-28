import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../../components";
import { useGameUser } from "../../../../../context/GameUserContext";
import { generateSessionId } from "../../../../../lib/sessionId";

const GAME_ID = "surya-namaskar";
const GAME_DURATION = 120;
const POINTS_PER_CORRECT = 10;

interface Pose {
  id: number;
  name: string;
  sanskrit: string;
  subtitle: string;
  image: string;
}

const POSES: Pose[] = [
  { id: 1,  name: "Pranamasana",          sanskrit: "Prayer Pose",           subtitle: "Normal breath",       image: "/poses/pose-1.png"  },
  { id: 2,  name: "Hasta Uttanasana",     sanskrit: "Raised Arms",           subtitle: "Stretch up",          image: "/poses/pose-2.png"  },
  { id: 3,  name: "Uttanasana",           sanskrit: "Forward Fold",          subtitle: "Forward fold",        image: "/poses/pose-3.png"  },
  { id: 4,  name: "Ashwa Sanchalanasana", sanskrit: "Right Leg Back Lunge",  subtitle: "Right leg back",      image: "/poses/pose-4.png"  },
  { id: 5,  name: "Dandasana",            sanskrit: "Plank",                 subtitle: "Plank",               image: "/poses/pose-5.png"  },
  { id: 6,  name: "Ashtanga Namaskara",   sanskrit: "Eight Limbs",           subtitle: "Knees chest chin",    image: "/poses/pose-6.png"  },
  { id: 7,  name: "Bhujangasana",         sanskrit: "Cobra Pose",            subtitle: "Lift chest",          image: "/poses/pose-7.png"  },
  { id: 8,  name: "Parvatasana",          sanskrit: "Downward Dog",          subtitle: "Hips up",             image: "/poses/pose-8.png"  },
  { id: 9,  name: "Ashwa Sanchalanasana", sanskrit: "Right Leg Forward Lunge", subtitle: "Right leg forward", image: "/poses/pose-9.png"  },
  { id: 10, name: "Uttanasana",           sanskrit: "Forward Fold",          subtitle: "Fold",                image: "/poses/pose-10.png" },
  { id: 11, name: "Hasta Uttanasana",     sanskrit: "Raised Arms",           subtitle: "Stretch up",          image: "/poses/pose-11.png" },
  { id: 12, name: "Pranamasana",          sanskrit: "Prayer Pose",           subtitle: "Relax",               image: "/poses/pose-12.png" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function PoseCard({ pose, compact = false }: { pose: Pose; compact?: boolean }) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div style={{ flex: 1, width: "100%", minHeight: 0, position: "relative" }}>
        <img
          src={pose.image}
          alt={pose.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "bottom",
            display: "block",
          }}
        />
      </div>
      <div className="text-center px-1 pb-1" style={{ flexShrink: 0 }}>
        <div className={`font-black text-gray-800 leading-tight ${compact ? "text-[10px]" : "text-xs"}`}>
          {pose.name}
        </div>
        <div className={`text-orange-600 font-semibold leading-tight ${compact ? "text-[8px]" : "text-[10px]"}`}>
          {pose.subtitle}
        </div>
      </div>
    </div>
  );
}

function PoseAnimator({ size = 160 }: { size?: number }) {
  const [idx,     setIdx]     = useState(0);
  const [visible, setVisible] = useState(true);

  // TODO(lint-safe-pass): deferred exhaustive-deps fix; timer/finalization effect intentionally keyed to phase.
  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % POSES.length);
        setVisible(true);
      }, 160);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  const pose = POSES[idx];

  return (
    <div className="flex flex-col items-center select-none">
      <div
        style={{
          width: size,
          height: size * 1.25,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.16s ease-in-out",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <img
          src={pose.image}
          alt={pose.name}
          style={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "bottom" }}
        />
      </div>

      <div
        className="text-center mt-2"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.16s" }}
      >
        <div className="text-white/50 text-xs font-bold uppercase tracking-widest">
          Step {idx + 1} of {POSES.length}
        </div>
        <div className="text-white font-black text-lg leading-tight">{pose.name}</div>
        <div className="text-yellow-300 text-xs font-semibold">{pose.subtitle}</div>
      </div>

      <div className="flex gap-1 mt-3 flex-wrap justify-center" style={{ maxWidth: size }}>
        {POSES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === idx ? 18 : 6,
              height: 6,
              background: i === idx ? "white" : "rgba(255,255,255,0.28)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

type Phase = "menu" | "playing" | "result";
type DragSrc = { from: "pool"; idx: number } | { from: "slot"; idx: number } | null;

export function SuryaNamaskarGame(): React.JSX.Element {
  const location = useLocation();
  const backTo = new URLSearchParams(location.search).get("from") === "3dw-set1"
    ? "/3d-wellness/set-1"
    : "/spiritual-wellbeing";

  const [phase,    setPhase]    = useState<Phase>("menu");
  const [pool,     setPool]     = useState<Pose[]>([]);
  const [slots,    setSlots]    = useState<(Pose | null)[]>(Array(12).fill(null));
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [dragSrc,  setDragSrc]  = useState<DragSrc>(null);
  const [overSlot, setOverSlot] = useState<number | null>(null);
  const [overPool, setOverPool] = useState(false);

  const slotsRef     = useRef<(Pose | null)[]>(Array(12).fill(null));
  const sessionIdRef = useRef("");
  const { trackEvent } = useGameUser();

  useEffect(() => { slotsRef.current = slots; }, [slots]);

  function startGame() {
    const shuffled = shuffle([...POSES]);
    setPool(shuffled);
    const empty = Array(12).fill(null);
    setSlots(empty);
    slotsRef.current = empty;
    setTimeLeft(GAME_DURATION);
    setDragSrc(null);
    setPhase("playing");
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); endGame(slotsRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  function calcScore(s: (Pose | null)[]) {
    return s.filter((p, i) => p?.id === i + 1).length * POINTS_PER_CORRECT;
  }

  function endGame(s: (Pose | null)[]) {
    const score = calcScore(s);
    trackEvent({ gameId: GAME_ID, event: "game_completed", sessionId: sessionIdRef.current, score });
    setSlots(s);
    setPhase("result");
  }

  function dropToSlot(slotIdx: number) {
    if (!dragSrc) return;
    const newPool  = [...pool];
    const newSlots = [...slots];

    if (dragSrc.from === "pool") {
      const card      = newPool[dragSrc.idx];
      const displaced = newSlots[slotIdx];
      newSlots[slotIdx] = card;
      newPool.splice(dragSrc.idx, 1);
      if (displaced) newPool.push(displaced);
    } else {
      const srcCard  = newSlots[dragSrc.idx];
      const destCard = newSlots[slotIdx];
      newSlots[slotIdx]     = srcCard;
      newSlots[dragSrc.idx] = destCard;
    }

    setPool(newPool);
    setSlots(newSlots);
    slotsRef.current = newSlots;
    setDragSrc(null);
    setOverSlot(null);
  }

  function dropToPool() {
    if (!dragSrc || dragSrc.from !== "slot") return;
    const pose = slots[dragSrc.idx];
    if (!pose) return;
    const newSlots = [...slots];
    newSlots[dragSrc.idx] = null;
    setPool(p => [...p, pose]);
    setSlots(newSlots);
    slotsRef.current = newSlots;
    setDragSrc(null);
    setOverPool(false);
  }

  function returnToPool(idx: number) {
    const pose = slots[idx];
    if (!pose) return;
    const newSlots = [...slots];
    newSlots[idx] = null;
    setPool(p => [...p, pose]);
    setSlots(newSlots);
    slotsRef.current = newSlots;
  }

  const bgStyle = {
    background: "linear-gradient(135deg, #fde68a 0%, #fbbf24 30%, #f59e0b 65%, #d97706 100%)",
  };
  const timerPct    = (timeLeft / GAME_DURATION) * 100;
  const timerColor  = timeLeft > 60 ? "#22c55e" : timeLeft > 20 ? "#f59e0b" : "#ef4444";
  const allFilled   = slots.every(s => s !== null);
  const correctCount = slots.filter((p, i) => p?.id === i + 1).length;

  /* ── MENU ── */
  if (phase === "menu") return (
    <div className="min-h-screen flex items-center justify-center py-8 px-6 gap-10" style={bgStyle}>

      <div className="flex flex-col items-center gap-4 flex-shrink-0">
        <div className="bg-white/15 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-8 shadow-2xl">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest text-center mb-4">
            Watch the sequence
          </p>
          <PoseAnimator size={180} />
        </div>
        <p className="text-white/50 text-xs font-semibold text-center">Auto-playing • loops forever</p>
      </div>

      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-10 max-w-md w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-6xl mb-2">🌅</div>
        <h1 className="text-4xl font-black text-orange-800 mb-2">Surya Namaskar</h1>
        <p className="text-base text-gray-600 mb-5 leading-relaxed">
          Watch the animation, then arrange all <strong>12 Sun Salutation</strong> poses in the correct order!
        </p>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6 text-left text-sm text-orange-900 space-y-1">
          <p className="font-black mb-1">How to play:</p>
          <p>1️⃣ Watch the sequence animation on the left</p>
          <p>2️⃣ Drag shuffled cards into slots 1 → 12</p>
          <p>3️⃣ Swap cards between slots to rearrange</p>
          <p>4️⃣ Hit Submit when you're ready!</p>
          <p>⏱️ You have {GAME_DURATION} seconds</p>
        </div>
        <button
          onClick={startGame}
          className="px-10 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-2xl font-black rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Start! 🌞
        </button>
        <div className="mt-4">
          <Link to={backTo} className="text-orange-500 hover:text-orange-700 font-semibold text-sm">← Back</Link>
        </div>
      </div>
    </div>
  );

  /* ── RESULT ── */
  if (phase === "result") {
    const score = calcScore(slots);
    const pct   = Math.round((correctCount / 12) * 100);
    const medal = pct === 100 ? "🏆" : pct >= 75 ? "🌟" : pct >= 50 ? "💪" : "🌱";
    const msg   = pct === 100 ? "Perfect! Namaste! 🙏" : pct >= 75 ? "Great effort!" : pct >= 50 ? "Good try!" : "Keep practising!";
    return (
      <div className="min-h-screen py-8 px-4" style={bgStyle}>
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-8 text-center">
            <div className="text-6xl mb-2 animate-bounce">{medal}</div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">{msg}</h2>
            <div className="flex justify-center gap-6 mb-6">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl px-6 py-3">
                <div className="text-3xl font-black text-orange-600">{score}</div>
                <div className="text-sm text-orange-800 font-bold">Points</div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-6 py-3">
                <div className="text-3xl font-black text-green-600">{correctCount}/12</div>
                <div className="text-sm text-green-800 font-bold">Correct</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {slots.map((pose, i) => {
                const correct  = pose?.id === i + 1;
                const expected = POSES[i];
                return (
                  <div key={i} className="rounded-2xl overflow-hidden"
                    style={{
                      border: `3px solid ${correct ? "#22c55e" : "#ef4444"}`,
                      background: correct ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                    }}>
                    <div className="text-xs font-black text-center py-1"
                      style={{ background: correct ? "#22c55e" : "#ef4444", color: "white" }}>
                      {correct ? `✓ Step ${i + 1}` : `✗ Step ${i + 1}`}
                    </div>
                    <div style={{ height: 80 }}>
                      {pose ? (
                        <img src={pose.image} alt={pose.name}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                          <div className="text-2xl">?</div>
                          <div className="text-xs">Empty</div>
                        </div>
                      )}
                    </div>
                    <div className="text-center pb-1 px-1">
                      <div className="text-[9px] font-black text-gray-700 leading-tight">{correct ? pose!.name : expected.name}</div>
                      {!correct && (
                        <div className="text-[8px] text-orange-600 leading-tight">Should be: {expected.name}</div>
                      )}
                    </div>
                  </div>
                );
              })}
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

  /* ── PLAYING ── */
  return (
    <div className="min-h-screen flex flex-col" style={bgStyle}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/15 backdrop-blur-sm flex-shrink-0">
        <Link to={backTo} className="text-white/70 hover:text-white font-semibold text-sm">← Exit</Link>
        <span className="text-white font-black text-lg">🌅 Surya Namaskar</span>
        <span className="text-white/80 text-sm font-semibold">
          {slots.filter(Boolean).length} / 12 placed
        </span>
      </div>

      {/* Timer bar */}
      <div className="h-2 bg-white/20 flex-shrink-0">
        <div className="h-full transition-all duration-1000" style={{ width: `${timerPct}%`, background: timerColor }} />
      </div>
      <div className="flex justify-between items-center px-6 py-1 flex-shrink-0">
        <span className="font-black" style={{ color: timeLeft <= 20 ? "#fca5a5" : "white" }}>
          ⏱️ {timeLeft}s
        </span>
        <span className="text-white/70 text-xs">Drag poses into the correct numbered step</span>
      </div>

      {/* Sequence preview — bottom-right */}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 160,
          background: "rgba(30,10,0,0.72)",
          backdropFilter: "blur(12px)",
          borderRadius: 20,
          border: "2px solid rgba(255,255,255,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
          Sequence
        </p>
        <PoseAnimator size={90} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 gap-3 px-3 pb-3">
        <div className="flex flex-col flex-1 min-w-0 gap-2">

          {/* Slots — 3 rows of 4 */}
          <div className="flex-shrink-0">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 text-center">Arrange in order →</p>
            <div className="grid grid-cols-4 gap-2">
              {Array(12).fill(null).map((_, i) => {
                const pose   = slots[i];
                const isOver = overSlot === i;
                return (
                  <div
                    key={i}
                    onDragOver={e => { e.preventDefault(); setOverSlot(i); }}
                    onDragLeave={() => setOverSlot(null)}
                    onDrop={() => dropToSlot(i)}
                    className="rounded-2xl transition-all duration-150 relative"
                    style={{
                      height: 120,
                      background: pose
                        ? "rgba(255,255,255,0.95)"
                        : isOver
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(255,255,255,0.18)",
                      border: `3px solid ${isOver ? "white" : pose ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"}`,
                      boxShadow: isOver ? "0 0 20px rgba(255,255,255,0.5)" : "none",
                      transform: isOver ? "scale(1.03)" : "scale(1)",
                      cursor: pose ? "pointer" : "default",
                    }}
                    onClick={() => pose && returnToPool(i)}
                    title={pose ? "Click to return to pool" : ""}
                  >
                    <div className="absolute top-1 left-2 text-xs font-black z-10"
                      style={{ color: pose ? "#f59e0b" : "rgba(255,255,255,0.5)" }}>
                      {i + 1}
                    </div>

                    {pose ? (
                      <div
                        className="w-full h-full p-1 pt-4"
                        draggable
                        onDragStart={() => setDragSrc({ from: "slot", idx: i })}
                        style={{ cursor: "grab" }}
                      >
                        <PoseCard pose={pose} compact />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-black" style={{ color: "rgba(255,255,255,0.2)" }}>{i + 1}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-white/20 flex-shrink-0" />

          {/* Pool */}
          <div
            className="flex-1 overflow-y-hidden"
            onDragOver={e => { e.preventDefault(); setOverPool(true); }}
            onDragLeave={() => setOverPool(false)}
            onDrop={() => { dropToPool(); setOverPool(false); }}
            style={{
              background: overPool ? "rgba(255,255,255,0.1)" : "transparent",
              borderRadius: 16,
              transition: "background 0.15s",
              padding: "4px 0",
            }}
          >
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 text-center">
              {pool.length > 0 ? "Drag a pose to a step above" : "All poses placed! Hit Submit ✓"}
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              {pool.map((pose, i) => (
                <div
                  key={pose.id}
                  draggable
                  onDragStart={() => setDragSrc({ from: "pool", idx: i })}
                  className="rounded-2xl bg-white/95 shadow-xl transition-all duration-150 hover:scale-105"
                  style={{
                    width: 90,
                    height: 120,
                    cursor: "grab",
                    border: "3px solid rgba(255,255,255,0.6)",
                    padding: 4,
                    flexShrink: 0,
                  }}
                >
                  <PoseCard pose={pose} compact />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="text-center flex-shrink-0 pb-1">
            <button
              onClick={() => endGame(slotsRef.current)}
              disabled={!allFilled}
              className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xl font-black rounded-full shadow-xl hover:scale-105 transition-transform disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Submit Sequence ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
