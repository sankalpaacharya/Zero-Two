"use client";
import { useTyping } from "@/hooks/useTyping";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "./ui/8bit/card";

export default function Typing() {
  const message =
    "The world is made up of loafers who want money without working and fools who are willing to work without becoming rich";

  const words = useMemo(() => message.split(" "), []);
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
  } = useTyping({
    words,
    onCorrectType: () => socket.emit("typed", { roomId }),
  });

  const [isInputActive, setIsInputActive] = useState(false);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const charRefs = useRef<Map<string, HTMLSpanElement | null>>(new Map());

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
      className="w-full text-lg relative  backdrop-blur-sm rounded-lg p-6 "
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
          className="absolute w-1 h-6 bg-amber-400 transition-all duration-100 ease-out"
          style={{ top: `${caretPos.y}px`, left: `${caretPos.x}px` }}
        />
      )}

      <div className="flex flex-wrap leading-15">
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
