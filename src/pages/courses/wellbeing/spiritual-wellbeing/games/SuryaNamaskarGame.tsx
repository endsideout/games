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
}

const POSES: Pose[] = [
  { id: 1, name: "Prayer Pose",    sanskrit: "Pranamasana" },
  { id: 2, name: "Raised Arms",    sanskrit: "Hasta Uttanasana" },
  { id: 3, name: "Forward Fold",   sanskrit: "Hasta Padasana" },
  { id: 4, name: "Low Lunge",      sanskrit: "Ashwa Sanchalanasana" },
  { id: 5, name: "Plank Pose",     sanskrit: "Dandasana" },
  { id: 6, name: "Eight Limbs",    sanskrit: "Ashtanga Namaskara" },
  { id: 7, name: "Cobra Pose",     sanskrit: "Bhujangasana" },
  { id: 8, name: "Downward Dog",   sanskrit: "Adho Mukha Svanasana" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Stick-figure SVG for each pose ──────────────────────────────────────────
function PoseSVG({ id }: { id: number }) {
  const s = {
    stroke: "#334155",
    strokeWidth: 3.5,
    strokeLinecap: "round"  as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };
  const floor = { stroke: "rgba(0,0,0,0.18)", strokeWidth: 1.5, strokeLinecap: "round" as const, fill: "none" };
  const H = { fill: "#334155" }; // head fill

  return (
    <svg viewBox="0 0 80 100" width="100%" height="100%" style={{ display: "block" }}>
      {/* ── 1: Pranamasana — standing, hands together at heart (front view) ── */}
      {id === 1 && <>
        <circle cx="40" cy="10" r="7" {...H} />
        {/* spine */}
        <line x1="40" y1="17" x2="40" y2="52" {...s} />
        {/* left arm: shoulder → elbow → hands meet */}
        <polyline points="40,27 27,37 38,45" {...s} />
        {/* right arm */}
        <polyline points="40,27 53,37 42,45" {...s} />
        {/* left leg */}
        <polyline points="40,52 33,72 31,88" {...s} />
        {/* right leg */}
        <polyline points="40,52 47,72 49,88" {...s} />
      </>}

      {/* ── 2: Hasta Uttanasana — arms swept high, backbend (front view) ── */}
      {id === 2 && <>
        <circle cx="42" cy="10" r="7" {...H} />
        {/* spine slight arch */}
        <polyline points="41,17 39,34 37,52" {...s} />
        {/* left arm raised */}
        <line x1="39" y1="28" x2="18" y2="8" {...s} />
        {/* right arm raised */}
        <line x1="41" y1="28" x2="62" y2="8" {...s} />
        {/* left leg */}
        <polyline points="37,52 34,72 33,88" {...s} />
        {/* right leg */}
        <polyline points="37,52 40,72 40,88" {...s} />
      </>}

      {/* ── 3: Hasta Padasana — forward fold, side view (facing right) ── */}
      {id === 3 && <>
        <circle cx="63" cy="68" r="7" {...H} />
        {/* neck to shoulder */}
        <line x1="63" y1="61" x2="57" y2="52" {...s} />
        {/* horizontal torso */}
        <line x1="57" y1="52" x2="38" y2="48" {...s} />
        {/* arms hanging toward floor */}
        <line x1="53" y1="54" x2="55" y2="82" {...s} />
        <line x1="57" y1="56" x2="59" y2="84" {...s} />
        {/* legs straight down */}
        <polyline points="38,48 36,68 36,88" {...s} />
        <polyline points="41,48 41,68 41,88" {...s} />
        <line x1="32" y1="88" x2="46" y2="88" {...floor} />
      </>}

      {/* ── 4: Ashwa Sanchalanasana — low lunge, side view (facing right) ── */}
      {id === 4 && <>
        <circle cx="22" cy="21" r="7" {...H} />
        {/* spine leaning forward */}
        <line x1="24" y1="28" x2="35" y2="46" {...s} />
        {/* left arm down to floor (front) */}
        <polyline points="29,37 19,55 17,84" {...s} />
        {/* right arm down to floor */}
        <polyline points="31,39 27,57 25,84" {...s} />
        {/* front leg — left knee bent forward */}
        <polyline points="35,46 23,62 14,88" {...s} />
        {/* back leg — right, extended behind */}
        <polyline points="37,48 55,66 67,84" {...s} />
        <line x1="10" y1="88" x2="70" y2="88" {...floor} />
      </>}

      {/* ── 5: Dandasana — plank, side view ── */}
      {id === 5 && <>
        <circle cx="10" cy="34" r="7" {...H} />
        {/* neck */}
        <line x1="16" y1="38" x2="22" y2="41" {...s} />
        {/* body horizontal */}
        <line x1="22" y1="41" x2="73" y2="41" {...s} />
        {/* arms straight down */}
        <line x1="27" y1="41" x2="27" y2="59" {...s} />
        <line x1="33" y1="41" x2="33" y2="59" {...s} />
        {/* toes at back */}
        <line x1="67" y1="41" x2="71" y2="59" {...s} />
        <line x1="71" y1="41" x2="75" y2="59" {...s} />
        <line x1="23" y1="59" x2="75" y2="59" {...floor} />
      </>}

      {/* ── 6: Ashtanga Namaskara — eight limbs, side view ── */}
      {id === 6 && <>
        <circle cx="10" cy="75" r="7" {...H} />
        {/* body: from low chest rising to lifted hips */}
        <polyline points="18,80 35,74 50,60" {...s} />
        {/* arms bent at floor */}
        <polyline points="26,76 19,82 14,89" {...s} />
        <line x1="28" y1="77" x2="21" y2="86" {...s} />
        {/* front knee on floor */}
        <polyline points="50,60 52,77 52,89" {...s} />
        {/* back shin raised */}
        <polyline points="52,63 62,75" {...s} />
        <line x1="10" y1="89" x2="56" y2="89" {...floor} />
      </>}

      {/* ── 7: Bhujangasana — cobra, side view ── */}
      {id === 7 && <>
        <circle cx="11" cy="30" r="7" {...H} />
        {/* neck curves down to spine */}
        <line x1="15" y1="37" x2="23" y2="50" {...s} />
        {/* spine arcing to hips on floor */}
        <polyline points="23,50 38,62 57,68" {...s} />
        {/* legs flat on floor */}
        <line x1="57" y1="68" x2="74" y2="74" {...s} />
        {/* arms pushing up */}
        <line x1="21" y1="52" x2="23" y2="77" {...s} />
        <line x1="27" y1="54" x2="29" y2="79" {...s} />
        <line x1="19" y1="79" x2="74" y2="79" {...floor} />
      </>}

      {/* ── 8: Adho Mukha Svanasana — downward dog, inverted V ── */}
      {id === 8 && <>
        <circle cx="25" cy="55" r="7" {...H} />
        {/* left arm: hand on floor → head → hip peak */}
        <polyline points="14,79 23,61 40,21" {...s} />
        {/* right arm */}
        <line x1="18" y1="79" x2="40" y2="23" {...s} />
        {/* left leg: hip → foot */}
        <polyline points="40,21 62,77" {...s} />
        {/* right leg */}
        <line x1="40" y1="23" x2="66" y2="79" {...s} />
        {/* heels */}
        <line x1="59" y1="79" x2="63" y2="88" {...s} />
        <line x1="63" y1="77" x2="67" y2="86" {...s} />
        <line x1="10" y1="80" x2="68" y2="80" {...floor} />
      </>}
    </svg>
  );
}

// ── Pose card rendered inside pool or slot ───────────────────────────────────
function PoseCard({ pose, compact = false }: { pose: Pose; compact?: boolean }) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      <div style={{ flex: 1, width: "100%", minHeight: 0 }}>
        <PoseSVG id={pose.id} />
      </div>
      <div className="text-center px-1 pb-1" style={{ flexShrink: 0 }}>
        <div className={`font-black text-gray-800 leading-tight ${compact ? "text-xs" : "text-sm"}`}>
          {pose.name}
        </div>
        <div className={`text-orange-600 font-semibold leading-tight ${compact ? "text-[9px]" : "text-xs"}`}>
          {pose.sanskrit}
        </div>
      </div>
    </div>
  );
}

