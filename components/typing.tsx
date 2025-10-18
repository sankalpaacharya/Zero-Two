"use client";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function Typing() {
  const message =
    "Nepal is a beautiful landlocked country nestled in the heart of the Himalayas, between India and China. Known for its breathtaking mountain ranges, including Mount Everest—the highest peak in the world—Nepal is a land of rich culture, spiritual heritage, and natural beauty. Its diverse geography ranges from snowy peaks to lush green hills and fertile plains. The people of Nepal are known for their warmth, resilience, and deep-rooted traditions reflected in vibrant festivals, temples, and art. Despite being small in size, Nepal’s cultural and natural diversity make it one of the most enchanting destinations in the world.";
  const words = message.split(" ");
  const characters = message.split("");
  const activeCharacterRef = useRef<HTMLSpanElement | null>(null);
  const [activeWord, setActiveWord] = useState(0);
  const x = activeCharacterRef.current?.clientWidth;

  useEffect(() => {}, []);

  return (
    <>
      <div className="relative">
        <span className={cn("text-amber-200", `left-[${x}px] absolute`)}>
          |
        </span>
        <span className="text-indigo-500" ref={activeCharacterRef}>
          sankalpa
        </span>
      </div>
      <div className="w-lg border flex flex-wrap text-xl break-words line-clamp-3">
        {characters.map((char, index) => (
          <span className={cn("whitespace-pre")}>{char}</span>
        ))}
      </div>
    </>
  );
}

type LetterProps = {
  char: string;
  className?: string;
};
function Letter({ char, className }: LetterProps) {
  return <span className={cn("whitespace-pre", className)}>{char}</span>;
}
