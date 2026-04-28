import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../../../../components";
import { useGameUser } from "../../../../context/GameUserContext";
import { speak as speakKyh } from "./gameAudio";

const GAME_ID    = "habit-guard-game";

function speak(text: string) {
  speakKyh(text, { rate: 0.88 });
}
const ITEM_SIZE   = 215; // circle diameter (+25% from prev 173×153)
const MAX_PIMPLES = 5;
const SPAWN_MS   = 2100;
const SPEED_MIN  = 68;
const SPEED_MAX  = 108;

// Fixed pimple positions on the face (SVG coords, face center ≈ cx=70,cy=76)
const PIMPLE_SPOTS = [
  { cx: 50, cy: 88 },   // left cheek
  { cx: 90, cy: 88 },   // right cheek
  { cx: 70, cy: 62 },   // forehead
  { cx: 56, cy: 104 },  // left jaw
  { cx: 84, cy: 104 },  // right jaw
];

function playTone(freqs: number[], type: OscillatorType = "sine") {
  try {
    const ctx = new AudioContext();
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = type; osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.13;
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t); osc.stop(t + 0.28);
    });
  } catch {}
}
const playGood = () => playTone([523, 659, 784]);
const playBad  = () => playTone([220, 170], "sawtooth");

// ── Character SVG — white skin, yellow top, pimples ──────────────────────────
function CharacterSVG({
  state,
  pimpleCount,
}: {
  state: "normal" | "happy" | "hurt";
  pimpleCount: number;
}) {
  const glow =
    state === "happy" ? "#22c55e" : state === "hurt" ? "#ef4444" : "transparent";
  return (
    <svg
      viewBox="0 0 140 200"
      style={{
        height: "50vh",
        width: "auto",
        display: "block",
        filter: state !== "normal" ? `drop-shadow(0 0 16px ${glow})` : "none",
        transition: "filter 0.3s",
      }}
    >
      <defs>
        <radialGradient id="cg-skin" cx="50%" cy="38%">
          <stop offset="0%" stopColor="#fde8d5" />
          <stop offset="100%" stopColor="#f5c4a0" />
        </radialGradient>
        <radialGradient id="cg-cheek" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#f9a8d4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f9a8d4" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Body — yellow top */}
      <path
        d="M26 145 Q14 178 18 200 L122 200 Q126 178 114 145 Q84 162 60 162 Q36 162 26 145Z"
        fill="#f59e0b"
      />
      {/* Neck */}
      <rect x="58" y="112" width="24" height="34" rx="5" fill="url(#cg-skin)" />
      {/* Shoulders */}
      <ellipse cx="26" cy="152" rx="26" ry="19" fill="#f59e0b" />
      <ellipse cx="114" cy="152" rx="26" ry="19" fill="#f59e0b" />

      {/* Head */}
      <ellipse cx="70" cy="76" rx="38" ry="42" fill="url(#cg-skin)" />

      {/* Hair — black */}
      <ellipse cx="70" cy="47" rx="41" ry="23" fill="#111827" />
      <path
        d="M32 58 Q17 108 22 178"
        stroke="#111827"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M108 58 Q123 108 118 178"
        stroke="#111827"
        strokeWidth="15"
        fill="none"
        strokeLinecap="round"
      />

      {/* Ears */}
      <ellipse cx="32" cy="80" rx="6" ry="9" fill="url(#cg-skin)" />
      <ellipse cx="108" cy="80" rx="6" ry="9" fill="url(#cg-skin)" />

      {/* Blush */}
      <ellipse cx="44" cy="92" rx="12" ry="7" fill="url(#cg-cheek)" />
      <ellipse cx="96" cy="92" rx="12" ry="7" fill="url(#cg-cheek)" />

      {/* Eyes */}
      <ellipse cx="55" cy="79" rx="8" ry="8" fill="white" />
      <ellipse cx="85" cy="79" rx="8" ry="8" fill="white" />
      <circle cx="56" cy="80" r="5" fill="#222" />
      <circle cx="86" cy="80" r="5" fill="#222" />
      <circle cx="58" cy="78" r="2" fill="white" />
      <circle cx="88" cy="78" r="2" fill="white" />

      {/* Eyebrows */}
      <path
        d="M47 70 Q55 66 63 70"
        stroke="#5a3825"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M77 70 Q85 66 93 70"
        stroke="#5a3825"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Nose */}
      <ellipse cx="70" cy="92" rx="4" ry="3" fill="#d4956a" />

      {/* Mouth */}
      {state === "happy" ? (
        <path
          d="M56 105 Q70 120 84 105"
          stroke="#c97b50"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      ) : state === "hurt" ? (
        <path
          d="M56 113 Q70 106 84 113"
          stroke="#c97b50"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M58 107 Q70 115 82 107"
          stroke="#c97b50"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* ── Pimples ── */}
      {PIMPLE_SPOTS.slice(0, pimpleCount).map((spot, i) => (
        <g key={i}>
          {/* outer ring */}
          <circle cx={spot.cx} cy={spot.cy} r={6.5} fill="#fda4af" />
          {/* inner red */}
          <circle cx={spot.cx} cy={spot.cy} r={4.5} fill="#e11d48" />
          {/* whitehead */}
          <circle cx={spot.cx - 1.2} cy={spot.cy - 1.2} r={1.6} fill="white" opacity={0.8} />
        </g>
      ))}
    </svg>
  );
}

