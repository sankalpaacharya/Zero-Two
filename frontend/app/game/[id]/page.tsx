"use client";
import Typing from "@/components/typing";
// ...existing code...
import { getSocket } from "@/lib/socket";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { CopyIcon, CircleCheckIcon } from "lucide-react";
import Clock from "@/components/timer";
import { useGameStore } from "@/store/gameStore";
import AvatarDialog from "@/components/avatar-dialog";
import ActionCard from "@/features/typing/components/action-card";
import { Progress } from "@/components/ui/8bit/progress";

export default function Page() {
  const socket = getSocket();
  const { id } = useParams(); // id may be string | string[] | undefined
  const roomId = Array.isArray(id) ? id[0] : id ?? "";
  const { isStarted, gameData, updateMyHealth, setPlayers, setGameData } =
    useGameStore();
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

        {/* Room info + copy button - placed under header where it is visible and makes sense */}
        <div className="flex items-center justify-center gap-3 my-3">
          {roomId ? (
            <div className="inline-flex items-center gap-2 bg-popover text-popover-foreground border border-border px-3 py-1 rounded-md">
              <span className="text-sm font-mono">Room</span>
              <span className="text-lg font-mono font-bold truncate">
                {roomId}
              </span>
              <CopyRoomButton roomId={roomId} />
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No room</div>
          )}
        </div>

        {/* Main Arena */}
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="mb-4 text-center">
            <Clock isRunning={isStarted} />
          </div>

          <div className="w-full mb-10">
            <Progress
              value={gameData.opponentHealth}
              className="h-2 mt-1 transition-all duration-150 ease-in-out"
              progressBg={getHealthColor(gameData.opponentHealth)}
            />

            <Typing />
            <Progress
              value={gameData.myHealth}
              className="h-2 mt-1 transition-all duration-150 ease-in-out"
              progressBg={getHealthColor(gameData.myHealth)}
            />
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

function CopyRoomButton({ roomId }: { roomId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
      // fallback: select and prompt
      try {
        const ta = document.createElement("textarea");
        ta.value = roomId;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error("Fallback copy failed", e);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy room id"}
      className="inline-flex items-center justify-center p-1 rounded border border-border"
    >
      {copied ? (
        <CircleCheckIcon className="size-4 text-primary" />
      ) : (
        <CopyIcon className="size-4" />
      )}
    </button>
  );
}
