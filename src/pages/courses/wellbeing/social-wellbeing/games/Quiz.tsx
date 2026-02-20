import React, { useRef } from "react";
import type { QuizQuestion, ChallengeCard } from "../../../../../types";
import { Logo } from "../../../../../components";
import { useGameUser } from "../../../../../context/GameUserContext";
import { generateSessionId } from "../../../../../lib/sessionId";

export interface QuizProps {
  // Support both data formats for future quiz types
  questions?: QuizQuestion[];
  cards?: ChallengeCard[];
  title?: string;
  subtitle?: string;
  gameId?: string; // Required for tracking
}

type Emotion = "neutral" | "happy" | "sad";

function Person({
  progress,
  total,
  emotion,
}: {
  progress: number;
  total: number;
  emotion: Emotion;
}): React.JSX.Element {
  const clamped = Math.max(0, Math.min(progress, total));
  const growth = total > 0 ? clamped / total : 0;

  const baseY = 250; // ground top
  const centerX = 200;

  // Character dimensions scale with growth
  const headRadius = 20 + growth * 12;
  const torsoLength = 50 + growth * 40;
  const limbLength = 40 + growth * 25;

  const headCenterY = baseY - (torsoLength + headRadius + 10);
  const shoulderY = headCenterY + headRadius + 10;
  const hipY = baseY - 10;

  const isHappy = emotion === "happy";
  const isSad = emotion === "sad";

  // Small shake for sad
  const shake = isSad ? 3 : 0;

  return (
    <svg width="100%" height="100%" viewBox="0 0 400 300">
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#E0F7FA" />
        </linearGradient>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="1.2"
            floodColor="#000"
            floodOpacity="0.2"
          />
        </filter>
      </defs>

      <rect x="0" y="0" width="400" height="300" fill="url(#skyGrad)" />
      <rect x="0" y="250" width="400" height="50" fill="#A5D6A7" />

      <g transform={`translate(${shake},0)`}>
        {/* Head */}
        <circle
          cx={centerX}
          cy={headCenterY}
          r={headRadius}
          fill="#FDD7B0"
          stroke="#E0A97B"
          strokeWidth="2"
          filter="url(#softShadow)"
        />

        {/* Eyes */}
        {isHappy ? (
          <g>
            <path
              d={`M ${centerX - headRadius * 0.7} ${
                headCenterY - headRadius * 0.1
              }
                  Q ${centerX - headRadius * 0.45} ${
                headCenterY - headRadius * 0.25
              }
                  ${centerX - headRadius * 0.2} ${
                headCenterY - headRadius * 0.1
              }`}
              stroke="#2E7D32"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M ${centerX + headRadius * 0.2} ${
                headCenterY - headRadius * 0.1
              }
                  Q ${centerX + headRadius * 0.45} ${
                headCenterY - headRadius * 0.25
              }
                  ${centerX + headRadius * 0.7} ${
                headCenterY - headRadius * 0.1
              }`}
              stroke="#2E7D32"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <>
            <circle
              cx={centerX - headRadius * 0.45}
              cy={headCenterY - headRadius * 0.2}
              r={3}
              fill="#333"
            />
            <circle
              cx={centerX + headRadius * 0.45}
              cy={headCenterY - headRadius * 0.2}
              r={3}
              fill="#333"
            />
            {isSad && (
              <>
                {/* Eyebrows */}
                <path
                  d={`M ${centerX - headRadius * 0.75} ${
                    headCenterY - headRadius * 0.35
                  }
                      L ${centerX - headRadius * 0.35} ${
                    headCenterY - headRadius * 0.25
                  }`}
                  stroke="#5D4037"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${centerX + headRadius * 0.35} ${
                    headCenterY - headRadius * 0.25
                  }
                      L ${centerX + headRadius * 0.75} ${
                    headCenterY - headRadius * 0.35
                  }`}
                  stroke="#5D4037"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </>
            )}
          </>
        )}

        {/* Mouth */}
        {isSad ? (
          <path
            d={`M ${centerX - 14} ${headCenterY + 8} Q ${centerX} ${
              headCenterY + 2
            } ${centerX + 14} ${headCenterY + 8}`}
            stroke="#B71C1C"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        ) : isHappy ? (
          <path
            d={`M ${centerX - 14} ${headCenterY + 14} Q ${centerX} ${
              headCenterY + 28
            } ${centerX + 14} ${headCenterY + 14}`}
            stroke="#2E7D32"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <line
            x1={centerX - 10}
            y1={headCenterY + 10}
            x2={centerX + 10}
            y2={headCenterY + 10}
            stroke="#546E7A"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Tear for sad */}
        {isSad && (
          <circle
            cx={centerX - headRadius * 0.45}
            cy={headCenterY - headRadius * 0.05}
            r={2}
            fill="#4FC3F7"
          />
        )}

        {/* Body */}
        <line
          x1={centerX}
          y1={shoulderY}
          x2={centerX}
          y2={hipY}
          stroke="#455A64"
          strokeWidth="6"
        />

        {/* Arms */}
        <line
          x1={centerX}
          y1={shoulderY + 5}
          x2={centerX - limbLength}
          y2={shoulderY + limbLength * 0.4}
          stroke="#607D8B"
          strokeWidth="5"
        />
        <line
          x1={centerX}
          y1={shoulderY + 5}
          x2={centerX + limbLength}
          y2={shoulderY + limbLength * 0.4}
          stroke="#607D8B"
          strokeWidth="5"
        />

        {/* Legs */}
        <line
          x1={centerX}
          y1={hipY}
          x2={centerX - limbLength * 0.4}
          y2={hipY + limbLength * 0.7}
          stroke="#263238"
          strokeWidth="6"
        />
        <line
          x1={centerX}
          y1={hipY}
          x2={centerX + limbLength * 0.4}
          y2={hipY + limbLength * 0.7}
          stroke="#263238"
          strokeWidth="6"
        />

        {/* Confetti for happy on growth */}
        {isHappy && (
          <g>
            <circle
              cx={centerX - 40}
              cy={headCenterY - 30}
              r={3}
              fill="#FF7043"
            />
            <circle
              cx={centerX + 45}
              cy={headCenterY - 35}
              r={3}
              fill="#AB47BC"
            />
            <circle cx={centerX} cy={headCenterY - 50} r={3} fill="#42A5F5" />
          </g>
        )}
      </g>
    </svg>
  );
}

