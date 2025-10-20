// import { useCallback } from "react";
// import { useGameStore } from "@/store/gameStore";

// export function useGame() {
//   const { socket, roomId, players } = useGameStore();

//   const createRoom = useCallback(() => {
//     socket.emit("createRoom");
//   }, [socket]);

//   const joinRoom = useCallback(
//     (id: string) => {
//       socket.emit("joinRoom", { roomId: id, socketId: socket.id });
//     },
//     [socket],
//   );

//   const sendTypingUpdate = useCallback(
//     (text: string) => {
//       socket.emit("typingUpdate", { text });
//     },
//     [socket],
//   );

//   return { roomId, players, createRoom, joinRoom, sendTypingUpdate };
// }
