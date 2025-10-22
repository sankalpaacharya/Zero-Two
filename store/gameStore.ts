import { create } from "zustand";
import { combine } from "zustand/middleware";

interface GameState {
  roomId: string;
  players: string[];
  isStarted: boolean;
  playerLives: number;
  opponentLives: number;
  setRoomId: (id: string) => void;
  setPlayers: (players: string[]) => void;
  setIsStarted: (isStarted: boolean) => void;
  setPlayerLives: (lives: number) => void;
  setOpponentLives: (lives: number) => void;
  decreasePlayerLives: () => void;
  decreaseOpponentLives: () => void;
}

export const useGameStore = create<GameState>(
  combine(
    {
      roomId: "",
      players: [] as string[],
      isStarted: false,
      playerLives: 3,
      opponentLives: 3,
    },
    (set) => ({
      setRoomId: (id: string) => set({ roomId: id }),
      setPlayers: (players: string[]) => set({ players }),
      setIsStarted: (isStarted: boolean) => set({ isStarted }),
      setPlayerLives: (lives: number) => set({ playerLives: lives }),
      setOpponentLives: (lives: number) => set({ opponentLives: lives }),
      decreasePlayerLives: () =>
        set((state) => ({ playerLives: Math.max(0, state.playerLives - 1) })),
      decreaseOpponentLives: () =>
        set((state) => ({
          opponentLives: Math.max(0, state.opponentLives - 1),
        })),
    }),
  ),
);
