"use client";
import { useTyping } from "@/hooks/useTyping";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/8bit/card";

export default function Typing() {
  const message =
    "The world is made up of loafers who want money without working and fools who are willing to work without becoming rich The world is made up of loafers who want money without working and fools who are willing to work without becoming richThe world is made up of loafers who want money without working and fools who are willing to work without becoming rich ";

  const [words, setWords] = useState(message.split(" "));
  const socket = getSocket();
  const { roomId } = useGameStore();

  const [healWords, setHealWords] = useState<boolean[]>([]);
  useEffect(() => {
    setHealWords(words.map(() => Math.random() < 0.2));
  }, [words]);

  const {
    activeWord,
    currCharIndex,
    typedValue,
    handleOnType,
    correctCharacterMap,
    shiftAfterRemovingWords,
  } = useTyping({
    words,
    onCorrectType: () => socket.emit("typed", { roomId }),
  });

  const [isInputActive, setIsInputActive] = useState(false);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const charRefs = useRef<Map<string, HTMLSpanElement | null>>(new Map());

  // Monkeytype-like behavior: when caret moves to the second visual line,
  // drop the first line so the second becomes the new first line.
  useEffect(() => {
    if (!containerRef.current || words.length === 0) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    const firstWordEl = charRefs.current.get("0-0");
    if (!firstWordEl) return;

    const firstLineTop =
      firstWordEl.getBoundingClientRect().top - containerRect.top;

    // Try to get the active character element; fallback to first char of active word
    const activeKeyCandidate = `${activeWord}-${Math.max(
      0,
      Math.min(currCharIndex, (words[activeWord]?.length ?? 1) - 1)
    )}`;
    const activeEl =
      charRefs.current.get(activeKeyCandidate) ||
      charRefs.current.get(`${activeWord}-0`);
    if (!activeEl) return;

    const activeTop = activeEl.getBoundingClientRect().top - containerRect.top;
    const lineThreshold = 18; // pixels; approximate single line height tolerance

    // If the active caret is on the next visual line, compute how many words form the first line and drop them
    if (activeTop > firstLineTop + lineThreshold) {
      let firstLineWordCount = 0;
      for (let i = 0; i < words.length; i++) {
        const wordFirstChar =
          charRefs.current.get(`${i}-0`) || charRefs.current.get(`${i}-1`);
        if (!wordFirstChar) break;
        const top =
          wordFirstChar.getBoundingClientRect().top - containerRect.top;
        // use half threshold to be more lenient distinguishing same line
        if (top > firstLineTop + lineThreshold / 2) break;
        firstLineWordCount++;
      }

      if (firstLineWordCount > 0) {
        // Avoid shifting if the active word would end up negative
        setWords((prev) => prev.slice(firstLineWordCount));
        shiftAfterRemovingWords(firstLineWordCount);
      }
    }
  }, [activeWord, currCharIndex, words, shiftAfterRemovingWords]);

  useEffect(() => {
    if (!containerRef.current) return;

    const key = `${activeWord}-${currCharIndex}`;
    const charEl = charRefs.current.get(key);
    const containerRect = containerRef.current.getBoundingClientRect();

    if (charEl) {
      const rect = charEl.getBoundingClientRect();
      setCaretPos({
        x: rect.left - containerRect.left - 5,
        y: rect.top - containerRect.top - 5,
      });
    } else if (currCharIndex > 0 && activeWord < words.length) {
      const lastKey = `${activeWord}-${currCharIndex - 1}`;
      const lastEl = charRefs.current.get(lastKey);
      if (lastEl) {
        const rect = lastEl.getBoundingClientRect();
        setCaretPos({
          x: rect.right - containerRect.left - 5,
          y: rect.top - containerRect.top - 5,
        });
      }
    }
  }, [activeWord, currCharIndex, words.length]);

  const getCharacterColor = (wIndex: number, cIndex: number) => {
    const key = `${wIndex}-${cIndex}`;
    if (!correctCharacterMap.has(key))
      return healWords[wIndex] ? "text-green-400/70" : "text-white/60";
    return correctCharacterMap.get(key)
      ? "text-white font-semibold"
      : "text-red-400 font-semibold";
  };

  return (
    <Card
      ref={containerRef}
      className=" text-lg relative  backdrop-blur-sm rounded-lg p-6"
    >
      {!isInputActive && (
        <div className="absolute inset-0 flex justify-center items-center backdrop-blur-xs z-0">
          <p className="text-white font-semibold text-xl">
            Click to start typing
          </p>
        </div>
      )}

      <input
        type="text"
        value={typedValue}
        onChange={handleOnType}
        onFocus={() => setIsInputActive(true)}
        onBlur={() => setIsInputActive(false)}
        className="absolute inset-0 w-full h-full opacity-0 z-10"
      />

      {isInputActive && (
        <span
          className="absolute w-1 caret h-6 bg-amber-400 transition-all duration-100 ease-out"
          style={{ top: `${caretPos.y}px`, left: `${caretPos.x}px` }}
        />
      )}

      <div className="flex flex-wrap leading-15 h-40">
        {words.map((word, wIndex) => (
          <span
            key={`word-${word}-${
              // biome-ignore lint/suspicious/noArrayIndexKey: will fix later
              wIndex
            }`}
            className="inline-block mr-6"
          >
            {word.split("").map((char, cIndex) => {
              const key = `${wIndex}-${cIndex}`;
              return (
                <span
                  key={key}
                  ref={(el) => {
                    charRefs.current.set(key, el);
                  }}
                  className={cn(getCharacterColor(wIndex, cIndex), "ml-1")}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </Card>
  );
}
