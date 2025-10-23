import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Server } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import { createClient } from "redis";

const app = new Hono();

const redis = createClient();
redis.on('error', err => console.log('Redis Client Error', err));
await redis.connect();


async function createRoomRedis(socketId: string) {
  const roomId = `${Math.random().toString(36).slice(2, 8)}`;
  console.log("room has been created");
  await redis.sAdd(roomId, socketId); 
  return roomId;
}

async function joinRoomRedis(roomId:string, socketId:string){
  const exist = redis.exists(roomId)
  if(!exist) throw new Error ("redis key error: RoomId doesn't exist")
  await redis.sAdd(roomId,socketId)
  const players = await redis.sMembers(roomId)
  return players
}

async function getPlayersIdByRoomId(roomId:string){
  const players = await redis.sMembers(roomId)
  return players
  
}

async function leaveRoomRedis(roomId: string, socketId: string) {
  await redis.sRem(roomId, socketId);
  const players = await redis.sMembers(roomId);
  if (players.length === 0) {
    await redis.del(roomId); 
  }
  return players;
}

const httpServer = serve({
    fetch: app.fetch,
    port: 3001,

});

const io = new Server(httpServer as HTTPServer,{cors:{origin:"http://localhost:3000"}});

io.on("connection", (socket) => {
  socket.emit("game","this is fuckign game data")

  socket.on("joinRoom",async (payload)=>{
    joinRoomRedis(payload.roomId,socket.id)
    socket.join(payload.roomId)    
  })

  socket.on("createRoom",async ()=>{
    const roomId = await createRoomRedis(socket.id)
    socket.join(roomId) 
    socket.emit("joinedRoom",{roomId})
  })

  let count = 0  
  socket.on("typed",(payload)=>{
    count++
    console.log("something is type",count);
    console.log(payload);
    socket.to(payload.roomId).emit("healthDamage","damage")
  })

});
