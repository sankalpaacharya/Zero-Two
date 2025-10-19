"use client";
import { useEffect, useRef, useState } from "react";

export default function Typing() {
  const message =
    "The world is made up of loafers who want money without working and fools who are willing to work without becoming rich";
  const characters = message.split("");
  const [currIndex, setCurrIndex] = useState(0);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  const [typedValue, setTypedValue] = useState("");
  const [correctCharacterIndex, setCorrectCharacterIndex] = useState<
    Record<number, boolean>
  >({});
  const characterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInputActive, setIsInputActive] = useState(false);

  useEffect(() => {
    const charElement = characterRefs.current[currIndex];
    const containerElement = containerRef.current;
    if (charElement && containerElement) {
      const charRect = charElement.getBoundingClientRect();
      const containerRect = containerElement.getBoundingClientRect();
      setCaretPosition({
        x: charRect.left - containerRect.left,
        y: charRect.top - containerRect.top,
      });
    }
  }, [currIndex]);

  const handleOnType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newLength = newValue.length;
    const oldLength = typedValue.length;

    if (newLength < oldLength) {
      if (currIndex > 0) {
        setCurrIndex(currIndex - 1);
        setTypedValue(newValue);
      }
      return;
    }

    if (newLength > oldLength && currIndex < characters.length) {
      const typedChar = newValue[newValue.length - 1];
      const expectedChar = characters[currIndex];

      setCorrectCharacterIndex((prev: any) => ({
        ...prev,
        [currIndex]: typedChar === expectedChar,
      }));

      setCurrIndex(currIndex + 1);
      setTypedValue(newValue);
    }
  };

  const getCharacterColor = (index: number) => {
    if (index >= currIndex) return "text-gray-600";
    if (correctCharacterIndex[index] === true) return "text-white";
    if (correctCharacterIndex[index] === false) return "text-red-500";
    return "text-gray-600";
  };

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-4xl border p-8 text-2xl relative leading-relaxed break-words`}
    >
      {!isInputActive && (
        <div className="w-full h-full backdrop-blur-xs z-0 justify-center items-center flex border absolute top-0 left-0">
          <p>Click to start typing</p>
        </div>
      )}
      <input
        onFocus={() => setIsInputActive(true)}
        onBlur={() => setIsInputActive(false)}
        onChange={handleOnType}
        value={typedValue}
        type="text"
        className="absolute w-full h-full top-0 left-0 z-10 opacity-0"
      />
      {isInputActive && (
        <span
          className="absolute w-0.5 h-8 bg-amber-400"
          style={{
            top: `${caretPosition.y - 5}px`,
            left: `${caretPosition.x - 5}px`,
            transition: "left 0.1s ease-out, top 0.1s ease-out",
          }}
        />
      )}
      {characters.map((char, index) => (
        <span
          key={Math.random()}
          className={getCharacterColor(index)}
          ref={(el) => {
            characterRefs.current[index] = el;
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </div>
  );
}
