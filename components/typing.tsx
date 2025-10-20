"use client";
import { getSocket } from "@/lib/socket";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useRef, useState } from "react";

export default function Typing() {
  const message =
    "The world is made up of loafers who want money without working and fools who are willing to work without becoming rich";
  const words = message.split(" ");

  const socket = getSocket();
  const { roomId } = useGameStore();

  // State
  const [activeWord, setActiveWord] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(0);
  const [typedValue, setTypedValue] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  const [correctCharacterMap, setCorrectCharacterMap] = useState<
    Map<string, boolean>
  >(new Map());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const charMapRef = useRef<Map<string, HTMLSpanElement | null>>(new Map());

  useEffect(() => {
    const key = `${activeWord}-${currCharIndex}`;
    const charEl = charMapRef.current.get(key);
    const containerEl = containerRef.current;

    if (charEl && containerEl) {
      const rect = charEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      setCaretPosition({
        x: rect.left - containerRect.left - 5,
        y: rect.top - containerRect.top - 5,
      });
    } else if (currCharIndex > 0 && activeWord < words.length) {
      const lastCharKey = `${activeWord}-${currCharIndex - 1}`;
      const lastCharEl = charMapRef.current.get(lastCharKey);

      if (lastCharEl && containerEl) {
        const rect = lastCharEl.getBoundingClientRect();
        const containerRect = containerEl.getBoundingClientRect();
        setCaretPosition({
          x: rect.right - containerRect.left - 5,
          y: rect.top - containerRect.top - 5,
        });
      }
    }
  }, [activeWord, currCharIndex, words.length]);

  // Typing logic
  const handleOnType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const typedChar = newValue[newValue.length - 1] || "";

    // Handle backspace
    if (newValue.length < typedValue.length) {
      const newMap = new Map(correctCharacterMap);
      if (currCharIndex > 0) {
        setCurrCharIndex(currCharIndex - 1);
        const key = `${activeWord}-${currCharIndex - 1}`;
        newMap.delete(key);
      } else if (activeWord > 0) {
        const prevWordLength = words[activeWord - 1].length;
        setActiveWord(activeWord - 1);
        setCurrCharIndex(prevWordLength - 1);
        const key = `${activeWord - 1}-${prevWordLength - 1}`;
        newMap.delete(key);
      }
      setCorrectCharacterMap(newMap);
      setTypedValue(newValue);
      return;
    }

    // Handle space to move to next word
    if (typedChar === " ") {
      setActiveWord(activeWord + 1);
      setCurrCharIndex(0);
      setTypedValue(newValue);
      return;
    }

    // Normal character
    const key = `${activeWord}-${currCharIndex}`;
    const expectedChar = words[activeWord][currCharIndex] || "";
    if (typedChar === expectedChar) {
      socket.emit("typed", { roomId });
    }
    setCorrectCharacterMap((prev) =>
      new Map(prev).set(key, typedChar === expectedChar)
    );

    setCurrCharIndex(currCharIndex + 1);
    setTypedValue(newValue);
  };

  // Character color
  const getCharacterColor = (wordIndex: number, charIndex: number) => {
    const key = `${wordIndex}-${charIndex}`;
    if (!correctCharacterMap.has(key)) return "text-gray-600";
    return correctCharacterMap.get(key) ? "text-white" : "text-red-500";
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl border p-8 text-2xl relative"
      style={{
        wordBreak: "normal",
        overflowWrap: "break-word",
        whiteSpace: "pre-wrap",
      }}
    >
      {!isInputActive && (
        <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center backdrop-blur-xs z-0">
          <p>Click to start typing</p>
        </div>
      )}

      <input
        type="text"
        value={typedValue}
        onChange={handleOnType}
        onFocus={() => setIsInputActive(true)}
        onBlur={() => setIsInputActive(false)}
        className="absolute w-full h-full top-0 left-0 z-10 opacity-0"
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

      {/* Words */}
      <div className="flex flex-wrap leading-15">
        {words.map((word, wIndex) => (
          <span key={Math.random()} className="inline-block mr-6">
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
          </span>
        ))}
      </div>
    </div>
  );
}
