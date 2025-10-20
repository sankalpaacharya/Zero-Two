import { create } from "zustand";
import { io } from "socket.io-client";

interface GameState {
  socket: ReturnType<typeof io>;
  roomId: string;
  players: string[];
  setRoomId: (id: string) => void;
  setPlayers: (players: string[]) => void;
}

export const useGameStore = create<GameState>((set) => {
  const socket = io("http://localhost:3000");

  socket.on("receiveRoomId", (payload) => set({ roomId: payload.roomId }));
  socket.on("roomUpdate", (players) => set({ players }));

  return {
    socket,
    roomId: "",
    players: [],
    setRoomId: (id) => set({ roomId: id }),
    setPlayers: (players) => set({ players }),
  };
});
