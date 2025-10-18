"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Typing() {
  const message =
    "Nepal is a beautiful landlocked country nestled. This is going to be test";
  const characters = message.split("");
  const [currIndex, setCurrIndex] = useState(0);
  const [caretPosition, setCaretPosition] = useState({ x: 0, y: 0 });
  const characterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

  const handleOnType = (e: any) => {
    setCurrIndex((prev) => prev + 1);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="w-full max-w-4xl border p-8 text-2xl relative font-mono leading-relaxed break-words"
      >
        <input
          onChange={handleOnType}
          type="text"
          className="absolute w-full h-full opacity-0 top-0 left-0"
        />
        <span
          className="absolute w-0.5 h-8 bg-amber-400"
          style={{
            top: caretPosition.y + "px",
            left: caretPosition.x + "px",
            transition: "left 0.1s ease-out, top 0.1s ease-out",
          }}
        />
        {characters.map((char, index) => (
          <span
            key={index}
            ref={(el) => {
              characterRefs.current[index] = el;
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </>
  );
}
