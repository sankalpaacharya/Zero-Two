import { useState, useCallback } from "react";
import type { TypingConfig, TypingState } from "../types";

/**
 * Core typing mechanics hook - completely reusable
 * Handles character-by-character typing logic without any game-specific concerns
 */
export function useTypingCore({
  words,
  onCorrectChar,
  onWordComplete,
  onIncorrectChar,
  onType,
}: TypingConfig) {
  const [activeWord, setActiveWord] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [typedValue, setTypedValue] = useState("");
  const [correctCharacterMap, setCorrectCharacterMap] = useState<
    Map<string, boolean>
  >(new Map());

  const handleOnType = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const typedChar = newValue[newValue.length - 1] || "";

      // Handle backspace
      if (newValue.length < typedValue.length) {
        const newMap = new Map(correctCharacterMap);
        if (currCharIndex > 0) {
          const key = `${activeWord}-${currCharIndex - 1}`;
          newMap.delete(key);
          setCurrCharIndex(currCharIndex - 1);
        } else if (activeWord > 0) {
          const prevWordLength = words[activeWord - 1].length;
          const key = `${activeWord - 1}-${prevWordLength - 1}`;
          newMap.delete(key);
          setActiveWord(activeWord - 1);
          setCurrCharIndex(prevWordLength);
        }
        setCorrectCharacterMap(newMap);
        setTypedValue(newValue);

        const state: TypingState = {
          activeWord,
          currCharIndex: currCharIndex > 0 ? currCharIndex - 1 : currCharIndex,
          typedValue: newValue,
          correctCharacterMap: newMap,
        };
        onType?.(state);
        return;
      }

      // Handle space (word completion)
      if (typedChar === " ") {
        onWordComplete?.(activeWord);
        setActiveWord((prev) => prev + 1);
        setCurrCharIndex(0);
        setTypedValue(newValue);

        const state: TypingState = {
          activeWord: activeWord + 1,
          currCharIndex: 0,
          typedValue: newValue,
          correctCharacterMap,
        };
        onType?.(state);
        return;
      }

      // Handle regular character
      const key = `${activeWord}-${currCharIndex}`;
      const expectedChar = words[activeWord]?.[currCharIndex] ?? "";
      const isCorrect = typedChar === expectedChar;

      setCorrectCharacterMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(key, isCorrect);
        return newMap;
      });

      if (isCorrect) {
        onCorrectChar?.(activeWord, currCharIndex);
      } else {
        onIncorrectChar?.(activeWord, currCharIndex);
      }

      setCurrCharIndex((prev) => prev + 1);
      setTypedValue(newValue);

      const state: TypingState = {
        activeWord,
        currCharIndex: currCharIndex + 1,
        typedValue: newValue,
        correctCharacterMap: new Map(correctCharacterMap).set(key, isCorrect),
      };
      onType?.(state);
    },
    [
      activeWord,
      currCharIndex,
      typedValue,
      correctCharacterMap,
      words,
      onCorrectChar,
      onWordComplete,
      onIncorrectChar,
      onType,
    ],
  );

  const reset = useCallback(() => {
    setActiveWord(0);
    setCurrCharIndex(0);
    setTypedValue("");
    setCorrectCharacterMap(new Map());
  }, []);

  /**
   * Shift internal indices and correctness map when words are removed
   * Useful for viewport scrolling where you remove typed words
   */
  const shiftAfterRemovingWords = useCallback((removedWords: number) => {
    if (removedWords <= 0) return;

    setActiveWord((prev) => Math.max(0, prev - removedWords));
    setCorrectCharacterMap((prev) => {
      const next = new Map<string, boolean>();
      prev.forEach((val, key) => {
        const [wStr, cStr] = key.split("-");
        const w = Number.parseInt(wStr, 10);
        const c = Number.parseInt(cStr, 10);
        const newW = w - removedWords;
        if (newW >= 0 && Number.isFinite(newW)) {
          next.set(`${newW}-${c}`, val);
        }
      });
      return next;
    });
  }, []);

  return {
    // State
    activeWord,
    currCharIndex,
    typedValue,
    correctCharacterMap,

    // Actions
    handleOnType,
    reset,
    shiftAfterRemovingWords,

    // Setters (for advanced control)
    setActiveWord,
    setCurrCharIndex,
  };
}
