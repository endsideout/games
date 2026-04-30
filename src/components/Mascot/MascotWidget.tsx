import React, { useState, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { useLocation } from "react-router-dom";
import { MascotCharacter } from "./MascotScene";
import { GAME_INSTRUCTIONS } from "./gameInstructions";

const HINT_DELAY_MS = 6000;

export function MascotWidget() {
  const location                          = useLocation();
  const [isTalking,     setIsTalking]    = useState(false);
  const [message,       setMessage]      = useState("");
  const [emoji,         setEmoji]        = useState("⭐");
  const [visible,       setVisible]      = useState(false);
  const [minimized,     setMinimized]    = useState(false);
  const [bubbleOpen,    setBubbleOpen]   = useState(true);
  const [characterHidden, setCharacterHidden] = useState(false);
  const [showHint,      setShowHint]     = useState(false);

  const audioRef      = useRef<HTMLAudioElement | null>(null);
  const currentAudio  = useRef<string>("");
  const hintTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHintTimer = useCallback(() => {
    if (hintTimer.current) {
      clearTimeout(hintTimer.current);
      hintTimer.current = null;
    }
  }, []);

  const startHintTimer = useCallback(() => {
    clearHintTimer();
    hintTimer.current = setTimeout(() => setShowHint(true), HINT_DELAY_MS);
  }, [clearHintTimer]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended  = null;
      audioRef.current.onerror  = null;
    }
    setIsTalking(false);
  }, []);

  const playClip = useCallback((src: string) => {
    stopAudio();
    clearHintTimer();
    setCharacterHidden(false);
    setShowHint(false);

    const audio = new Audio(src);
    audioRef.current = audio;

    audio.onplay  = () => setIsTalking(true);
    audio.onerror = () => setIsTalking(false);
    audio.onended = () => {
      setIsTalking(false);
      setCharacterHidden(true);
      startHintTimer();
    };

    audio.play().catch(() => setIsTalking(false));
  }, [stopAudio, clearHintTimer, startHintTimer]);

  // On route change: reset and play game-specific audio
  useEffect(() => {
    stopAudio();
    clearHintTimer();
    setCharacterHidden(false);
    setShowHint(false);

    const instruction = GAME_INSTRUCTIONS[location.pathname];
    if (!instruction) {
      setVisible(false);
      return;
    }

    setVisible(true);
    setMinimized(false);
    setBubbleOpen(true);
    setMessage(instruction.text);
    setEmoji(instruction.emoji);
    currentAudio.current = instruction.audio;

    const timer = setTimeout(() => playClip(instruction.audio), 900);
    return () => {
      clearTimeout(timer);
      stopAudio();
      clearHintTimer();
    };
  }, [location.pathname, playClip, stopAudio, clearHintTimer]);

  const handleHelp = useCallback(() => {
    clearHintTimer();
    setShowHint(false);
    setMinimized(false);
    setBubbleOpen(true);
    playClip(currentAudio.current);
  }, [clearHintTimer, playClip]);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes mascot-pulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 3px 10px rgba(255,140,66,0.35); }
          50%       { transform: scale(1.12); box-shadow: 0 6px 22px rgba(255,140,66,0.75); }
        }
      `}</style>

      <div
        style={{
          position:      "fixed",
          bottom:        20,
          left:          20,
          zIndex:        9999,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "flex-start",
          pointerEvents: "none",
        }}
      >
        {/* Speech bubble */}
        {!minimized && bubbleOpen && !characterHidden && (
          <div
            style={{
              background:    "white",
              borderRadius:  18,
              padding:       "10px 14px 10px 12px",
              maxWidth:      230,
              marginBottom:  6,
              boxShadow:     "0 6px 24px rgba(0,0,0,0.18)",
              border:        "2.5px solid #FFB347",
              fontSize:      12.5,
              fontWeight:    600,
              color:         "#333",
              lineHeight:    1.45,
              position:      "relative",
              pointerEvents: "auto",
            }}
          >
            <span style={{ marginRight: 5 }}>{emoji}</span>
            {message}

            {/* Bubble tail */}
            <div style={{
              position:    "absolute",
              bottom:      -10,
              left:        28,
              width:       0,
              height:      0,
              borderLeft:  "9px solid transparent",
              borderRight: "9px solid transparent",
              borderTop:   "10px solid #FFB347",
            }} />
            <div style={{
              position:    "absolute",
              bottom:      -7,
              left:        30,
              width:       0,
              height:      0,
              borderLeft:  "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop:   "8px solid white",
            }} />

            <button
              onClick={() => setBubbleOpen(false)}
              style={{
                position:   "absolute",
                top:        4,
                right:      6,
                background: "none",
                border:     "none",
                cursor:     "pointer",
                fontSize:   11,
                color:      "#aaa",
                lineHeight: 1,
                padding:    "2px 4px",
                pointerEvents: "auto",
              }}
            >✕</button>
          </div>
        )}

        {/* 3D Canvas — hidden after audio ends */}
        {!minimized && !characterHidden && (
          <div
            style={{
              width:         160,
              height:        210,
              borderRadius:  20,
              overflow:      "hidden",
              boxShadow:     "0 8px 32px rgba(0,0,0,0.2)",
              background:    "linear-gradient(135deg, #fff9f0 0%, #ffecd2 100%)",
              border:        "3px solid #FFB347",
              pointerEvents: "none",
            }}
          >
            <Canvas
              camera={{ position: [0, 0.6, 6.5], fov: 52 }}
              style={{ width: "100%", height: "100%" }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={1.1} />
              <directionalLight position={[3, 4, 3]} intensity={1.4} />
              <directionalLight position={[-2, 2, -1]} intensity={0.4} color="#ffe0b2" />
              <MascotCharacter isTalking={isTalking} />
            </Canvas>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, marginTop: 6, pointerEvents: "auto" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {!minimized && !characterHidden && (
              <button
                onClick={() => { setBubbleOpen(true); playClip(currentAudio.current); }}
                title="Replay"
                style={{
                  background:   "linear-gradient(135deg, #FFB347, #FF8C42)",
                  border:       "none",
                  borderRadius: 20,
                  padding:      "5px 12px",
                  cursor:       "pointer",
                  fontSize:     13,
                  fontWeight:   700,
                  color:        "white",
                  boxShadow:    "0 3px 10px rgba(255,140,66,0.4)",
                  transition:   "transform 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              >
                🔊 Replay
              </button>
            )}

            <button
              onClick={() => {
                if (minimized) {
                  handleHelp();
                } else {
                  setMinimized(m => !m);
                }
              }}
              style={{
                background:   (minimized || characterHidden)
                  ? "linear-gradient(135deg, #FFB347, #FF8C42)"
                  : "rgba(255,255,255,0.85)",
                border:       "2px solid #FFB347",
                borderRadius: 20,
                padding:      "5px 12px",
                cursor:       "pointer",
                fontSize:     12,
                fontWeight:   700,
                color:        (minimized || characterHidden) ? "white" : "#FF8C42",
                boxShadow:    "0 3px 10px rgba(0,0,0,0.1)",
                transition:   "transform 0.15s",
                animation:    showHint ? "mascot-pulse 1.1s ease-in-out infinite" : "none",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {(minimized || characterHidden) ? "🤖 Help!" : "✕ Hide"}
            </button>
          </div>

          {/* Idle hint */}
          {showHint && !minimized && (
            <div style={{
              fontSize:      11,
              fontWeight:    600,
              color:         "#FF8C42",
              paddingLeft:   4,
              pointerEvents: "none",
              animation:     "mascot-pulse 1.1s ease-in-out infinite",
            }}>
              👆 Tap Help! to replay
            </div>
          )}
        </div>
      </div>
    </>
  );
}
