import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface UseCountdownGameTimerOptions {
  duration: number;
  isRunning: boolean;
  onTimeUp: () => void;
}

interface CountdownGameTimerApi {
  timeLeft: number;
  resetTimer: () => void;
  setTimeLeft: Dispatch<SetStateAction<number>>;
}

export function useCountdownGameTimer({
  duration,
  isRunning,
  onTimeUp,
}: UseCountdownGameTimerOptions): CountdownGameTimerApi {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          clearInterval(intervalId);
          onTimeUp();
          return 0;
        }
        return currentTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, onTimeUp]);

  const resetTimer = (): void => {
    setTimeLeft(duration);
  };

  return { timeLeft, resetTimer, setTimeLeft };
}
