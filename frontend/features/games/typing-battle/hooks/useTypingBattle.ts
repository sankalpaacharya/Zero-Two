import { useState } from "react";
import { useTypingCore } from "@/features/typing/hooks/useTypingCore";
import { getSocket } from "@/lib/socket";
import { useGameStore } from "@/store/gameStore";

interface UseTypingBattleConfig {
  words: string[];
  roomId: string;
}
/**
 * Game-specific typing hook for typing battle game
 * Integrates core typing with game mechanics (health, socket events, etc.)
 */
export function useTypingBattle({ words, roomId }: UseTypingBattleConfig) {
  const socket = getSocket();
  const { setIsStarted, gameData,setGameData,updateOpponentHealth} = useGameStore();
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Use core typing functionality
  const typingCore = useTypingCore({
    words,
    onCorrectChar: () => {
      // Send typing event to opponent on correct character
      socket.emit("typed", { roomId });
      updateOpponentHealth(-1);

    },
    onType: (state) => {
      // Start the game on first keystroke
      if (!isGameStarted && state.typedValue.length > 0) {
        setIsGameStarted(true);
        setIsStarted(true);
      }
    },

    onWordComplete:(wordIndex,typedString)=>{
      console.log("user completed typing a word");
      if(words[wordIndex]===typedString.split(" ")[wordIndex]) {
        if(gameData.healWords[wordIndex]){
        socket.emit("healthHeal",{roomId})
        setGameData({...gameData,myHealth:100});
        }
      }
    }
  });

  return {
    ...typingCore,
    isGameStarted,
  };
}