// ── Item data ─────────────────────────────────────────────────────────────────
interface ItemDef {
  label: string;
  emoji: string;
  type: "good" | "bad";
  voice: string;
}

const PREK_ITEMS: ItemDef[] = [
  { label: "Staying Active",   emoji: "🏃", type: "good", voice: "Staying Active!" },
  { label: "Sleep Well",       emoji: "😴", type: "good", voice: "Sleep Well!" },
  { label: "Drinking Water",   emoji: "💧", type: "good", voice: "Drinking Water!" },
  { label: "Junk Food",        emoji: "🍔", type: "bad",  voice: "Junk Food!" },
  { label: "Not Enough Sleep", emoji: "😵", type: "bad",  voice: "Not enough sleep!" },
];

const OLDER_ITEMS: ItemDef[] = [
  { label: "Wash Hands",            emoji: "🧼", type: "good", voice: "Washing hands!" },
  { label: "Anytime Foods",         emoji: "🥗", type: "good", voice: "Anytime foods!" },
  { label: "Exercise Daily",        emoji: "💪", type: "good", voice: "Exercise one hour a day!" },
  { label: "Drink Water",           emoji: "💧", type: "good", voice: "Drink water!" },
  { label: "Clean & Disinfect",     emoji: "🧹", type: "good", voice: "Clean and disinfect!" },
  { label: "Not Enough Sleep",      emoji: "🌙", type: "bad",  voice: "Not enough sleep!" },
  { label: "Too Much Sugar",        emoji: "🍬", type: "bad",  voice: "Too much sugar!" },
  { label: "Ignore Family History", emoji: "🏥", type: "bad",  voice: "Ignoring family health history!" },
  { label: "Junk Food",             emoji: "🍔", type: "bad",  voice: "Eating junk food!" },
  { label: "Limit Exercise",        emoji: "🛋️", type: "bad",  voice: "Limiting exercise!" },
];

// ── Falling item type ─────────────────────────────────────────────────────────
interface FallingItem extends ItemDef {
  id: number;
  x: number; y: number; speed: number;
  isDragging: boolean; dragOffX: number; dragOffY: number;
  removed: boolean;
}

