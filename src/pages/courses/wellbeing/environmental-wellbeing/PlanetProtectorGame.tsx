import React, { useState, useEffect } from "react";

type FallingItem = {
  id: number;
  type: "good" | "bad";
  x: number;
  y: number;
  text: string;
};

const GAME_DURATION = 30;
const ITEM_FALL_SPEED = 2;
const ITEM_SPAWN_INTERVAL = 2500;

const TILE_WIDTH = 120;
const TILE_HEIGHT = 40;

const goodItems = [
  "Plant trees",
  "Turning off lights",
  "Biking/walking",
  "Saving water",
  "Picking up trash",
];

const badItems = [
  "Leaving lights on",
  "Driving cars unnecessarily",
  "Throwing trash on the ground",
  "Wasting water",
  "Pollution/smoke",
];

const PlanetProtectorGame: React.FC = () => {
  const [items, setItems] = useState<FallingItem[]>([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);

  const CONTAINER_HEIGHT = 420;
  const EARTH_HEIGHT = 120;
  const EARTH_TOP = CONTAINER_HEIGHT - EARTH_HEIGHT;

  // Spawn items
  useEffect(() => {
    if (gameOver) return;
    const spawnInterval = setInterval(() => {
      const id = Date.now();
      const type = Math.random() < 0.4 ? "good" : "bad";
      const x = Math.random() * (320 - TILE_WIDTH);
      const text =
        type === "good"
          ? goodItems[Math.floor(Math.random() * goodItems.length)]
          : badItems[Math.floor(Math.random() * badItems.length)];

      setItems((prev) => [...prev, { id, type, x, y: 0, text }]);
    }, ITEM_SPAWN_INTERVAL);

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  // Falling animation + Earth collision
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setItems((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + ITEM_FALL_SPEED }))
          .filter((item) => {
            if (item.y + TILE_HEIGHT >= EARTH_TOP) {
              if (item.type === "good") setScore((s) => s + 1);
              if (item.type === "bad") setScore((s) => s - 1);
              return false;
            }
            return true;
          })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Timer
  useEffect(() => {
    if (gameOver) return;
    if (timer <= 0) {
      setGameOver(true);
      return;
    }
    const t = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(t);
  }, [timer, gameOver]);

  // Drag preview
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, text: string) => {
    e.dataTransfer.setData("text/plain", text);

    const ghost = document.createElement("div");
    ghost.innerText = text;
    ghost.style.width = TILE_WIDTH + "px";
    ghost.style.height = TILE_HEIGHT + "px";
    ghost.style.display = "flex";
    ghost.style.alignItems = "center";
    ghost.style.justifyContent = "center";
    ghost.style.background = "white";
    ghost.style.borderRadius = "6px";
    ghost.style.fontSize = "12px";
    ghost.style.boxShadow = "0 2px 6px rgba(0,0,0,.25)";
    ghost.style.position = "absolute";
    ghost.style.top = "-1000px";

    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, TILE_WIDTH / 2, TILE_HEIGHT / 2);

    setTimeout(() => document.body.removeChild(ghost), 0);
  };

  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    e.preventDefault();
    setItems((prev) => prev.filter((i) => i.id !== id));
    setScore((s) => s + 2);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 p-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">🌍 Environmental Wellbeing</h1>
      <p className="text-lg mb-2 text-center">
        Let good actions naturally reach Earth for +1 point and stop the bad actions for +1 point!  
        </p>
      <p className="text-lg mb-4 text-center">
        Bonus: Drag good actions from the right onto bad actions to cancel out the bad for +2 points!
      </p>

      <div className="flex">
        {/* Game */}
        <div className="relative w-[320px] h-[420px] bg-blue-100 border rounded p-2 overflow-hidden">
          <div className="flex justify-between mb-2">
            <div>🌟 {score}</div>
            <div>⏰ {timer}s</div>
          </div>

          {!gameOver &&
            items.map((item) => (
              <div
                key={item.id}
                className="absolute bg-white rounded shadow flex items-center justify-center text-center cursor-pointer text-sm"
                style={{
                  left: item.x,
                  top: item.y,
                  width: TILE_WIDTH,
                  height: TILE_HEIGHT,
                }}
                onClick={() => {
                  if (item.type === "bad") setScore((s) => s + 1);
                  setItems((prev) => prev.filter((i) => i.id !== item.id));
                }}
                onDrop={(e) => handleDrop(e, item.id)}
                onDragOver={allowDrop}
              >
                {item.text}
              </div>
            ))}

          {/* Earth */}
          <div className="absolute bottom-0 left-0 w-full h-[120px] overflow-hidden">
            <div
              className="text-center"
              style={{
                fontSize: "20rem",
                lineHeight: "1",
                transform: "translateY(10%)",
              }}
            >
              🌍
            </div>
          </div>

          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70">
              <h2 className="text-xl font-bold">🎉 Game Over! 🎉</h2>
              <p>Your Planet Score: {score}</p>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="ml-4 flex flex-col h-[420px]">
          {goodItems.map((text) => (
            <div
              key={text}
              draggable
              onDragStart={(e) => handleDragStart(e, text)}
              className="bg-green-200 rounded shadow mb-2 flex items-center justify-center cursor-grab"
              style={{ height: "20%", fontSize: "1.4rem" }}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanetProtectorGame;
