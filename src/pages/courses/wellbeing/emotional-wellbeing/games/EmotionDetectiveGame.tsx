import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../../../components";

// Import scenario images
import mayaBikeImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/Maya's bike was stolen from the school playground.png";
import johnCakeImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/John's brother ate his piece of birthday cake.png";
import sarahMovieImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/Sarah is watching a scary movie alone at night.png";
import tomPuppyImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/Tom got a puppy for his birthday.png";
import lisaFriendImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/One for this  Lisa's best friend is moving to another city.png";
import alexRaceImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/Alex won first place in the school race.png";
import emmaToyImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/Emma lost her favorite toy at the park.png";
import benNoiseImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/Ben heard a loud noise outside his window at night.png";
import ninaGameImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/Nina's team lost the final game of the season.png";
import davidLunchImg from "../../../../../assets/images/games/emotinalwellbeingscenarios/David's friend shared their lunch with him when he forgot his.png";

interface Scenario {
  id: number;
  text: string;
  image: string;
  options: Array<{
    emoji: string;
    emotion: string;
  }>;
  correctAnswers: string[]; // Can have multiple correct answers
}

const scenarios: Scenario[] = [
  {
    id: 1,
    text: "Maya's bike was stolen from the school playground",
    image: mayaBikeImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😨", emotion: "Scared" },
    ],
    correctAnswers: ["Angry"],
  },
  {
    id: 2,
    text: "John's brother ate his piece of birthday cake",
    image: johnCakeImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😱", emotion: "Surprised" },
    ],
    correctAnswers: ["Angry"],
  },
  {
    id: 3,
    text: "Sarah is watching a scary movie alone at night",
    image: sarahMovieImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😨", emotion: "Scared" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😴", emotion: "Bored" },
    ],
    correctAnswers: ["Scared"],
  },
  {
    id: 4,
    text: "Tom got a puppy for his birthday",
    image: tomPuppyImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😨", emotion: "Scared" },
    ],
    correctAnswers: ["Happy"],
  },
  {
    id: 5,
    text: "Lisa's best friend is moving to another city",
    image: lisaFriendImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😱", emotion: "Surprised" },
    ],
    correctAnswers: ["Sad"],
  },
  {
    id: 6,
    text: "Alex won first place in the school race",
    image: alexRaceImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😎", emotion: "Proud" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😨", emotion: "Scared" },
    ],
    correctAnswers: ["Happy", "Proud"],
  },
  {
    id: 7,
    text: "Emma lost her favorite toy at the park",
    image: emmaToyImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "🤔", emotion: "Confused" },
    ],
    correctAnswers: ["Sad"],
  },
  {
    id: 8,
    text: "Ben heard a loud noise outside his window at night",
    image: benNoiseImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😨", emotion: "Scared" },
      { emoji: "😠", emotion: "Angry" },
      { emoji: "😴", emotion: "Sleepy" },
    ],
    correctAnswers: ["Scared"],
  },
  {
    id: 9,
    text: "Nina's team lost the final game of the season",
    image: ninaGameImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😤", emotion: "Frustrated" },
      { emoji: "😨", emotion: "Scared" },
    ],
    correctAnswers: ["Frustrated"],
  },
  {
    id: 10,
    text: "David's friend shared their lunch with him when he forgot his",
    image: davidLunchImg,
    options: [
      { emoji: "😊", emotion: "Happy" },
      { emoji: "🥰", emotion: "Grateful" },
      { emoji: "😢", emotion: "Sad" },
      { emoji: "😠", emotion: "Angry" },
    ],
    correctAnswers: ["Happy", "Grateful"],
  },
];

