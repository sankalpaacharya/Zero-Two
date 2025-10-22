"use client";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import { Input } from "@/components/ui/8bit/input";
import ChapterIntro from "@/components/ui/8bit/blocks/chapter-intro";
import {
  ChangeEvent,
  ReactEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getSocket } from "@/lib/socket";
import { useGameStore } from "@/store/gameStore";
import { redirect } from "next/navigation";
import { toast } from "@/components/ui/8bit/toast";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-image2">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        {/* <ChapterIntro
          title="Type Kill"
          backgroundSrc="/images/keyboards.png"
          darken={10}
          subtitle="Type fast to kill your op"
          align="center"
        /> */}
        <GameStart />
      </div>
    </div>
  );
}

function GameStart() {
  const [roomId, setRoomId] = useState("");
  const { setRoomId: addRoomId } = useGameStore();
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const socket = getSocket();

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const typedName = e.target.value;
    setName(() => typedName);
    localStorage.setItem("name", typedName);
  };

  const createRoom = useCallback(() => {
    if (name.trim() === "") {
      toast("⛩️ Please enter your name");
      return;
    }
    socket.emit("createRoom");
  }, [socket, name]);

  const joinRoom = useCallback(() => {
    if (name.trim() === "") {
      toast("⛩️ Please enter your name");
      return;
    }
    socket.emit("joinRoom", { roomId });
    addRoomId(roomId);
    redirect(`/game/${roomId}`);
  }, [socket, roomId, addRoomId, name]);

  useEffect(() => {
    socket.on("joinedRoom", (payload) => {
      addRoomId(payload.roomId);
      redirect(`/game/${payload.roomId}`);
    });
  }, [socket, addRoomId]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Racer</CardTitle>
        <CardDescription>kill the op with your speed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={onNameChange}
        />
        <Input
          type="text"
          placeholder="Enter a room Id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <div className="flex gap-6 w-full flex-col">
          <Button className="w-full" onClick={createRoom}>
            Create Room
          </Button>
          {roomId ? (
            <Button className="w-full" onClick={joinRoom}>
              Join
            </Button>
          ) : (
            <Button className="w-full flex-1" disabled>
              Join
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