// ── Animated pose sequencer (loops through all 8 poses) ─────────────────────
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
      {/* SVG figure */}
      <div
        style={{
          width: size,
          height: size * 1.25,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.16s ease-in-out",
        }}
      >
        <PoseSVG id={pose.id} />
      </div>

      {/* Step label */}
      <div
        className="text-center mt-2"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.16s" }}
      >
        <div className="text-white/50 text-xs font-bold uppercase tracking-widest">
          Step {idx + 1} of {POSES.length}
        </div>
        <div className="text-white font-black text-xl leading-tight">{pose.name}</div>
        <div className="text-yellow-300 text-sm font-semibold">{pose.sanskrit}</div>
      </div>

      {/* Progress pills */}
      <div className="flex gap-1.5 mt-3">
        {POSES.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === idx ? 22 : 8,
              height: 8,
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
  const [slots,    setSlots]    = useState<(Pose | null)[]>(Array(8).fill(null));
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [dragSrc,  setDragSrc]  = useState<DragSrc>(null);
  const [overSlot, setOverSlot] = useState<number | null>(null);
  const [overPool, setOverPool] = useState(false);

  const slotsRef     = useRef<(Pose | null)[]>(Array(8).fill(null));
  const sessionIdRef = useRef("");
  const { trackEvent } = useGameUser();

  useEffect(() => { slotsRef.current = slots; }, [slots]);

  function startGame() {
    const shuffled = shuffle([...POSES]);
    setPool(shuffled);
    const empty = Array(8).fill(null);
    setSlots(empty);
    slotsRef.current = empty;
    setTimeLeft(GAME_DURATION);
    setDragSrc(null);
    setPhase("playing");
    sessionIdRef.current = generateSessionId();
    trackEvent({ gameId: GAME_ID, event: "game_started", sessionId: sessionIdRef.current });
  }

  // Timer
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
      const card     = newPool[dragSrc.idx];
      const displaced = newSlots[slotIdx];
      newSlots[slotIdx] = card;
      newPool.splice(dragSrc.idx, 1);
      if (displaced) newPool.push(displaced);
    } else {
      // slot → slot: swap
      const srcCard  = newSlots[dragSrc.idx];
      const destCard = newSlots[slotIdx];
      newSlots[slotIdx]   = srcCard;
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
  const timerPct   = (timeLeft / GAME_DURATION) * 100;
  const timerColor = timeLeft > 60 ? "#22c55e" : timeLeft > 20 ? "#f59e0b" : "#ef4444";
  const allFilled  = slots.every(s => s !== null);
  const correctCount = slots.filter((p, i) => p?.id === i + 1).length;

  /* ── MENU ── */
  if (phase === "menu") return (
    <div className="min-h-screen flex items-center justify-center py-8 px-6 gap-10" style={bgStyle}>

      {/* LEFT — animated sequence preview */}
      <div className="flex flex-col items-center gap-4 flex-shrink-0">
        <div className="bg-white/15 backdrop-blur-sm rounded-3xl border-2 border-white/30 p-8 shadow-2xl">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest text-center mb-4">
            Watch the sequence
          </p>
          <PoseAnimator size={200} />
        </div>
        <p className="text-white/50 text-xs font-semibold text-center">Auto-playing • loops forever</p>
      </div>

      {/* RIGHT — game info */}
      <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-10 max-w-md w-full text-center">
        <Logo size="md" className="mx-auto mb-4" />
        <div className="text-6xl mb-2">🌅</div>
        <h1 className="text-4xl font-black text-orange-800 mb-2">Surya Namaskar</h1>
        <p className="text-base text-gray-600 mb-5 leading-relaxed">
          Watch the animation, then arrange all <strong>8 Sun Salutation</strong> poses in the correct order!
        </p>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 mb-6 text-left text-sm text-orange-900 space-y-1">
          <p className="font-black mb-1">How to play:</p>
          <p>1️⃣ Watch the sequence animation on the left</p>
          <p>2️⃣ Drag shuffled cards into slots 1 → 8</p>
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
    const pct   = Math.round((correctCount / 8) * 100);
    const medal = pct === 100 ? "🏆" : pct >= 75 ? "🌟" : pct >= 50 ? "💪" : "🌱";
    const msg   = pct === 100 ? "Perfect! Namaste! 🙏" : pct >= 75 ? "Great effort!" : pct >= 50 ? "Good try!" : "Keep practising!";
    return (
      <div className="min-h-screen py-8 px-4" style={bgStyle}>
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="bg-white/95 rounded-3xl shadow-2xl border-4 border-yellow-300 p-8 text-center">
            <div className="text-6xl mb-2 animate-bounce">{medal}</div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">{msg}</h2>
            <div className="flex justify-center gap-6 mb-6">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl px-6 py-3">
                <div className="text-3xl font-black text-orange-600">{score}</div>
                <div className="text-sm text-orange-800 font-bold">Points</div>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl px-6 py-3">
                <div className="text-3xl font-black text-green-600">{correctCount}/8</div>
                <div className="text-sm text-green-800 font-bold">Correct</div>
              </div>
            </div>

            {/* Result grid — show each slot with correct/wrong indicator */}
            <div className="grid grid-cols-4 gap-3">
              {slots.map((pose, i) => {
                const correct = pose?.id === i + 1;
                const expected = POSES[i];
                return (
                  <div key={i} className="rounded-2xl border-3 overflow-hidden"
                    style={{
                      border: `3px solid ${correct ? "#22c55e" : "#ef4444"}`,
                      background: correct ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                    }}>
                    <div className="text-xs font-black text-center py-1"
                      style={{ background: correct ? "#22c55e" : "#ef4444", color: "white" }}>
                      {correct ? `✓ Step ${i + 1}` : `✗ Step ${i + 1}`}
                    </div>
                    <div style={{ height: 90 }}>
                      {pose ? <PoseCard pose={pose} compact /> : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                          <div className="text-2xl">?</div>
                          <div className="text-xs">Empty</div>
                        </div>
                      )}
                    </div>
                    {!correct && (
                      <div className="text-center pb-1 px-1">
                        <div className="text-xs text-gray-500">Should be:</div>
                        <div className="text-xs font-bold text-orange-700">{expected.name}</div>
                      </div>
                    )}
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
          {slots.filter(Boolean).length} / 8 placed
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

      {/* Fixed sequence panel — bottom-right */}
      <div
        style={{
          position: "fixed",
          right: 16,
          bottom: 16,
          width: 200,
          height: 200,
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
        <PoseAnimator size={100} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 min-h-0 gap-3 px-3 pb-3">

        {/* LEFT — slots + pool + submit */}
        <div className="flex flex-col flex-1 min-w-0 gap-2">

          {/* Slots — 2 rows of 4 */}
          <div className="flex-shrink-0">
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 text-center">Arrange in order →</p>
            <div className="grid grid-cols-4 gap-2">
              {Array(8).fill(null).map((_, i) => {
                const pose = slots[i];
                const isOver = overSlot === i;
                return (
                  <div
                    key={i}
                    onDragOver={e => { e.preventDefault(); setOverSlot(i); }}
                    onDragLeave={() => setOverSlot(null)}
                    onDrop={() => dropToSlot(i)}
                    className="rounded-2xl transition-all duration-150 relative"
                    style={{
                      height: 140,
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
                    {/* Step number badge */}
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

          {/* Divider */}
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
            <div className="flex gap-3 flex-wrap justify-center">
              {pool.map((pose, i) => (
                <div
                  key={pose.id}
                  draggable
                  onDragStart={() => setDragSrc({ from: "pool", idx: i })}
                  className="rounded-2xl bg-white/95 shadow-xl transition-all duration-150 hover:scale-105"
                  style={{
                    width: 110,
                    height: 145,
                    cursor: "grab",
                    border: "3px solid rgba(255,255,255,0.6)",
                    padding: 6,
                    flexShrink: 0,
                  }}
                >
                  <PoseCard pose={pose} />
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
