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
import Link from "next/link";
import ChapterIntro from "@/components/ui/8bit/blocks/chapter-intro";
import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <ChapterIntro
          title="Type Kill"
          backgroundSrc="/images/keyboards.png"
          darken={10}
          subtitle="Type fast to kill your op"
          align="center"
        />
        <GameStart />
      </div>
    </div>
  );
}

function GameStart() {
  const [roomId, setRoomId] = useState("");

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Racer</CardTitle>
        <CardDescription>kill the op with your speed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="text"
          placeholder="Enter a room Id"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <div className="flex gap-4 w-full">
          <Link href="/game" className="flex-1">
            <Button className="w-full">Create Room</Button>
          </Link>
          {roomId ? (
            <Link href={`/game/${roomId}`} className="flex-1">
              <Button className="w-full">Join</Button>
            </Link>
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
