"use client";
import Typing from "@/components/typing";
import { Progress } from "@/components/ui/8bit/progress";
import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Clock from "@/components/timer";
import { useGameStore } from "@/store/gameStore";

export default function Page() {
  const socket = getSocket();
  const { id } = useParams();
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const { isStarted } = useGameStore();

  console.log("Page component rendered");

  useEffect(() => {
    const handleHealthDamage = () => {
      setPlayerHealth((prev) => Math.max(prev - 1, 0));
    };

    socket.on("healthDamage", handleHealthDamage);

    return () => {
      socket.off("healthDamage", handleHealthDamage);
    };
  }, [socket]);

  useEffect(() => {
    console.log("Opponent health changed:", opponentHealth);
  }, [opponentHealth]);

  return (
    <div className="flex items-start flex-col justify-center h-screen gap-2 max-w-[120rem] mx-auto">
      <Clock isRunning={isStarted} />
      <div className="space-y-10 flex flex-col">
        {/* <h2 className="text-xl text-red-600">{id}</h2> */}

        {/* <div>
          <p className="uppercase">Sanku</p>
          <Progress
            value={playerHealth}
            className="w-md"
            progressBg={getHealthColor(playerHealth)}
          />
        </div>

        <div>
          <p className="uppercase">Nishit</p>
          <Progress
            value={opponentHealth}
            className="w-md"
            progressBg={getHealthColor(opponentHealth)}
          />
        </div> */}
      </div>

      <div className="w-full">
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
