  import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MascotWidget } from '../../../../../components/Mascot';
import { saveGameEventToFirebase } from '../../../../../lib/gameTracking';
import { useGameUser } from '../../../../../context/GameUserContext';

interface Scenario {
  id: number;
  emoji: string;
  title: string;
  text: string;
  category: 'stops' | 'spreads';
  tip: string;
}

const germScenarios: Scenario[] = [
  { id: 1, emoji: '🧼', title: '20s Soap Wash', text: 'Washing hands with soap and water for 20 seconds', category: 'stops', tip: 'Soap and water wash germs right down the drain!' },
  { id: 2, emoji: '🤧', title: 'Sneeze in Hands', text: 'Sneezing directly into your hands', category: 'spreads', tip: 'Always sneeze into your elbow or a tissue!' },
  { id: 3, emoji: '🧴', title: 'Hand Sanitizer', text: 'Using alcohol-based hand sanitizer', category: 'stops', tip: 'Sanitizer is a great backup when no sink is nearby.' },
  { id: 4, emoji: '✏️', title: 'Germy Pencil', text: 'Sharing a pencil with a friend after coughing', category: 'spreads', tip: 'Germs easily hitch rides on shared school supplies!' },
  { id: 5, emoji: '🚽', title: 'Restroom Wash', text: 'Washing hands after using the restroom', category: 'stops', tip: 'Always wash up after bathroom breaks!' },
  { id: 6, emoji: '🙌', title: 'Sneezy High-Five', text: 'High-fiving right after sneezing without washing', category: 'spreads', tip: 'Unwashed hands pass germs straight to friends.' },
  { id: 7, emoji: '🧻', title: 'Tissue Cover', text: 'Covering your cough with a tissue', category: 'stops', tip: 'Tissues trap germs so they don’t fly into the air!' },
  { id: 8, emoji: '🛝', title: 'Sick at Park', text: 'Playing on the playground slide when sick', category: 'spreads', tip: 'Stay home and rest when sick to protect others.' },
  { id: 9, emoji: '🍎', title: 'Wash Fruit', text: 'Washing fruit before taking a big bite', category: 'stops', tip: 'Rinsing fruit washes away dirt and sneaky germs!' },
  { id: 10, emoji: '🥤', title: 'Shared Straw', text: 'Sharing the same juice box straw with a friend', category: 'spreads', tip: 'Never share straws, cups, or forks!' },
  { id: 11, emoji: '🐶', title: 'Pet Wash', text: 'Washing hands after petting a puppy or kitten', category: 'stops', tip: 'Washing up after petting animals keeps everyone healthy!' },
  { id: 12, emoji: '👀', title: 'Dirty Eye Rub', text: 'Rubbing your eyes with dirty playground hands', category: 'spreads', tip: 'Germs sneak in easily through your eyes, nose, and mouth!' },
];

const playSound = (type: 'sortRight' | 'combo' | 'wrong' | 'win') => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;

    if (type === 'sortRight') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(783.99, now + 0.08);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'combo') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.setValueAtTime(880, now + 0.08);
      osc.frequency.setValueAtTime(1174.66, now + 0.16);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(185, now);
      osc.frequency.linearRampToValueAtTime(125, now + 0.28);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'win') {
      osc.type = 'triangle';
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        osc.frequency.setValueAtTime(freq, now + i * 0.11);
      });
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.55);
    }
  } catch {
    // Ignore blocked audio
  }
};

