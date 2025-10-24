import { io, type Socket } from "socket.io-client";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://10.30.105.190:3001", { autoConnect: true });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });
  }
  return socket;
};
