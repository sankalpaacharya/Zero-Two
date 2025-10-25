import React from "react";
import { Card } from "@/components/ui/8bit/card";
import Image from "next/image";
import { Badge } from "@/components/ui/8bit/badge";
import { useGameStore } from "@/store/gameStore";

type ActionDef = {
  src: string;
  alt: string;
  keyLabel: string;
  cost: number;
};

const ACTIONS: ActionDef[] = [
  { src: "/images/fireball.png", alt: "fireball", keyLabel: "1", cost: 10 },
  { src: "/images/healup.png", alt: "heal", keyLabel: "2", cost: 15 },
  { src: "/images/flashbang.png", alt: "flashbang", keyLabel: "3", cost: 20 },
];

function ActionItem({
  src,
  alt,
  keyLabel,
  cost,
  canAfford,
}: ActionDef & { canAfford: boolean }) {
  return (
    <div className="relative w-20 p-0 overflow-visible">
      <Card
        className={`w-full p-0 transition-all duration-200 ${
          canAfford ? "hover:scale-105 cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          width={48}
          height={48}
          className={`object-contain h-20 w-20 transition-all duration-200 ${
            !canAfford && "grayscale brightness-75"
          }`}
        />
      </Card>

      <span
        className={`absolute z-50 -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded bg-primary text-primary-foreground font-mono font-bold text-xs border border-border shadow-xs ${
          !canAfford && "opacity-50"
        }`}
      >
        {keyLabel}
      </span>

      <span
        className={`absolute z-50 -bottom-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded font-mono font-bold text-xs border shadow-xs ${
          canAfford
            ? "bg-yellow-500 border-yellow-600 text-yellow-950"
            : "bg-gray-500 border-gray-600 text-gray-200"
        }`}
      >
        {cost}
      </span>
    </div>
  );
}

export default function ActionCard() {
  const { gameData } = useGameStore();
  const coins = gameData.coins;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full justify-center gap-10">
        {ACTIONS.map((action) => (
          <ActionItem
            key={action.keyLabel}
            {...action}
            canAfford={coins >= action.cost}
          />
        ))}
      </div>
    </div>
  );
}
