"use client";
import { TypingBattleGame } from "@/features/games/typing-battle";

/**
 * Legacy wrapper - now uses refactored typing system
 * This component is kept for backward compatibility
 */
export default function Typing() {
  return <TypingBattleGame />;
}
