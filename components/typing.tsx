"use client";
import { useTyping } from "@/hooks/useTyping";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Typing() {
  const message =
    "The world is made up of loafers who want money without working and fools who are willing to work without becoming rich";

  const words = useMemo(() => message.split(" "), []);

  const [healWords, setHealWords] = useState<boolean[]>([]);
  const socket = getSocket();
  const { roomId } = useGameStore();

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
    onCorrectType: () => {
      socket.emit("typed", { roomId });
    },
  });

  const [isInputActive, setIsInputActive] = useState(false);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const charMapRef = useRef<Map<string, HTMLSpanElement | null>>(new Map());

  // caret logic
  useEffect(() => {
    const key = `${activeWord}-${currCharIndex}`;
    const charEl = charMapRef.current.get(key);
    const containerEl = containerRef.current;

    if (!containerEl) return;

    const rect = charEl?.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    if (rect) {
      setCaretPosition({
        x: rect.left - containerRect.left - 5,
        y: rect.top - containerRect.top - 5,
      });
    } else if (currCharIndex > 0 && activeWord < words.length) {
      const lastKey = `${activeWord}-${currCharIndex - 1}`;
      const lastEl = charMapRef.current.get(lastKey);
      if (lastEl) {
        const rect2 = lastEl.getBoundingClientRect();
        setCaretPosition({
          x: rect2.right - containerRect.left - 5,
          y: rect2.top - containerRect.top - 5,
        });
      }
    }
  }, [activeWord, currCharIndex, words.length]);

  const getCharacterColor = (wIndex: number, cIndex: number) => {
    const key = `${wIndex}-${cIndex}`;
    if (!correctCharacterMap.has(key))
      return healWords[wIndex] ? "text-green-300" : "text-indigo-600";
    return correctCharacterMap.get(key) ? "text-white" : "text-red-500";
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl border p-8 text-2xl relative"
    >
      {!isInputActive && (
        <div className="absolute inset-0 flex justify-center items-center backdrop-blur-xs z-0">
          <p>Click to start typing</p>
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
          className="absolute w-1 h-8 bg-amber-400 transition-all duration-200 ease-in-out"
          style={{
            top: `${caretPosition.y}px`,
            left: `${caretPosition.x}px`,
          }}
        />
      )}

      <div className="flex flex-wrap leading-15">
        {words.map((word, wIndex) => (
          <div key={Math.random()} className="inline-block mr-6">
            {word.split("").map((char, cIndex) => {
              const key = `${wIndex}-${cIndex}`;
              return (
                <span
                  key={key}
                  ref={(el) => {
                    charMapRef.current.set(key, el);
                  }}
                  className={cn(getCharacterColor(wIndex, cIndex), "ml-1")}
                >
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
