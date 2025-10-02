import React, { useState, useEffect } from "react";

// Import fruit images
import appleImg from "../fruits_images/apple.jpeg";
import bananaImg from "../fruits_images/banana.jpeg";
import grapesImg from "../fruits_images/grapes.jpeg";
import kiwiImg from "../fruits_images/kiwi.jpeg";
import mangoImg from "../fruits_images/mango.jpeg";
import orangeImg from "../fruits_images/orange.jpeg";
import pineappleImg from "../fruits_images/pineapple.jpeg";
import pomegranateImg from "../fruits_images/pomogranete.jpeg";
import strawberryImg from "../fruits_images/Strawberry.jpeg";
import watermelonImg from "../fruits_images/watermelon.jpeg";

// Import vegetable images
import broccoliImg from "../vegetable_images/brocolli.jpeg";
import cabbageImg from "../vegetable_images/cabbage.jpeg";
import carrotImg from "../vegetable_images/carrot.jpeg";
import cauliflowerImg from "../vegetable_images/cauliflower.jpeg";
import cucumberImg from "../vegetable_images/cucumber.jpeg";
import greenBeansImg from "../vegetable_images/green beans.jpeg";
import mushroomImg from "../vegetable_images/mushroom.jpeg";
import onionImg from "../vegetable_images/onion.jpeg";
import peppersImg from "../vegetable_images/peppers.jpeg";
import spinachImg from "../vegetable_images/spinach.jpeg";

interface Item {
  id: number;
  name: string;
  type: "fruit" | "vegetable";
  image: string;
}

const fruits: Item[] = [
  { id: 1, name: "Apple", type: "fruit", image: appleImg },
  { id: 2, name: "Banana", type: "fruit", image: bananaImg },
  { id: 3, name: "Grapes", type: "fruit", image: grapesImg },
  { id: 4, name: "Kiwi", type: "fruit", image: kiwiImg },
  { id: 5, name: "Mango", type: "fruit", image: mangoImg },
  { id: 6, name: "Orange", type: "fruit", image: orangeImg },
  { id: 7, name: "Pineapple", type: "fruit", image: pineappleImg },
  { id: 8, name: "Pomegranate", type: "fruit", image: pomegranateImg },
  { id: 9, name: "Strawberry", type: "fruit", image: strawberryImg },
  { id: 10, name: "Watermelon", type: "fruit", image: watermelonImg },
];

const vegetables: Item[] = [
  { id: 11, name: "Broccoli", type: "vegetable", image: broccoliImg },
  { id: 12, name: "Cabbage", type: "vegetable", image: cabbageImg },
  { id: 13, name: "Carrot", type: "vegetable", image: carrotImg },
  { id: 14, name: "Cauliflower", type: "vegetable", image: cauliflowerImg },
  { id: 15, name: "Cucumber", type: "vegetable", image: cucumberImg },
  { id: 16, name: "Green Beans", type: "vegetable", image: greenBeansImg },
  { id: 17, name: "Mushroom", type: "vegetable", image: mushroomImg },
  { id: 18, name: "Onion", type: "vegetable", image: onionImg },
  { id: 19, name: "Peppers", type: "vegetable", image: peppersImg },
  { id: 20, name: "Spinach", type: "vegetable", image: spinachImg },
];

