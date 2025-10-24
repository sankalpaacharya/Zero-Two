"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useTypingBattle } from "../hooks/useTypingBattle";
import { useTypingRenderer } from "@/features/typing/hooks/useTypingRenderer";
import { TypingArea } from "@/features/typing/components/TypingArea";
import type { CharacterStyler } from "@/features/typing/types";

interface TypingBattleGameProps {
  message?: string;
}

/**
 * Typing Battle Game Implementation
 * Uses core typing functionality + game-specific logic
 */
export function TypingBattleGame({
  message = "The world is made up of loafers who want money without working and fools who are willing to work without becoming rich The world is made up of loafers who want money without working and fools who are willing to work without becoming richThe world is made up of loafers who want money without working and fools who are willing to work without becoming rich ",
}: TypingBattleGameProps) {
  const [words, setWords] = useState(message.split(" "));
  const { roomId, setHealWords: setHealWordsStore } = useGameStore();

  // Heal words feature (20% of words are heal words)
  const [healWords, setHealWords] = useState<boolean[]>([]);
  useEffect(() => {
    const healingWords = words.map(() => Math.random() < 0.2);
    setHealWords(healingWords);
    setHealWordsStore(healingWords);
  }, [words]);

  // Core typing mechanics with game-specific logic
  const {
    activeWord,
    currCharIndex,
    typedValue,
    handleOnType,
    correctCharacterMap,
    shiftAfterRemovingWords,
  } = useTypingBattle({
    words,
    roomId,
  });

  // Rendering and viewport management
  const {
    isInputActive,
    setIsInputActive,
    caretPos,
    containerRef,
    charRefs,
    updateCaretPosition,
    checkViewportScroll,
  } = useTypingRenderer();

  // Update caret position when typing position changes
  useEffect(() => {
    updateCaretPosition(activeWord, currCharIndex, words.length);
  }, [activeWord, currCharIndex, words.length, updateCaretPosition]);

  // Handle 3-line viewport scrolling
  useEffect(() => {
    const wordsToRemove = checkViewportScroll(activeWord, currCharIndex, words);
    if (wordsToRemove > 0) {
      setWords((prev) => prev.slice(wordsToRemove));
      shiftAfterRemovingWords(wordsToRemove);
    }
  }, [
    activeWord,
    currCharIndex,
    words,
    checkViewportScroll,
    shiftAfterRemovingWords,
  ]);

  // Character styling based on correctness and heal words
  const getCharacterStyle: CharacterStyler = (
    wIndex,
    cIndex,
    correctCharacterMap
  ) => {
    const key = `${wIndex}-${cIndex}`;
    if (!correctCharacterMap.has(key)) {
      return {
        color: healWords[wIndex] ? "text-green-400/70" : "text-white/60",
      };
    }
    return {
      color: correctCharacterMap.get(key)
        ? "text-white font-semibold"
        : "text-red-400 font-semibold",
    };
  };

  return (
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
    />
  );
}