// ── Main component ────────────────────────────────────────────────────────────
export function HabitGuardGame(): React.JSX.Element {
  const location = useLocation();
  const { trackEvent } = useGameUser();
  const backTo =
    new URLSearchParams(location.search).get("from") === "set1"
      ? "/know-your-health-set1"
      : "/know-your-health/module-6";

  const [phase, setPhase]           = useState<"start" | "playing" | "end">("start");
  const [mode,  setMode]            = useState<"prek" | "older">("prek");
  const [score, setScore]           = useState(0);
  const [pimpleCount, setPimpleCount] = useState(0);
  const [goodCollected, setGoodCollected] = useState(0);
  const [goodTotal,     setGoodTotal]     = useState(0);
  const [charState, setCharState]   = useState<"normal" | "happy" | "hurt">("normal");

  const containerRef    = useRef<HTMLDivElement>(null);
  const itemsRef        = useRef<FallingItem[]>([]);
  const [, forceRender] = useState(0);
  const rafRef          = useRef(0);
  const lastTsRef       = useRef(0);
  const idCtrRef        = useRef(0);

  // Mutable refs — avoid stale closures in RAF
  const scoreRef         = useRef(0);
  const pimpleRef        = useRef(0);
  const goodCollectedRef = useRef(0);
  const goodTotalRef     = useRef(0);
  const phaseRef         = useRef<"playing" | "ended">("playing");
  const spawnQueueRef    = useRef<ItemDef[]>([]);
  const nextSpawnRef     = useRef(0);
  const charTimerRef     = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const modeRef          = useRef<"prek" | "older">("prek");

  function flashChar(s: "happy" | "hurt") {
    if (charTimerRef.current) clearTimeout(charTimerRef.current);
    setCharState(s);
    charTimerRef.current = setTimeout(() => setCharState("normal"), 700);
  }

  function addPimple() {
    pimpleRef.current = Math.min(pimpleRef.current + 1, MAX_PIMPLES);
    setPimpleCount(pimpleRef.current);
  }
  function removePimple() {
    pimpleRef.current = Math.max(pimpleRef.current - 1, 0);
    setPimpleCount(pimpleRef.current);
  }

  const startGame = useCallback((m: "prek" | "older") => {
    cancelAnimationFrame(rafRef.current);
    setMode(m); modeRef.current = m;
    scoreRef.current = 0;
    pimpleRef.current = 0;
    goodCollectedRef.current = 0; phaseRef.current = "playing";
    itemsRef.current = []; lastTsRef.current = 0;

    const items = m === "prek" ? PREK_ITEMS : OLDER_ITEMS;
    const tot = items.filter(i => i.type === "good").length;
    goodTotalRef.current = tot;

    setScore(0); setPimpleCount(0);
    setGoodCollected(0); setGoodTotal(tot); setCharState("normal");
    spawnQueueRef.current = [...items].sort(() => Math.random() - 0.5);
    nextSpawnRef.current = 0;

    speak("Habits are falling! Drag good habits to the character to heal pimples. Drag bad habits away!");
    setPhase("playing");
  }, []);

  // ── RAF game loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;

    function loop(ts: number) {
      if (phaseRef.current === "ended") return;

      const dt = lastTsRef.current === 0 ? 0 : Math.min((ts - lastTsRef.current) / 1000, 0.06);
      lastTsRef.current = ts;

      const container = containerRef.current;
      if (!container) { rafRef.current = requestAnimationFrame(loop); return; }
      const cw = container.offsetWidth, ch = container.offsetHeight;

      // Spawn
      if (spawnQueueRef.current.length > 0 && ts >= nextSpawnRef.current) {
        const def = spawnQueueRef.current.shift()!;
        const pad = 14;
        // Spawn close to the character but just outside its hit zone (32%–68%).
        // Item right edge stops ~10px before charLeft; item left edge starts ~10px after charRight.
        // Random ±25px variation so items feel natural, not robotic.
        const GAP      = 10;
        const jitter   = Math.random() * 25;
        const spawnLeft = Math.random() < 0.5;
        const leftX    = Math.max(pad, cw * 0.32 - ITEM_SIZE - GAP - jitter);
        const rightX   = Math.min(cw - ITEM_SIZE - pad, cw * 0.68 + GAP + jitter);
        const spawnX   = spawnLeft ? leftX : rightX;
        itemsRef.current = [
          ...itemsRef.current,
          {
            ...def,
            id: ++idCtrRef.current,
            x: spawnX,
            y: -ITEM_SIZE - 8,
            speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
            isDragging: false, dragOffX: 0, dragOffY: 0, removed: false,
          },
        ];
        nextSpawnRef.current = ts + SPAWN_MS;
        speak(def.voice);
      }

      // Items just fall — no effect when they reach the bottom or character
      itemsRef.current = itemsRef.current.map(item => {
        if (item.removed || item.isDragging) return item;
        const ny = item.y + item.speed * dt;
        // Fell off screen — silently remove, no effect
        if (ny > ch + 10) return { ...item, y: ny, removed: true };
        return { ...item, y: ny };
      });

      // End game when all items have spawned and fallen off / been handled
      const allSpawned = spawnQueueRef.current.length === 0;
      const allGone    = itemsRef.current.every(i => i.removed);
      if (allSpawned && allGone) {
        phaseRef.current = "ended";
        setPhase("end");
        trackEvent({ gameId: GAME_ID, event: "game_completed", score: scoreRef.current });
        speak(pimpleRef.current === 0
          ? "Amazing! You have a clear, healthy face!"
          : "Good try! Drag more good habits to heal your pimples next time!");
        return;
      }

      forceRender(n => n + 1);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [phase, trackEvent]);

  // ── Drag handlers ────────────────────────────────────────────────────────────
  function onPtrDown(e: React.PointerEvent, id: number) {
    e.preventDefault(); e.stopPropagation();
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = e.clientX - r.left, py = e.clientY - r.top;
    itemsRef.current = itemsRef.current.map(it =>
      it.id === id && !it.removed
        ? { ...it, isDragging: true, dragOffX: px - it.x, dragOffY: py - it.y }
        : it
    );
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    forceRender(n => n + 1);
  }

  function onPtrMove(e: React.PointerEvent, id: number) {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    const px = e.clientX - r.left, py = e.clientY - r.top;
    itemsRef.current = itemsRef.current.map(it =>
      it.id === id && it.isDragging ? { ...it, x: px - it.dragOffX, y: py - it.dragOffY } : it
    );
    forceRender(n => n + 1);
  }

  function onPtrUp(_e: React.PointerEvent, id: number) {
    const container = containerRef.current;
    if (!container) return;
    const cw = container.offsetWidth, ch = container.offsetHeight;

    // Character occupies center — hit zone: middle 36% wide, middle 62% tall
    const charLeft   = cw * 0.32;
    const charRight  = cw * 0.68;
    const charTop    = ch * 0.19;
    const charBottom = ch * 0.81;

    itemsRef.current = itemsRef.current.map(it => {
      if (it.id !== id || !it.isDragging) return it;

      const cx = it.x + ITEM_SIZE / 2;
      const cy = it.y + ITEM_SIZE / 2;

      const onCharacter = cx > charLeft && cx < charRight && cy > charTop && cy < charBottom;

      if (onCharacter) {
        if (it.type === "good") {
          scoreRef.current += 10;
          setScore(scoreRef.current);
          goodCollectedRef.current++;
          setGoodCollected(goodCollectedRef.current);
          removePimple();
          flashChar("happy"); playGood();
          speak("Great! That good habit keeps you healthy!");
        } else {
          addPimple(); flashChar("hurt"); playBad();
          speak("Oh no! That bad habit caused a pimple! Drag it away next time!");
        }
        return { ...it, isDragging: false, removed: true };
      }

      // Released off character — stays in play, resumes falling
      return { ...it, isDragging: false };
    });
    forceRender(n => n + 1);
  }

  // ── Start screen ─────────────────────────────────────────────────────────────
  if (phase === "start") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)" }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full mx-4 text-center">
          <Logo size="md" className="mx-auto mb-4" />
          <div style={{ fontSize: "3.5rem" }}>🛡️</div>
          <h1 className="text-3xl font-black text-gray-800 mb-1 mt-1">Guard Your Health!</h1>
          <p className="text-gray-600 mb-3 text-sm leading-relaxed">
            Habits fall from the sky on both sides!<br />
            <span className="text-green-600 font-bold">🟢 Drag good habits</span> onto the character to earn points and heal pimples.<br />
            <span className="text-red-500 font-bold">🔴 Drag bad habits</span> away from the character — or they cause pimples!
          </p>
          <div className="flex gap-3 justify-center mb-5 text-sm flex-wrap">
            <div className="flex items-center gap-1 bg-green-50 rounded-xl px-3 py-2 border border-green-300">
              <span>🟢</span><span className="text-green-700 font-semibold">Drag to character = heals</span>
            </div>
            <div className="flex items-center gap-1 bg-red-50 rounded-xl px-3 py-2 border border-red-300">
              <span>🔴</span><span className="text-red-700 font-semibold">Drops on character = pimple</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-gray-500 text-sm font-semibold">Choose your grade:</p>
            <button
              onClick={() => startGame("prek")}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #f97316, #fbbf24)" }}
            >
              🌟 PreK – 2nd Grade
            </button>
            <button
              onClick={() => startGame("older")}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
            >
              🚀 3rd – 8th Grade
            </button>
          </div>
          <Link to={backTo} className="mt-5 inline-block text-gray-400 hover:text-gray-600 text-sm">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  if (phase === "end") {
    const perfect = pimpleCount === 0;
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: perfect
            ? "linear-gradient(135deg, #22c55e 0%, #0ea5e9 100%)"
            : "linear-gradient(135deg, #f97316 0%, #7c3aed 100%)",
        }}
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
          <div style={{ fontSize: "5rem" }}>{perfect ? "🏆" : "💪"}</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            {perfect ? "Healthy & Clear!" : "Good Try!"}
          </h2>
          <p className="text-gray-600 mb-1">
            {perfect
              ? "No pimples — your face is glowing!"
              : `${pimpleCount} pimple${pimpleCount > 1 ? "s" : ""} — drag more good habits next time!`}
          </p>
          <div className="flex justify-center gap-6 mb-6 mt-3">
            <div className="text-center">
              <div className="text-3xl font-black text-green-600">{score}</div>
              <div className="text-xs text-gray-500 font-semibold">pts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600">{goodCollected}/{goodTotal}</div>
              <div className="text-xs text-gray-500 font-semibold">good habits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-red-500">{pimpleCount}</div>
              <div className="text-xs text-gray-500 font-semibold">pimples</div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => startGame(mode)}
              className="w-full py-3 rounded-2xl text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              style={{ background: "linear-gradient(135deg, #22c55e, #0ea5e9)" }}
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

  // ── Playing screen ────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #bae6fd 0%, #e0f2fe 50%, #dcfce7 80%, #86efac 100%)",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <style>{`
        @keyframes cloudMove { from { transform: translateX(-160px); } to { transform: translateX(108vw); } }
      `}</style>

      {/* Clouds */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${6 + i * 9}%`,
            fontSize: "3rem",
            opacity: 0.4,
            pointerEvents: "none",
            animation: `cloudMove ${17 + i * 7}s linear infinite`,
            animationDelay: `${-i * 5}s`,
          }}
        >
          ☁️
        </div>
      ))}

      {/* HUD — top center */}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          alignItems: "center",
          zIndex: 10,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 14,
            padding: "6px 14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
          }}
        >
          <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#1e3a5f" }}>{score} pts</div>
          <div style={{ fontSize: "0.78rem", color: "#374151", fontWeight: 700 }}>
            ✅ {goodCollected}/{goodTotal} good
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 14,
            padding: "6px 14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "#be123c" }}>🔴 {pimpleCount}</div>
          <div style={{ fontSize: "0.78rem", color: "#374151", fontWeight: 700 }}>pimples</div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            borderRadius: 12,
            padding: "6px 10px",
            fontSize: "0.78rem",
            color: "#1f2937",
            fontWeight: 700,
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
            lineHeight: 1.5,
          }}
        >
          <div>🟢 Drag <b>good</b> → character</div>
          <div>🔴 Drag <b>bad</b> → away!</div>
        </div>
      </div>

      {/* Character — vertically centered */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CharacterSVG state={charState} pimpleCount={pimpleCount} />
      </div>

      {/* Falling items */}
      {itemsRef.current
        .filter(it => !it.removed)
        .map(it => (
          <div
            key={it.id}
            onPointerDown={e => onPtrDown(e, it.id)}
            onPointerMove={e => onPtrMove(e, it.id)}
            onPointerUp={e => onPtrUp(e, it.id)}
            style={{
              position: "absolute",
              left: it.x,
              top: it.y,
              width: ITEM_SIZE,
              height: ITEM_SIZE,
              background:
                it.type === "good"
                  ? "linear-gradient(135deg, #d1fae5, #a7f3d0)"
                  : "linear-gradient(135deg, #fee2e2, #fca5a5)",
              border: `4px solid ${it.type === "good" ? "#16a34a" : "#dc2626"}`,
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              overflow: "hidden",
              boxShadow: it.isDragging
                ? `0 16px 36px rgba(0,0,0,0.4), 0 0 0 5px ${it.type === "good" ? "#16a34a" : "#dc2626"}`
                : "0 5px 16px rgba(0,0,0,0.24)",
              transform: it.isDragging ? "scale(1.13) rotate(4deg)" : "none",
              transition: it.isDragging ? "none" : "box-shadow 0.2s",
              zIndex: it.isDragging ? 20 : 8,
              cursor: it.isDragging ? "grabbing" : "grab",
              touchAction: "none",
            }}
          >
            <div style={{ fontSize: "3.5rem", lineHeight: 1, pointerEvents: "none" }}>{it.emoji}</div>
            <div
              style={{
                fontSize: "1.0rem",
                fontWeight: 900,
                color: it.type === "good" ? "#14532d" : "#7f1d1d",
                textAlign: "center",
                maxWidth: "72%",
                lineHeight: 1.25,
                pointerEvents: "none",
                letterSpacing: "-0.01em",
              }}
            >
              {it.label}
            </div>
            {/* Badge inside circle at bottom */}
            <div
              style={{
                padding: "2px 12px",
                borderRadius: 20,
                background: it.type === "good" ? "#16a34a" : "#dc2626",
                fontSize: "0.72rem",
                color: "white",
                fontWeight: 900,
                letterSpacing: "0.05em",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                marginTop: 2,
              }}
            >
              {it.type === "good" ? "GOOD" : "BAD"}
            </div>
          </div>
        ))}
    </div>
  );
}
