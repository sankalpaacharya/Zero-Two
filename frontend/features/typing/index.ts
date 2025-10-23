/**
 * Core typing system exports
 * Import from here to use the typing functionality
 */

// Hooks
export { useTypingCore } from "./hooks/useTypingCore";
export { useTypingRenderer } from "./hooks/useTypingRenderer";

// Components
export { TypingArea } from "./components/TypingArea";

// Types
export type {
  TypingState,
  TypingConfig,
  TypingRenderState,
  CharacterStyle,
  CharacterStyler,
} from "./types";
