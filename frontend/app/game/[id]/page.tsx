"use client";
import Typing from "@/components/typing";
// ...existing code...
import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Clock from "@/components/timer";
import { useGameStore } from "@/store/gameStore";
import AvatarDialog from "@/components/avatar-dialog";

export default function Page() {
  const socket = getSocket();
  const { id } = useParams(); // id is currently unused
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, _setOpponentHealth] = useState(100);
  const { isStarted, playerLives, opponentLives } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/sounds/bg-music.mp3");
    audio.loop = true;
    audio.volume = 0.7;
    audioRef.current = audio;

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.log("Audio playback failed:", error);
      }
    };

    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

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
    <div className="w-full h-screen bg-image">
      <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-cover bg-center bg-no-repeat">
        <header className="flex items-start justify-between gap-4 w-full">
          <div className="flex gap-3">
            <AvatarDialog
              dialog="I will beat your ass"
              avatar={1}
              name="Sanku"
              health={playerHealth}
              lives={playerLives}
              getHealthColor={getHealthColor}
            />
          </div>
          <div className="flex items-start gap-3">
            <AvatarDialog
              dialog="Try me!"
              avatar={3}
              name="Nishit"
              className="order-1 sm:order-2"
              health={opponentHealth}
              lives={opponentLives}
              getHealthColor={getHealthColor}
            />
          </div>
        </header>

        {/* Main Arena */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-4 text-center">
            <Clock isRunning={isStarted} />
          </div>

          <div className="w-full mb-10">
            <Typing />
          </div>
        </main>
      </div>
    </div>
  );
}

function getHealthColor(value: number) {
  if (value > 70) return "bg-green-500";
  if (value > 30) return "bg-yellow-500";
  return "bg-red-500";
}
