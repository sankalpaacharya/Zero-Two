"use client";
import SocketClient from "@/components/socket-client";
import Typing from "@/components/typing";
import { Progress } from "@/components/ui/8bit/progress";
import { useState } from "react";

export default function Page() {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);

  return (
    <div className="flex  items-center flex-col border h-screen gap-2 max-w-7xl mx-auto">
      <SocketClient />
      <div className="space-y-10 mt-10 flex flex-col justify-center w-full items-center">
        <div className="">
          <p className="uppercase">Sanku</p>
          <Progress
            value={playerHealth}
            className="w-md"
            progressBg={getHealthColor(playerHealth)}
          />
        </div>
        <div>
          <p className="uppercase">nishit</p>
          <Progress
            value={opponentHealth}
            className="w-md"
            progressBg={getHealthColor(opponentHealth)}
          />
        </div>
      </div>
      <div className="mt-10">
        <Typing />
      </div>
    </div>
  );
}

function getHealthColor(value: number) {
  if (value > 70) return "bg-green-500";
  if (value > 30) return "bg-yellow-500";
  return "bg-red-500";
}