export function EmotionDetectiveGame(): React.JSX.Element {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [timeLeft, setTimeLeft] = useState(15);

  const currentScenario = scenarios[currentScenarioIndex];
  const progress = ((currentScenarioIndex + 1) / scenarios.length) * 100;

  // Timer effect
  useEffect(() => {
    if (!showMenu && !gameComplete && feedback === null) {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Time's up! Move to next question
        setFeedback("timeout");
        setScore(Math.max(0, score - 5)); // Lose 5 points for timeout

        setTimeout(() => {
          if (currentScenarioIndex < scenarios.length - 1) {
            setCurrentScenarioIndex(currentScenarioIndex + 1);
            setFeedback(null);
            setSelectedEmotion(null);
            setTimeLeft(15); // Reset timer
          } else {
            setGameComplete(true);
          }
        }, 1500);
      }
    }
  }, [timeLeft, showMenu, gameComplete, feedback, currentScenarioIndex, score]);

  // Reset timer when moving to a new question
  useEffect(() => {
    if (!showMenu && !gameComplete) {
      setTimeLeft(15);
    }
  }, [currentScenarioIndex, showMenu, gameComplete]);

  const handleEmotionClick = (emotion: string): void => {
    setSelectedEmotion(emotion);

    if (currentScenario.correctAnswers.includes(emotion)) {
      setFeedback("correct");
      setScore(score + 10);

      // Move to next scenario after delay
      setTimeout(() => {
        if (currentScenarioIndex < scenarios.length - 1) {
          setCurrentScenarioIndex(currentScenarioIndex + 1);
          setFeedback(null);
          setSelectedEmotion(null);
          setTimeLeft(15); // Reset timer
        } else {
          setGameComplete(true);
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      setScore(Math.max(0, score - 5)); // Lose 5 points but never go below 0

      // Move to next question after showing feedback
      setTimeout(() => {
        if (currentScenarioIndex < scenarios.length - 1) {
          setCurrentScenarioIndex(currentScenarioIndex + 1);
          setFeedback(null);
          setSelectedEmotion(null);
          setTimeLeft(15); // Reset timer
        } else {
          setGameComplete(true);
        }
      }, 1500);
    }
  };

  const handleStartGame = (): void => {
    setShowMenu(false);
    setCurrentScenarioIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedEmotion(null);
    setGameComplete(false);
    setTimeLeft(15);
  };

  const handlePlayAgain = (): void => {
    setShowMenu(false);
    setCurrentScenarioIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedEmotion(null);
    setGameComplete(false);
    setTimeLeft(15);
  };

  const handleBackToMenu = (): void => {
    setShowMenu(true);
    setCurrentScenarioIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedEmotion(null);
    setGameComplete(false);
    setTimeLeft(15);
  };

  // Menu Screen
  if (showMenu) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-4"
        style={{
          background:
            "linear-gradient(135deg, #BA68C8 0%, #E1BEE7 25%, #F8BBD0 50%, #CE93D8 75%, #AB47BC 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="text-center bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-6 border-4 border-purple-400 shadow-2xl max-h-[95vh] overflow-y-auto">
            {/* Logo and Emojis in same row */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Logo size="md" />
              <div className="text-6xl">🔍💭</div>
            </div>

            <h1 className="text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Emotion Detective
            </h1>
            <p className="text-lg text-gray-700 mb-2 leading-relaxed">
              Help identify how people feel in different situations!
            </p>
            <p className="text-base text-gray-600 mb-4">
              Read each scenario carefully and choose the emotion that best
              matches how the person feels.
            </p>

            <div className="bg-purple-50 rounded-2xl p-4 mb-4 border-2 border-purple-300">
              <h2 className="text-xl font-bold text-purple-800 mb-3">
                How to Play:
              </h2>
              <ul className="text-left text-base text-gray-700 space-y-1">
                <li className="flex items-start">
                  <span className="text-xl mr-2">📖</span>
                  <span>Read the scenario about someone's situation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">😊</span>
                  <span>Click on the emotion you think they're feeling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">⏰</span>
                  <span>You have 15 seconds for each question!</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">⭐</span>
                  <span>Get 10 points for each correct answer!</span>
                </li>
                <li className="flex items-start">
                  <span className="text-xl mr-2">❌</span>
                  <span>Lose 5 points for wrong answers or timeout</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleStartGame}
              className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-2xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-3"
            >
              Start Detective Work! 🔍
            </button>

            <div>
              <Link
                to="/emotional-wellbeing"
                className="inline-block px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                ← Back to Emotional Wellbeing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Complete Screen
  if (gameComplete) {
    const maxScore = scenarios.length * 10;
    const percentage = Math.round((score / maxScore) * 100);
    let message = "";
    let emoji = "";

    if (percentage >= 90) {
      message = "Amazing Detective Work!";
      emoji = "🏆";
    } else if (percentage >= 70) {
      message = "Great Job Detective!";
      emoji = "⭐";
    } else if (percentage >= 50) {
      message = "Good Effort!";
      emoji = "👍";
    } else {
      message = "Keep Practicing!";
      emoji = "💪";
    }

    return (
      <div
        className="min-h-screen flex items-center justify-center py-4"
        style={{
          background:
            "linear-gradient(135deg, #BA68C8 0%, #E1BEE7 25%, #F8BBD0 50%, #CE93D8 75%, #AB47BC 100%)",
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        <div className="max-w-3xl mx-auto px-4 w-full">
          <div className="text-center bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-6 border-4 border-yellow-400 shadow-2xl max-h-[95vh] overflow-y-auto">
            <p className="text-5xl mb-4">{emoji}</p>
            <h2 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {message}
            </h2>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4 border-4 border-purple-400">
              <p className="text-3xl font-black text-purple-700 mb-1">
                Final Score: {score} points!
              </p>
              <p className="text-xl text-gray-700">
                You got {percentage}% correct!
              </p>
            </div>

            <div className="bg-pink-50 rounded-2xl p-4 mb-5 border-2 border-pink-300">
              <h3 className="text-xl font-bold text-pink-800 mb-2">
                What You Learned:
              </h3>
              <p className="text-base text-gray-700 leading-relaxed">
                Understanding how others feel is called <strong>empathy</strong>
                . By recognizing emotions, you can be a better friend and help
                others when they need it! 💝
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlayAgain}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                🔍 Play Again
              </button>
              <button
                onClick={handleBackToMenu}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xl font-black rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                📋 Back to Menu
              </button>
              <Link
                to="/emotional-wellbeing"
                className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                ← Back to Emotional Wellbeing
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div
      className="h-screen flex flex-col py-4"
      style={{
        background:
          "linear-gradient(135deg, #BA68C8 0%, #E1BEE7 25%, #F8BBD0 50%, #CE93D8 75%, #AB47BC 100%)",
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex-1 flex flex-col">
        {/* Header with Score, Timer, and Progress */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="bg-white bg-opacity-90 rounded-xl p-2 border-2 border-purple-300 shadow-lg">
              <div className="text-xs font-bold text-purple-600">SCORE</div>
              <div className="text-2xl font-black text-purple-800">{score}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`bg-white bg-opacity-90 rounded-xl p-2 border-2 shadow-lg ${
                timeLeft <= 5
                  ? "border-red-500 animate-pulse"
                  : "border-orange-300"
              }`}
            >
              <div
                className={`text-xs font-bold ${
                  timeLeft <= 5 ? "text-red-600" : "text-orange-600"
                }`}
              >
                TIME
              </div>
              <div
                className={`text-2xl font-black ${
                  timeLeft <= 5 ? "text-red-800" : "text-orange-800"
                }`}
              >
                ⏰ {timeLeft}s
              </div>
            </div>
            <div className="bg-white bg-opacity-90 rounded-xl p-2 border-2 border-pink-300 shadow-lg">
              <div className="text-xs font-bold text-pink-600">QUESTION</div>
              <div className="text-2xl font-black text-pink-800">
                {currentScenarioIndex + 1}/{scenarios.length}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white bg-opacity-90 rounded-full h-3 mb-4 border-2 border-purple-300 overflow-hidden shadow-lg">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Scenario Card - Side by side layout */}
        <div className="bg-white bg-opacity-95 backdrop-blur-md rounded-3xl p-6 border-4 border-purple-400 shadow-2xl mb-3 flex-1 flex flex-col">
          <div className="flex gap-6 flex-1">
            {/* Left side - Image */}
            <div className="w-2/5 flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={currentScenario.image}
                  alt={currentScenario.text}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-lg border-4 border-purple-300"
                />
              </div>
            </div>

            {/* Right side - Question and Options */}
            <div className="w-3/5 flex flex-col">
              <div className="text-center mb-4">
                <p className="text-2xl font-black text-gray-800 leading-relaxed">
                  {currentScenario.text}
                </p>
              </div>

              <div className="border-t-4 border-purple-200 pt-4 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-center text-purple-700 mb-4">
                  How do they feel? 🤔
                </h3>

                {/* Emotion Options */}
                <div className="grid grid-cols-2 gap-4 flex-1">
                  {currentScenario.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmotionClick(option.emotion)}
                      disabled={feedback !== null}
                      className={`
                        p-4 rounded-2xl border-4 font-bold text-lg
                        transform transition-all duration-300 flex flex-col items-center justify-center
                        ${
                          selectedEmotion === option.emotion &&
                          feedback === "correct"
                            ? "bg-green-100 border-green-500 scale-105 shadow-xl"
                            : selectedEmotion === option.emotion &&
                              feedback === "incorrect"
                            ? "bg-red-100 border-red-500 scale-95"
                            : "bg-purple-50 border-purple-300 hover:border-purple-500 hover:scale-105 hover:shadow-xl"
                        }
                        ${
                          feedback !== null
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }
                      `}
                    >
                      <div className="text-5xl mb-2">{option.emoji}</div>
                      <div className="text-xl font-black text-gray-800">
                        {option.emotion}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Message */}
              {feedback && (
                <div className="mt-4 text-center">
                  {feedback === "correct" ? (
                    <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-3 animate-bounce">
                      <p className="text-2xl font-black text-green-700">
                        ✨ Correct! Great job! ✨
                      </p>
                      <p className="text-base text-green-600 mt-1">
                        +10 points!
                      </p>
                    </div>
                  ) : feedback === "timeout" ? (
                    <div className="bg-orange-100 border-4 border-orange-500 rounded-2xl p-3">
                      <p className="text-2xl font-black text-orange-700">
                        ⏰ Time's Up! ⏰
                      </p>
                      <p className="text-base text-orange-600 mt-1">
                        -5 points
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-3">
                      <p className="text-2xl font-black text-red-700">
                        Not quite! Next question! 💪
                      </p>
                      <p className="text-base text-red-600 mt-1">-5 points</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={handleBackToMenu}
            className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-700 text-white text-base font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