export function Quiz({
  questions,
  cards,
  title,
  subtitle,
  gameId,
}: QuizProps): React.JSX.Element {
  const { trackEvent } = useGameUser();
  const sessionIdRef = useRef<string | null>(null);
  const hasStartedRef = useRef<boolean>(false);
  
  // Determine which data format we're using
  const isChallengeFormat = !!cards;
  const dataLength = isChallengeFormat ? cards!.length : questions!.length;

  const [current, setCurrent] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const [lastCorrect, setLastCorrect] = React.useState<null | boolean>(null);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(
    null
  );
  const [canProceed, setCanProceed] = React.useState(false);

  const currentItem = isChallengeFormat ? cards![current] : questions![current];

  function handleAnswer(optionIndex: number): void {
    // Track game start on first answer
    if (!hasStartedRef.current && gameId) {
      hasStartedRef.current = true;
      const newSessionId = generateSessionId();
      sessionIdRef.current = newSessionId;
      trackEvent({
        gameId,
        event: "game_started",
        sessionId: newSessionId,
      });
    }

    let correct: boolean;

    if (isChallengeFormat) {
      correct = optionIndex === (currentItem as ChallengeCard).correctAnswer;
    } else {
      const selectedOption = (currentItem as QuizQuestion).options[optionIndex];
      correct = selectedOption === (currentItem as QuizQuestion).answer;
    }

    setSelectedAnswer(optionIndex);
    setLastCorrect(correct);
    setShowExplanation(true);
    setCanProceed(true);

    if (correct) setScore((s) => s + 1);
  }

  function handleNext(): void {
    setShowExplanation(false);
    setSelectedAnswer(null);
    setCanProceed(false);

    if (current + 1 < dataLength) {
      setCurrent((c) => c + 1);
    } else {
      setFinished(true);
      // Track game completion
      if (gameId && sessionIdRef.current) {
        trackEvent({
          gameId,
          event: "game_completed",
          sessionId: sessionIdRef.current,
          score,
          moves: dataLength,
          metadata: {
            totalQuestions: dataLength,
            correctAnswers: score,
          },
        });
      }
    }
    setLastCorrect(null);
  }

  function reset(): void {
    // Reset session tracking
    sessionIdRef.current = null;
    hasStartedRef.current = false;
    setCurrent(0);
    setScore(0);
    setFinished(false);
    setLastCorrect(null);
    setShowExplanation(false);
    setSelectedAnswer(null);
    setCanProceed(false);
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg, #4FC3F7 0%, #81C784 25%, #FFB74D 50%, #BA68C8 75%, #F06292 100%)",
      }}
    >
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 items-stretch">
        <div className="bg-white bg-opacity-95 rounded-2xl border-4 border-green-300 shadow-2xl p-6 flex flex-col">
          <div className="text-center mb-4">
            <Logo size="sm" className="mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold text-green-700">
              {title ?? "Quiz"}
            </h1>
            <p className="text-gray-600">
              {subtitle ?? "Answer correctly to grow! 🌱➡️🌳"}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="w-full h-80 md:h-[28rem]">
              <Person
                progress={score}
                total={dataLength}
                emotion={
                  finished
                    ? "happy"
                    : lastCorrect === null
                    ? "neutral"
                    : lastCorrect
                    ? "happy"
                    : "sad"
                }
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Question {current + 1} / {dataLength}
            </span>
            <span>Correct: {score}</span>
          </div>
        </div>

        <div className="bg-white bg-opacity-95 rounded-2xl border-4 border-yellow-300 shadow-2xl p-6 flex flex-col">
          {!finished ? (
            <>
              <div className="mb-6">
                {isChallengeFormat && (
                  <div className="text-lg font-semibold text-blue-600 mb-2">
                    Topic:{" "}
                    {(currentItem as ChallengeCard).topic
                      .charAt(0)
                      .toUpperCase() +
                      (currentItem as ChallengeCard).topic.slice(1)}
                  </div>
                )}
                <div className="text-2xl font-bold text-gray-800 text-center">
                  {isChallengeFormat
                    ? (currentItem as ChallengeCard).question
                    : (currentItem as QuizQuestion).prompt}
                </div>
              </div>

              {!showExplanation ? (
                <div className="grid gap-4">
                  {(isChallengeFormat
                    ? (currentItem as ChallengeCard).options
                    : (currentItem as QuizQuestion).options
                  ).map((opt, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className="px-6 py-4 text-xl font-semibold rounded-xl border-2 border-transparent bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold mb-4 ${
                      lastCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {lastCorrect ? "✅ Correct!" : "❌ Incorrect"}
                  </div>

                  {isChallengeFormat && (
                    <div className="bg-gray-100 p-4 rounded-lg text-left mb-4">
                      <div className="font-semibold text-gray-800 mb-2">
                        Explanation:
                      </div>
                      <div className="text-gray-700">
                        {(currentItem as ChallengeCard).explanation}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className={`px-8 py-3 text-lg font-semibold rounded-xl ${
                      canProceed
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {current + 1 < dataLength ? "Next Question" : "Finish Quiz"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="text-3xl font-extrabold text-purple-700 mb-2">
                Great job! 🎉
              </div>
              <p className="text-gray-700 mb-4">
                You answered {score} out of {dataLength} correctly.
              </p>
              <button
                onClick={reset}
                className="px-6 py-3 text-lg font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <a href="/" className="text-white underline font-semibold">
          ← Back to Home
        </a>
      </div>
    </div>
  );
}

export default Quiz;
