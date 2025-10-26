"use client";

import { useEffect } from "react";
import { useSpeedTyper } from "../hooks/useSpeedTyper";
import { useTypingRenderer, TypingArea } from "@/features/typing";
import type { CharacterStyler } from "@/features/typing";
import { Card } from "@/components/ui/8bit/card";
import { Button } from "@/components/ui/8bit/button";

interface SpeedTyperGameProps {
  words?: string[];
  timeLimit?: number;
}

/**
 * Speed Typer Game - A different implementation using the same core system
 * Shows how easy it is to create a completely different game type
 */
export function SpeedTyperGame({
  words = "the quick brown fox jumps over the lazy dog every day is a new opportunity to improve your typing speed practice makes perfect keep typing and never give up".split(
    " "
  ),
  timeLimit = 60,
}: SpeedTyperGameProps) {
  const {
    typedValue,
    correctCharacterMap,
    handleOnType,
    wpm,
    accuracy,
    timeLeft,
    isGameActive,
    isGameOver,
    restart,
  } = useSpeedTyper({ words, timeLimit });

  const {
    isInputActive,
    setIsInputActive,
    caretPos,
    containerRef,
    charRefs,
    updateCaretPosition,
  } = useTypingRenderer();

  // Update caret position
  useEffect(() => {
    const state = { activeWord: 0, currCharIndex: 0 }; // You'd get this from typing state
    updateCaretPosition(state.activeWord, state.currCharIndex, words.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.length, updateCaretPosition]);

  // Speed-focused character styling
  const getCharacterStyle: CharacterStyler = (
    wIdx,
    cIdx,
    correctCharacterMap
  ) => {
    const key = `${wIdx}-${cIdx}`;
    if (!correctCharacterMap.has(key)) {
      return { color: "text-white/50" };
    }
    return {
      color: correctCharacterMap.get(key) ? "text-blue-400" : "text-red-500",
    };
  };

  return (
    <div className="space-y-4">
      {/* Stats Dashboard */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-white/60">WPM</p>
            <p className="text-3xl font-bold text-blue-400">{wpm}</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Accuracy</p>
            <p className="text-3xl font-bold text-green-400">{accuracy}%</p>
          </div>
          <div>
            <p className="text-sm text-white/60">Time Left</p>
            <p
              className={`text-3xl font-bold ${
                timeLeft < 10 ? "text-red-400" : "text-white"
              }`}
            >
              {timeLeft}s
            </p>
          </div>
        </div>
      </Card>

      {/* Typing Area */}
      {isGameOver ? (
        <Card className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Game Over!</h2>
          <div className="space-y-2">
            <p className="text-lg">
              Final WPM: <span className="font-bold text-blue-400">{wpm}</span>
            </p>
            <p className="text-lg">
              Final Accuracy:{" "}
              <span className="font-bold text-green-400">{accuracy}%</span>
            </p>
          </div>
          <Button onClick={restart}>Play Again</Button>
        </Card>
      ) : (
        <TypingArea
          words={words}
          typedValue={typedValue}
          correctCharacterMap={correctCharacterMap}
          isInputActive={isInputActive}
          caretPos={caretPos}
          containerRef={containerRef}
          charRefs={charRefs}
          onInputChange={handleOnType}
          onFocus={() => setIsInputActive(true)}
          onBlur={() => setIsInputActive(false)}
          getCharacterStyle={getCharacterStyle}
          placeholder={
            isGameActive ? "Keep typing!" : "Click to start speed test"
          }
        />
      )}
    </div>
  );
}