export function FruitVegetableGame(): React.JSX.Element {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [remainingItems, setRemainingItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [fruitsColumn, setFruitsColumn] = useState<Item[]>([]);
  const [vegetablesColumn, setVegetablesColumn] = useState<Item[]>([]);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);

  // Initialize game
  const startGame = (): void => {
    const allItems = [...fruits, ...vegetables];
    const shuffled = allItems.sort(() => Math.random() - 0.5);
    setRemainingItems(shuffled);
    setCurrentItem(shuffled[0]);
    setScore(0);
    setTimeLeft(40);
    setGameOver(false);
    setGameStarted(true);
    setFruitsColumn([]);
    setVegetablesColumn([]);
    setFeedback(null);
  };

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameStarted) {
      setGameOver(true);
    }
  }, [gameStarted, gameOver, timeLeft]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>): void => {
    if (currentItem) {
      setDraggedItem(currentItem);
    }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropZone: "fruit" | "vegetable"
  ): void => {
    e.preventDefault();
    if (!draggedItem || !currentItem) return;

    const isCorrect = draggedItem.type === dropZone;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setFeedback("correct");
      if (dropZone === "fruit") {
        setFruitsColumn((prev) => [...prev, draggedItem]);
      } else {
        setVegetablesColumn((prev) => [...prev, draggedItem]);
      }
    } else {
      setFeedback("wrong");
    }

    // Show feedback briefly then move to next item
    setTimeout(() => {
      setFeedback(null);
      const nextItems = remainingItems.slice(1);
      if (nextItems.length > 0) {
        setCurrentItem(nextItems[0]);
        setRemainingItems(nextItems);
      } else {
        setGameOver(true);
      }
    }, 500);

    setDraggedItem(null);
  };

  // Restart game
  const restartGame = (): void => {
    startGame();
  };

  // Back to menu
  const backToMenu = (): void => {
    setGameStarted(false);
    setGameOver(false);
  };

  // Menu screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-orange-100 flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
          <div className="text-8xl mb-6">🍎🥕</div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            Fruit & Vegetable Matching Game
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Drag fruits and vegetables to their correct columns! Earn 10 points
            for each correct match. You have 40 seconds to complete as many as
            you can!
          </p>
          <button
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-green-500 to-orange-500 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            🎮 Start Game! 🎮
          </button>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    const totalItems = fruits.length + vegetables.length;
    const itemsCompleted = totalItems - remainingItems.length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-2xl text-center">
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Game Over!
          </h1>
          <div className="mb-8">
            <p className="text-4xl font-bold text-green-600 mb-4">
              Final Score: {score} points
            </p>
            <p className="text-2xl text-gray-700">
              Items Completed: {itemsCompleted} / {totalItems}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={restartGame}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🔄 Play Again
            </button>
            <button
              onClick={backToMenu}
              className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-xl font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🏠 Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        feedback === "correct"
          ? "bg-green-400"
          : feedback === "wrong"
          ? "bg-red-400"
          : "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100"
      }`}
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-purple-600">
            Score: {score}
          </div>
          <div className="text-3xl font-bold text-blue-600">
            Time: {timeLeft}s
          </div>
          <button
            onClick={backToMenu}
            className="px-6 py-2 bg-gray-500 text-white font-bold rounded-full hover:bg-gray-600 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>

      {/* Main game area */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          {/* Vegetables Column */}
          <div
            className="bg-green-200/50 rounded-3xl p-6 border-4 border-green-400 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "vegetable")}
          >
            <h2 className="text-3xl font-bold text-green-800 mb-4 text-center">
              🥕 Vegetables
            </h2>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {vegetablesColumn.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-2 shadow-md flex flex-col items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <span className="font-semibold text-gray-700 text-sm mt-1 text-center">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center - Current Item */}
          <div className="flex items-center justify-center">
            {currentItem && (
              <div
                draggable
                onDragStart={handleDragStart}
                className="bg-white rounded-3xl p-8 shadow-2xl cursor-move hover:scale-105 transition-transform"
              >
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-64 h-64 object-cover rounded-2xl mb-4"
                />
                <p className="text-2xl font-bold text-center text-gray-800">
                  {currentItem.name}
                </p>
                <p className="text-center text-gray-600 mt-2">
                  Drag me to the correct column!
                </p>
              </div>
            )}
          </div>

          {/* Fruits Column */}
          <div
            className="bg-orange-200/50 rounded-3xl p-6 border-4 border-orange-400 flex flex-col"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "fruit")}
          >
            <h2 className="text-3xl font-bold text-orange-800 mb-4 text-center">
              🍎 Fruits
            </h2>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {fruitsColumn.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-2 shadow-md flex flex-col items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <span className="font-semibold text-gray-700 text-sm mt-1 text-center">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
