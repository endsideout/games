import React, { useState, useEffect } from "react";

type FallingItem = {
  id: number;
  type: "good" | "bad";
  x: number;
  y: number;
  text: string;
};

const GAME_DURATION = 30; // seconds
const ITEM_FALL_SPEED = 2; // pixels per 50ms
const ITEM_SPAWN_INTERVAL = 2500; // slower spawn rate

const goodItems = [
  "Plant trees",
  "Solar panels",
  "Biking/walking",
  "Saving water",
  "Composting/recycling",
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

  // Spawn items
  useEffect(() => {
    if (gameOver) return;
    const spawnInterval = setInterval(() => {
      const id = Date.now();
      const type = Math.random() < 0.4 ? "good" : "bad"; // 40% good, 60% bad
      const x = Math.random() * 250; // game width
      const text =
        type === "good"
          ? goodItems[Math.floor(Math.random() * goodItems.length)]
          : badItems[Math.floor(Math.random() * badItems.length)];

      setItems((prev) => [...prev, { id, type, x, y: 0, text }]);
    }, ITEM_SPAWN_INTERVAL);

    return () => clearInterval(spawnInterval);
  }, [gameOver]);

  // Animate falling
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setItems((prev) =>
        prev
          .map((item) => ({ ...item, y: item.y + ITEM_FALL_SPEED }))
          .filter((item) => {
            // bottom of the game container (Earth) is at y=400
            if (item.type === "good" && item.y + 24 >= 400) {
              setScore((s) => s + 1);
              return false;
            }
            if (item.type === "bad" && item.y + 24 >= 400) {
              setScore((s) => s - 1);
              return false;
            }
            return true;
          })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Timer countdown
  useEffect(() => {
    if (gameOver) return;
    if (timer <= 0) {
      setGameOver(true);
      return;
    }
    const timerInterval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(timerInterval);
  }, [timer, gameOver]);

  // Drag & drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, text: string) => {
    e.dataTransfer.setData("text/plain", text);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, itemId: number) => {
    e.preventDefault();
    e.dataTransfer.getData("text/plain");
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setScore((s) => s + 2);
  };
  const allowDrop = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50 p-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">🌍 Environmental Wellbeing</h1>
      <p className="text-lg mb-2 text-center">
        Let good actions naturally reach Earth for +1 point.
      </p>
      <p className="text-lg mb-4 text-center">
        Click on bad actions to stop them for +1 point.  
        Bonus: Drag good actions from the right onto bad actions to neutralize them for +2 points!
      </p>

      {/* Game area + side panel */}
      <div className="flex">
        {/* Game container */}
        <div className="relative w-[320px] h-[420px] bg-blue-100 rounded-lg overflow-hidden border p-2">
          {/* Score & Timer */}
          <div className="flex justify-between mb-2">
            <div>🌟 Score: {score}</div>
            <div>⏰ Time: {timer}s</div>
          </div>

          {/* Falling items */}
          {!gameOver &&
            items.map((item) => (
              <div
                key={item.id}
                className="absolute bg-white px-2 py-1 rounded shadow select-none cursor-pointer text-sm"
                style={{ left: item.x, top: item.y }}
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

          {/* Half Earth at bottom (full width of container) */}
<div
  className="absolute bottom-0 left-0 overflow-hidden w-full"
  style={{ height: "120px" }} // height of visible Earth
>
  <div
    className="text-center"
    style={{
      fontSize: "20rem",      // very large emoji
      lineHeight: "1",
      transform: "translateY(10%)", // shift down so top half shows
    }}
  >
    🌍
  </div>
</div>


          {/* Game Over */}
          {gameOver && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <h2 className="text-xl font-bold mb-2">🎉 Game Over! 🎉</h2>
              <p className="text-lg">Your Planet Score: {score}</p>
            </div>
          )}
        </div>

        {/* Right panel: draggable good items (full height) */}
        <div className="ml-4 flex flex-col h-[420px]">
          {goodItems.map((text) => (
            <div
              key={text}
              className="bg-green-200 rounded shadow cursor-grab select-none flex items-center justify-center text-2xl mb-2 px-2"
              style={{
                height: `${100 / goodItems.length}%`,
                fontSize: "1.5rem",
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, text)}
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
