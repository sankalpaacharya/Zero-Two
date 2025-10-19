"use client";
import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";

export default function SocketClient() {
  useEffect(() => {
    // auto-connect to same origin
    const socket: Socket = io({
      // with default path '/socket.io'
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("socket.io connected", socket.id);
    });

    socket.on("hello", (payload) => {
      console.log("server says hello", payload);
      // Try a ping/pong
      socket.emit("ping");
    });

    socket.on("pong", () => {
      console.log("received pong from server");
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
