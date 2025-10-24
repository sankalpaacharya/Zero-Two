import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import { createClient } from "redis";

const app = new Hono();

const redis = createClient();
redis.on("error", (err) => console.log("Redis Client Error", err));
await redis.connect();


async function createRoomRedis(socketId: string, playerName: string) {
  const roomId = `${Math.random().toString(36).slice(2, 8)}`;
  console.log("Room created:", roomId);

  // store player in room hash: field = socketId, value = playerName
  await redis.hSet(roomId, socketId, playerName);
  return roomId;
}

async function joinRoomRedis(roomId: string, socketId: string, playerName: string) {
  const exists = await redis.exists(roomId);
  if (!exists) throw new Error("RoomId doesn't exist");

  await redis.hSet(roomId, socketId, playerName);

  const players = await redis.hGetAll(roomId); 
  return players;
}

async function getPlayersByRoom(roomId: string) {
  const players = await redis.hGetAll(roomId);
  return players; 
}

async function leaveRoomRedis(roomId: string, socketId: string) {
  await redis.hDel(roomId, socketId);

  const players = await redis.hGetAll(roomId);
  if (Object.keys(players).length === 0) {
    await redis.del(roomId); // delete room if empty
  }
  return players;
}

// ===== HTTP & Socket.IO server =====

const httpServer = serve({
  fetch: app.fetch,
  port: 3001,
});

const io = new Server(httpServer as HTTPServer, { cors: { origin: ["http://localhost:3000", "http://10.30.105.190:3000"] } });

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // example test event
  socket.emit("game", "this is game data");

  // Create a room
  socket.on("createRoom", async (payload: any) => {
    try {
      const playerName = payload?.playerName ?? payload?.name ?? "";
  const roomId = await createRoomRedis(socket.id, playerName);
  socket.join(roomId);
  // fetch players and send room id, playerName and players map back to creator
  const players = await getPlayersByRoom(roomId);
  socket.emit("joinedRoom", { roomId, playerName, players });

  // send updated players to room (only this player for now)
  io.in(roomId).emit("playersUpdate", players);
    } catch (err) {
      console.error(err);
      socket.emit("error", "Could not create room");
    }
  });

  // Join existing room
  socket.on("joinRoom", async (payload: any) => {
    try {
      const playerName = payload?.playerName ?? payload?.name ?? "";
  const players = await joinRoomRedis(payload.roomId, socket.id, playerName);
  socket.join(payload.roomId);

  // optionally inform the joining socket it joined and include current players map
  socket.emit("joinedRoom", { roomId: payload.roomId, playerName, players });

  // broadcast updated players list to room
  io.in(payload.roomId).emit("playersUpdate", players);
    } catch (err) {
      console.error(err);
      socket.emit("error", (err as Error).message);
    }
  });

  // Player typed correct letter
  socket.on("typed", (payload: { roomId: string }) => {
    console.log("User typed correctly");
    socket.to(payload.roomId).emit("healthDamage", { health: "damage" });
  });

  // Player completed a word and heals
  socket.on("healthHeal", (payload: any) => {
    try {
      const roomId = payload?.roomId;
      const health = typeof payload?.health === "number" ? payload.health : 100;
      console.log("Heal triggered for room:", roomId, "by:", socket.id, "-> health:", health);
      // notify other sockets in the room about the heal and include the health value
      socket.to(roomId).emit("healthHeal", { health, from: socket.id });
    } catch (err) {
      console.error("Error handling healthHeal", err);
    }
  });

  // Handle disconnect
  socket.on("disconnecting", async () => {
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
    for (const roomId of rooms) {
      const players = await leaveRoomRedis(roomId, socket.id);
      io.in(roomId).emit("playersUpdate", players);
    }
    console.log("Disconnected:", socket.id);
  });
});