export const GermFactoryGame: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useGameUser();

  const [gameStarted, setGameStarted] = useState(false);
  const [queue, setQueue] = useState<Scenario[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Smooth CSS slide animation state ('idle' | 'left' | 'right')
  const [slideDirection, setSlideDirection] = useState<'idle' | 'left' | 'right'>('idle');
  const [statusBanner, setStatusBanner] = useState<{
    type: 'good' | 'bad';
    headline: string;
    tip: string;
  } | null>(null);

  const triggerSound = useCallback(
    (type: 'sortRight' | 'combo' | 'wrong' | 'win') => {
      if (soundOn) playSound(type);
    },
    [soundOn]
  );

  const endGame = useCallback(
    (finalScore: number) => {
      setGameOver(true);
      triggerSound('win');
      if (user) {
        saveGameEventToFirebase({
          user,
          event: 'game_completed',
          gameId: 'germ_factory',
          score: finalScore,
          timestamp: new Date().toISOString(),
        });
      }
    },
    [user, triggerSound]
  );

  const startGame = () => {
    const shuffled = [...germScenarios].sort(() => Math.random() - 0.5);
    setQueue(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(3);
    setTimeLeft(60);
    setGameOver(false);
    setSlideDirection('idle');
    setStatusBanner(null);
    setGameStarted(true);
  };

  // 1-second timer (lightweight, zero lag)
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      endGame(score);
    }
  }, [timeLeft, gameStarted, gameOver, score, endGame]);

  const handleSort = useCallback(
    (choice: 'stops' | 'spreads') => {
      if (!gameStarted || gameOver || slideDirection !== 'idle' || queue.length === 0) return;

      const currentItem = queue[currentIndex];
      const isCorrect = currentItem.category === choice;

      // Trigger smooth CSS chute slide
      setSlideDirection(choice === 'stops' ? 'left' : 'right');

      let nextScore = score;
      let nextLives = lives;

      if (isCorrect) {
        const nextStreak = streak + 1;
        const bonus = nextStreak >= 3 ? 20 : 10;
        nextScore = score + bonus;

        setScore(nextScore);
        setStreak(nextStreak);
        setBestStreak((b) => Math.max(b, nextStreak));
        triggerSound(nextStreak >= 3 ? 'combo' : 'sortRight');

        setStatusBanner({
          type: 'good',
          headline: nextStreak >= 3 ? `🔥 ${nextStreak}x Combo! +${bonus} pts` : `Sorted! +${bonus} pts`,
          tip: currentItem.tip,
        });
      } else {
        nextLives = lives - 1;
        setLives(nextLives);
        setStreak(0);
        triggerSound('wrong');

        setStatusBanner({
          type: 'bad',
          headline: 'Wrong Chute! (-1 ❤️)',
          tip: currentItem.tip,
        });
      }

      // Advance conveyor belt smoothly after 320ms slide
      setTimeout(() => {
        if (nextLives <= 0) {
          endGame(nextScore);
          return;
        }

        if (currentIndex + 1 < queue.length) {
          setCurrentIndex((prev) => prev + 1);
          setSlideDirection('idle');
        } else {
          endGame(nextScore);
        }
      }, 320);
    },
    [gameStarted, gameOver, slideDirection, queue, currentIndex, score, lives, streak, triggerSound, endGame]
  );

  // Keyboard shortcuts (Left Arrow / A = Stops Germs, Right Arrow / D = Spreads Germs)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleSort('stops');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleSort('spreads');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [gameStarted, gameOver, handleSort]);

  const currentItem = queue[currentIndex];
  const nextItem = queue[currentIndex + 1];

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex flex-wrap justify-between items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-teal-700 font-semibold hover:underline"
          >
            ← Back
          </button>
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="bg-teal-50 hover:bg-teal-100 text-teal-800 px-3 py-1 rounded-lg text-sm font-semibold"
          >
            {soundOn ? '🔊 Sound On' : '🔇 Muted'}
          </button>
        </div>

        <h1 className="text-xl font-bold text-teal-900">
          Germ Factory
        </h1>

        {gameStarted && !gameOver && (
          <div className="flex items-center gap-3 font-bold text-gray-700">
            <span className="bg-red-50 px-3 py-1 rounded-lg text-red-700">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i}>{i < lives ? '❤️' : '🖤'}</span>
              ))}
            </span>
            <span className="bg-teal-100 px-3 py-1 rounded-lg text-teal-800">
              Score: {score}
            </span>
            <span
              className={`px-3 py-1 rounded-lg ${
                timeLeft <= 10
                  ? 'bg-red-100 text-red-700 animate-pulse'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              Time: {timeLeft}s
            </span>
          </div>
        )}
      </div>

      {/* Main Game Area */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center items-center my-6">
        {!gameStarted ? (
          <div className="w-full bg-white p-8 rounded-2xl shadow-md text-center">
            <h2 className="text-3xl font-bold text-teal-900 mb-3">
              Welcome to the Germ Factory!
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              Habits roll down the conveyor belt! Sort each crate into the right chute before time runs out.
            </p>
            <div className="grid grid-cols-2 gap-4 bg-teal-50 p-4 rounded-xl mb-6 text-sm font-semibold">
              <div className="bg-white p-3 rounded-lg border-2 border-green-400 text-green-800">
                Left / Green Chute
                <div className="font-normal text-gray-600 mt-1">Stops Germs</div>
              </div>
              <div className="bg-white p-3 rounded-lg border-2 border-red-400 text-red-800">
                Right / Red Chute
                <div className="font-normal text-gray-600 mt-1">Spreads Germs</div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-lg py-4 px-10 rounded-xl shadow transition transform active:scale-95"
            >
              Start Conveyor Belt
            </button>
          </div>
        ) : !gameOver && currentItem ? (
          <div className="w-full flex flex-col gap-4">
            {/* Live Feedback Strip (Never blocks gameplay!) */}
            <div
              className={`min-h-[64px] px-4 py-3 rounded-xl shadow-sm flex flex-col justify-center text-center transition-colors ${
                !statusBanner
                  ? 'bg-white text-teal-800 border border-teal-100'
                  : statusBanner.type === 'good'
                  ? 'bg-green-100 text-green-900 border border-green-300'
                  : 'bg-red-100 text-red-900 border border-red-300'
              }`}
            >
              {statusBanner ? (
                <>
                  <div className="font-extrabold text-sm md:text-base">
                    {statusBanner.headline}
                  </div>
                  <div className="text-xs md:text-sm">{statusBanner.tip}</div>
                </>
              ) : (
                <div className="font-semibold text-sm md:text-base">
                  Sort the crate on the scanner! (Tip: You can also use ⬅️ / ➡️ arrow keys)
                </div>
              )}
            </div>

            {/* Conveyor Belt Visual Track */}
            <div className="relative bg-slate-800 rounded-2xl p-6 shadow-md overflow-hidden border-4 border-slate-700">
              {/* Belt Progress & Streak Header */}
              <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-4">
                <span>
                  CRATE {currentIndex + 1} OF {queue.length}
                </span>
                {streak >= 3 ? (
                  <span className="bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full animate-pulse">
                    🔥 {streak}x SUPER STREAK (2X PTS)
                  </span>
                ) : (
                  <span>STREAK: {streak}</span>
                )}
              </div>

              {/* Next Crate Preview on Belt */}
              <div className="flex justify-center mb-3 opacity-60 scale-90">
                {nextItem ? (
                  <div className="bg-slate-700 text-slate-200 px-4 py-1.5 rounded-xl border border-slate-600 text-xs font-semibold flex items-center gap-2">
                    <span>Up Next:</span>
                    <span>{nextItem.emoji}</span>
                    <span>{nextItem.title}</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 font-semibold py-1.5">
                    🏁 Final Crate!
                  </div>
                )}
              </div>

              {/* Conveyor Belt Rollers */}
              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-x-0 h-3 bg-slate-600 rounded-full" />

                {/* Active Sorting Crate (GPU-accelerated slide) */}
                <div
                  className={`relative z-10 w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-xl border-4 border-teal-400 transition-all duration-300 ease-out ${
                    slideDirection === 'left'
                      ? '-translate-x-48 -rotate-12 opacity-0'
                      : slideDirection === 'right'
                      ? 'translate-x-48 rotate-12 opacity-0'
                      : 'translate-x-0 rotate-0 opacity-100'
                  }`}
                >
                  <div className="inline-block bg-teal-100 text-teal-800 text-xs font-extrabold px-3 py-0.5 rounded-full mb-2">
                    ON SCANNER
                  </div>
                  <div className="text-6xl mb-2">{currentItem.emoji}</div>
                  <h3 className="text-lg font-extrabold text-teal-950 mb-1">
                    {currentItem.title}
                  </h3>
                  <p className="text-base text-gray-700 font-medium">
                    "{currentItem.text}"
                  </p>
                </div>
              </div>

              {/* Left & Right Sorting Chutes */}
                            {/* Left & Right Sorting Bins */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button
                  onClick={() => handleSort('stops')}
                  className="bg-green-600 hover:bg-green-500 active:scale-95 text-white py-4 px-4 rounded-xl font-extrabold text-base md:text-lg shadow-lg border-b-4 border-green-800 transition flex flex-col items-center"
                >
                  <span>Good Habit</span>
                  <span className="text-xs font-normal text-green-100 mt-0.5">
                    Click the left arrow!
                  </span>
                </button>

                <button
                  onClick={() => handleSort('spreads')}
                  className="bg-red-600 hover:bg-red-500 active:scale-95 text-white py-4 px-4 rounded-xl font-extrabold text-base md:text-lg shadow-lg border-b-4 border-red-800 transition flex flex-col items-center"
                >
                  <span>Bad Habit</span>
                  <span className="text-xs font-normal text-red-100 mt-0.5">
                    Click the right arrow!
                  </span>
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* Game Over / Summary Screen */
          <div className="w-full bg-white p-8 rounded-2xl shadow-md text-center">
            <h2 className="text-3xl font-bold text-teal-900 mb-2">
              {lives === 0 ? 'Factory Jammed! Try Again!' : 'Shift Complete!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {lives === 0
                ? 'Three crates went down the wrong chute. Give it another go!'
                : 'Great job sorting all the healthy and germy habits!'}
            </p>

            <div className="flex justify-center gap-6 bg-teal-50 p-4 rounded-xl mb-6">
              <div>
                <p className="text-sm text-gray-600">Final Score</p>
                <p className="text-2xl font-bold text-teal-700">{score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Best Streak</p>
                <p className="text-2xl font-bold text-amber-600">🔥 {bestStreak}</p>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-xl shadow transition"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Mascot Assistant */}
      <MascotWidget />
    </div>
  );
};

export default GermFactoryGame;
