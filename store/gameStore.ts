import { create } from "zustand";
import { combine } from "zustand/middleware";

interface GameState {
  roomId: string;
  players: string[];
  setRoomId: (id: string) => void;
  setPlayers: (players: string[]) => void;
}

export const useGameStore = create<GameState>(
  combine(
    {
      roomId: "",
      players: [] as string[],
    },
    (set) => ({
      setRoomId: (id: string) => set({ roomId: id }),
      setPlayers: (players: string[]) => set({ players }),
    }),
  ),
);
