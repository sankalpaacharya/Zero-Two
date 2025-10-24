import { create } from "zustand";
import { combine } from "zustand/middleware";

interface GameData {
  myHealth: number;
  opponentHealth: number;
  playerLives: number;
  opponentLives: number;
}

interface GameState {
  roomId: string;
  players: string[];
  isStarted: boolean;
  gameData: GameData;

  // setters
  setRoomId: (id: string) => void;
  setPlayers: (players: string[]) => void;
  setIsStarted: (isStarted: boolean) => void;
  setGameData: (data: Partial<GameData>) => void;

  // helpers
  decreasePlayerLives: () => void;
  decreaseOpponentLives: () => void;
  decreaseMyHealth: (amount: number) => void;
  decreaseOpponentHealth: (amount: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>(
  combine(
    {
      roomId: "",
      players: [] as string[],
      isStarted: false,
      gameData: {
        myHealth: 100,
        opponentHealth: 100,
        playerLives: 3,
        opponentLives: 3,
      },
    },
    (set) => ({
      setRoomId: (id: string) => set({ roomId: id }),
      setPlayers: (players: string[]) => set({ players }),
      setIsStarted: (isStarted: boolean) => set({ isStarted }),
      setGameData: (data: Partial<GameData>) =>
        set((state) => ({
          gameData: { ...state.gameData, ...data },
        })),

      decreasePlayerLives: () =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            playerLives: Math.max(
              0,
              (state.gameData.playerLives ?? 0) - 1
            ),
          },
        })),

      decreaseOpponentLives: () =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            opponentLives: Math.max(
              0,
              (state.gameData.opponentLives ?? 0) - 1
            ),
          },
        })),

      decreaseMyHealth: (amount: number) =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            myHealth: Math.max(
              0,
              (state.gameData.myHealth ?? 0) - amount
            ),
          },
        })),

      decreaseOpponentHealth: (amount: number) =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            opponentHealth: Math.max(
              0,
              (state.gameData.opponentHealth ?? 0) - amount
            ),
          },
        })),

      resetGame: () =>
        set({
          gameData: {
            myHealth: 100,
            opponentHealth: 100,
            playerLives: 3,
            opponentLives: 3,
          },
        }),
    })
  )
);
