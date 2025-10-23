import { useState, useEffect } from "react";
import { useTypingCore } from "@/features/typing";

interface UseSpeedTyperConfig {
  words: string[];
  timeLimit?: number; // seconds
}

/**
 * Speed Typer Game Hook
 * Example of a different game type using the same core typing system
 * Focus: Speed and accuracy with time pressure
 */
export function useSpeedTyper({ words, timeLimit = 60 }: UseSpeedTyperConfig) {
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isGameActive, setIsGameActive] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalChars, setTotalChars] = useState(0);

  // Core typing functionality
  const typingCore = useTypingCore({
    words,
    onCorrectChar: () => {
      setCorrectChars((prev) => prev + 1);
      setTotalChars((prev) => prev + 1);
    },
    onIncorrectChar: () => {
      setTotalChars((prev) => prev + 1);
    },
    onType: (state) => {
      // Start game on first keystroke
      if (!isGameActive && state.typedValue.length > 0) {
        setIsGameActive(true);
      }

      // Calculate WPM (words per minute)
      const elapsedTime = (timeLimit - timeLeft) / 60;
      if (elapsedTime > 0) {
        const wordsTyped = state.activeWord + state.currCharIndex / 5; // 5 chars = 1 word
        setWpm(Math.round(wordsTyped / elapsedTime));
      }

      // Calculate accuracy
      if (totalChars > 0) {
        setAccuracy(Math.round((correctChars / totalChars) * 100));
      }
    },
  });

  // Timer
  useEffect(() => {
    if (!isGameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsGameActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  const restart = () => {
    typingCore.reset();
    setWpm(0);
    setAccuracy(100);
    setTimeLeft(timeLimit);
    setIsGameActive(false);
    setCorrectChars(0);
    setTotalChars(0);
  };

  return {
    ...typingCore,
    wpm,
    accuracy,
    timeLeft,
    isGameActive,
    isGameOver: timeLeft === 0,
    restart,
  };
}
