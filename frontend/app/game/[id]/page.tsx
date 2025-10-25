"use client";
import Typing from "@/components/typing";
// ...existing code...
import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Clock from "@/components/timer";
import { useGameStore } from "@/store/gameStore";
import AvatarDialog from "@/components/avatar-dialog";
import ActionCard from "@/features/typing/components/action-card";

export default function Page() {
  const socket = getSocket();
  const { id } = useParams(); // id is currently unused
  const {
    isStarted,
    gameData,
    updateMyHealth,
    setPlayers,
    setGameData,
    updateOpponentHealth,
  } = useGameStore();
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
      updateMyHealth(-1);
    };

    const handleHealthHeal = (payload: { health?: number; from?: string }) => {
      const healedValue =
        typeof payload?.health === "number" ? payload.health : 100;
      // other player healed -> update opponent's health in our store to match
      setGameData({ opponentHealth: healedValue });
    };

    socket.on("healthDamage", handleHealthDamage);
    socket.on("healthHeal", handleHealthHeal);

    // update players list and names when server sends players info
    const handlePlayersUpdate = (playersObj: Record<string, string>) => {
      try {
        const entries = Object.entries(playersObj || {});
        const names = entries.map(([, name]) => name);
        setPlayers(names);

        const mySocketId = socket.id ?? "";
        const myName =
          playersObj[mySocketId] ||
          gameData.myName ||
          localStorage.getItem("name") ||
          "";
        const opponentEntry = entries.find(([id]) => id !== mySocketId);
        const opponentName = opponentEntry ? opponentEntry[1] : "";

        setGameData({ myName, opponentName });
      } catch (err) {
        console.error("Failed to parse playersUpdate", err);
      }
    };

    socket.on("playersUpdate", handlePlayersUpdate);

    return () => {
      socket.off("healthDamage", handleHealthDamage);
      socket.off("healthHeal", handleHealthHeal);
      socket.off("playersUpdate", handlePlayersUpdate);
    };
  }, [socket]);

  useEffect(() => {
    console.log("Opponent health changed:", gameData.opponentHealth);
  }, [gameData.opponentHealth]);

  return (
    <div className="w-full h-screen bg-image">
      <div className="min-h-screen flex flex-col max-w-7xl mx-auto px-4 sm:px-6 py-6 bg-cover bg-center bg-no-repeat">
        <header className="flex items-start justify-between gap-4 w-full">
          <div className="flex gap-3">
            <AvatarDialog
              dialog="I will beat your ass"
              avatar={1}
              name={gameData.myName || "You"}
              health={gameData.myHealth}
              lives={gameData.playerLives}
              getHealthColor={getHealthColor}
            />
          </div>
          <ActionCard />
          <div className="flex items-start gap-3">
            <AvatarDialog
              dialog="Try me!"
              avatar={3}
              name={gameData.opponentName || "Opponent"}
              className="order-1 sm:order-2"
              health={gameData.opponentHealth}
              lives={gameData.opponentLives}
              getHealthColor={getHealthColor}
            />
          </div>
        </header>

        <h2 className="text-2xl">{id}</h2>

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
