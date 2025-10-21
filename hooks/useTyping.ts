import { useState } from "react";
import { useGameStore } from "@/store/gameStore";

type UseTypingProps = {
  words: string[];
  onCorrectType?: (wordIndex: number, charIndex: number) => void;
};

export function useTyping({ words, onCorrectType }: UseTypingProps) {
  const { isStarted, setIsStarted } = useGameStore();
  const [activeWord, setActiveWord] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [typedValue, setTypedValue] = useState("");
  const [correctCharacterMap, setCorrectCharacterMap] = useState<
    Map<string, boolean>
  >(new Map());

  const handleOnType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const typedChar = newValue[newValue.length - 1] || "";

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
      return;
    }

    if (typedChar === " ") {
      setActiveWord((prev) => prev + 1);
      setCurrCharIndex(0);
      setTypedValue(newValue);
      return;
    }

    const key = `${activeWord}-${currCharIndex}`;
    const expectedChar = words[activeWord]?.[currCharIndex] ?? "";

    const isCorrect = typedChar === expectedChar;
    setCorrectCharacterMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, isCorrect);
      return newMap;
    });

    if (isCorrect && onCorrectType) {
      onCorrectType(activeWord, currCharIndex);
    }

    setCurrCharIndex((prev) => prev + 1);
    setTypedValue(newValue);
    // game started bruh
    if (!isStarted) {
      setIsStarted(true);
    }
  };

  const reset = () => {
    setActiveWord(0);
    setCurrCharIndex(0);
    setTypedValue("");
    setCorrectCharacterMap(new Map());
  };

  return {
    activeWord,
    currCharIndex,
    typedValue,
    handleOnType,
    correctCharacterMap,
    reset,
  };
}
