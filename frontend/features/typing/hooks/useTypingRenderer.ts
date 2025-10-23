import { useState, useRef, useCallback } from "react";

/**
 * Hook to manage typing UI rendering concerns:
 * - Caret positioning
 * - Input focus state
 * - Viewport management (3-line scrolling)
 */
export function useTypingRenderer() {
  const [isInputActive, setIsInputActive] = useState(false);
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const charRefs = useRef<Map<string, HTMLSpanElement | null>>(new Map());

  /**
   * Update caret position based on current typing position
   */
  const updateCaretPosition = useCallback(
    (activeWord: number, currCharIndex: number, wordsLength: number) => {
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
      } else if (currCharIndex > 0 && activeWord < wordsLength) {
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
    },
    [],
  );

  /**
   * Manage 3-line viewport scrolling
   * Returns the number of words to remove from the start
   */
  const checkViewportScroll = useCallback(
    (activeWord: number, currCharIndex: number, words: string[]): number => {
      if (!containerRef.current || words.length === 0) return 0;

      const containerRect = containerRef.current.getBoundingClientRect();
      const firstWordEl = charRefs.current.get("0-0");
      if (!firstWordEl) return 0;

      const firstLineTop =
        firstWordEl.getBoundingClientRect().top - containerRect.top;

      // Get active character element
      const activeKeyCandidate = `${activeWord}-${Math.max(
        0,
        Math.min(currCharIndex, (words[activeWord]?.length ?? 1) - 1),
      )}`;
      const activeEl =
        charRefs.current.get(activeKeyCandidate) ||
        charRefs.current.get(`${activeWord}-0`);
      if (!activeEl) return 0;

      const activeTop =
        activeEl.getBoundingClientRect().top - containerRect.top;
      const lineThreshold = 18; // pixels; approximate single line height tolerance

      // Find where line 2 starts
      let secondLineTop: number | null = null;
      for (let i = 0; i < words.length; i++) {
        const wordFirstChar =
          charRefs.current.get(`${i}-0`) || charRefs.current.get(`${i}-1`);
        if (!wordFirstChar) break;
        const top =
          wordFirstChar.getBoundingClientRect().top - containerRect.top;
        if (top > firstLineTop + lineThreshold / 2) {
          secondLineTop = top;
          break;
        }
      }

      if (secondLineTop == null) return 0;

      // Find where line 3 starts
      let thirdLineTop: number | null = null;
      for (let i = 0; i < words.length; i++) {
        const wordFirstChar =
          charRefs.current.get(`${i}-0`) || charRefs.current.get(`${i}-1`);
        if (!wordFirstChar) break;
        const top =
          wordFirstChar.getBoundingClientRect().top - containerRect.top;
        if (top > secondLineTop + lineThreshold / 2) {
          thirdLineTop = top;
          break;
        }
      }

      // Only shift when caret reaches line 3
      if (
        thirdLineTop != null &&
        activeTop > thirdLineTop - lineThreshold / 2
      ) {
        let firstLineWordCount = 0;
        for (let i = 0; i < words.length; i++) {
          const wordFirstChar =
            charRefs.current.get(`${i}-0`) || charRefs.current.get(`${i}-1`);
          if (!wordFirstChar) break;
          const top =
            wordFirstChar.getBoundingClientRect().top - containerRect.top;
          if (top > firstLineTop + lineThreshold / 2) break;
          firstLineWordCount++;
        }

        return firstLineWordCount;
      }

      return 0;
    },
    [],
  );

  return {
    isInputActive,
    setIsInputActive,
    caretPos,
    containerRef,
    charRefs,
    updateCaretPosition,
    checkViewportScroll,
  };
}
