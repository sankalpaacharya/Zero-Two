import { create } from "zustand";
import { combine } from "zustand/middleware";

export interface GameData {
  myHealth: number;
  opponentHealth: number;
  playerLives: number;
  opponentLives: number;
  healWords: boolean[];
  myName:string,
  opponentName:string
  coins: number;
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
  setMyName: (name: string) => void;
  setOpponentName: (name: string) => void;

  // helpers
  decreasePlayerLives: () => void;
  setHealWords: (healWords: boolean[]) => void;
  decreaseOpponentLives: () => void;
  updateMyHealth: (amount: number) => void;
  updateOpponentHealth: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => void;
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
        myName:"",
      opponentName:"",

        opponentLives: 3,
        healWords: [] as boolean[],
        coins: 0,
        
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

      setMyName: (name: string) =>
        set((state) => ({
          gameData: { ...state.gameData, myName: name },
        })),

      setOpponentName: (name: string) =>
        set((state) => ({
          gameData: { ...state.gameData, opponentName: name },
        })),

      decreasePlayerLives: () =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            playerLives: Math.max(0, state.gameData.playerLives - 1),
          },
        })),

      decreaseOpponentLives: () =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            opponentLives: Math.max(0, state.gameData.opponentLives - 1),
          },
        })),

      updateMyHealth: (amount: number) =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            myHealth: Math.min(100,Math.max(0, (state.gameData.myHealth + amount)%100)),
          },
        })),

      updateOpponentHealth: (amount: number) =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            opponentHealth: Math.min(100,Math.max(0, (state.gameData.opponentHealth + amount)%100)),
          },
        })),

      setHealWords: (healWords: boolean[]) =>
        set((state) => ({
          gameData: { ...state.gameData, healWords },
        })),

      addCoins: (amount: number) =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            coins: state.gameData.coins + amount,
          },
        })),

      spendCoins: (amount: number) =>
        set((state) => ({
          gameData: {
            ...state.gameData,
            coins: Math.max(0, state.gameData.coins - amount),
          },
        })),

      resetGame: () =>
        set({
          gameData: {
            myHealth: 100,
            opponentHealth: 100,
            playerLives: 3,
            opponentLives: 3,
            myName:"",
            opponentName:"",
            healWords: [],
            coins: 0,
          },
        }),
    })
  )
);
