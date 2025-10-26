"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/8bit/card";
import type { CharacterStyler } from "../types";

interface TypingAreaProps {
  words: string[];
  typedValue: string;
  correctCharacterMap: Map<string, boolean>;

  // Rendering
  isInputActive: boolean;
  caretPos: { x: number; y: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  charRefs: React.MutableRefObject<Map<string, HTMLSpanElement | null>>;

  // Handlers
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;

  // Styling
  getCharacterStyle: CharacterStyler;

  // Optional
  placeholder?: string;
  className?: string;
  containerHeight?: string;
}

/**
 * Generic typing area component - pure presentation
 * No game logic, fully reusable
 */
export function TypingArea({
  words,
  typedValue,
  correctCharacterMap,
  isInputActive,
  caretPos,
  containerRef,
  charRefs,
  onInputChange,
  onFocus,
  onBlur,
  getCharacterStyle,
  placeholder = "Click to start typing",
  className,
  containerHeight = "h-40",
}: TypingAreaProps) {
  return (
    <Card
      ref={containerRef}
      className={cn(
        "text-lg relative backdrop-blur-sm rounded-lg p-6",
        className
      )}
    >
      {!isInputActive && (
        <div className="absolute inset-0 flex justify-center items-center backdrop-blur-xs z-0">
          <p className="text-white font-semibold text-xl">{placeholder}</p>
        </div>
      )}

      <input
        type="text"
        value={typedValue}
        onChange={onInputChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="absolute inset-0 w-full h-full opacity-0 z-10"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />

      {isInputActive && (
        <span
          className="absolute w-1 caret h-6 bg-amber-400 transition-all"
          style={{ top: `${caretPos.y}px`, left: `${caretPos.x}px` }}
        />
      )}

      <div
        className={cn(
          "flex flex-wrap leading-15 overflow-hidden",
          containerHeight
        )}
      >
        {words.map((word, wIndex) => (
          <span
            // biome-ignore lint/suspicious/noArrayIndexKey: Words can repeat, index is stable in this context
            key={`word-${word}-${wIndex}`}
            className="inline-block mr-6"
          >
            {word.split("").map((char, cIndex) => {
              const key = `${wIndex}-${cIndex}`;
              const style = getCharacterStyle(
                wIndex,
                cIndex,
                correctCharacterMap
              );

              return (
                <span
                  key={key}
                  ref={(el) => {
                    charRefs.current.set(key, el);
                  }}
                  className={cn(style.color, style.className, "ml-1")}
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
