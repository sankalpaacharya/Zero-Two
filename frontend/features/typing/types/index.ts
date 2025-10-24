/**
 * Core typing system types
 * These types are reusable across any typing-based game
 */

export interface TypingState {
  activeWord: number;
  currCharIndex: number;
  typedValue: string;
  correctCharacterMap: Map<string, boolean>;
}

export interface TypingConfig {
  words: string[];
  /** Callback when a correct character is typed */
  onCorrectChar?: (wordIndex: number, charIndex: number) => void;
  /** Callback when a word is completed */
  onWordComplete?: (wordIndex: number, typedString:string) => void;
  /** Callback when an incorrect character is typed */
  onIncorrectChar?: (wordIndex: number, charIndex: number) => void;
  /** Callback when any typing occurs */
  onType?: (state: TypingState) => void;
}

export interface TypingRenderState {
  caretPos: { x: number; y: number };
  isInputActive: boolean;
}

export interface CharacterStyle {
  color: string;
  className?: string;
}

export type CharacterStyler = (
  wordIndex: number,
  charIndex: number,
  correctCharacterMap: Map<string, boolean>,
) => CharacterStyle;
