// import { useCallback } from "react";
// import { useGameStore } from "@/store/gameStore";
// import { Socket } from "socket.io-client";

// export function useGame(socket: Socket) {
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

//   return { createRoom, joinRoom, sendTypingUpdate };
// }
