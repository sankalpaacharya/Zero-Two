"use client";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

export default function SocketClient() {
  useEffect(() => {
    // auto-connect to same origin
    const socket: Socket = io("ws://localhost:3000", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("socket.io connected", socket.id);
    });

    socket.on("hello", (payload) => {
      console.log("server says hello", payload);
    });

    socket.on("game", (payload) => {
      console.log("game payload from the server", payload);
    });

    socket.on("connect_error", (err) => {
      console.error("socket.io connect_error", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
