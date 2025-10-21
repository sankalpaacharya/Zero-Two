import { create } from "zustand";
import { combine } from "zustand/middleware";

interface GameState {
  roomId: string;
  players: string[];
  isStarted: boolean;
  setRoomId: (id: string) => void;
  setPlayers: (players: string[]) => void;
  setIsStarted: (isStarted: boolean) => void;
}

export const useGameStore = create<GameState>(
  combine(
    {
      roomId: "",
      players: [] as string[],
      isStarted: false,
    },
    (set) => ({
      setRoomId: (id: string) => set({ roomId: id }),
      setPlayers: (players: string[]) => set({ players }),
      setIsStarted: (isStarted: boolean) => set({ isStarted }),
    }),
  ),
);
