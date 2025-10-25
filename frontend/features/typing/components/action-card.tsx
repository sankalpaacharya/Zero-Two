import React from "react";
import { Card } from "@/components/ui/8bit/card";
import Image from "next/image";
import { Badge } from "@/components/ui/8bit/badge";

type ActionDef = {
  src: string;
  alt: string;
  keyLabel: string;
};

const ACTIONS: ActionDef[] = [
  { src: "/images/fireball.png", alt: "fireball", keyLabel: "1" },
  { src: "/images/healup.png", alt: "heal", keyLabel: "2" },
  { src: "/images/flashbang.png", alt: "flashbang", keyLabel: "3" },
];

function ActionItem({ src, alt, keyLabel }: ActionDef) {
  return (
    <div className="relative w-20 p-0 overflow-visible">
      <Card className="w-full p-0">
        <Image
          src={src}
          alt={alt}
          width={48}
          height={48}
          className="object-contain h-20 w-20"
        />
      </Card>

      <span className="absolute z-50 -top-2 -right-2 inline-flex items-center justify-center h-5 w-5 rounded bg-primary text-primary-foreground font-mono font-bold text-xs border border-border shadow-xs">
        {keyLabel}
      </span>
    </div>
  );
}

export default function ActionCard() {
  return (
    <div className="flex w-full justify-center gap-10">
      {ACTIONS.map((a) => (
        <ActionItem
          key={a.keyLabel}
          src={a.src}
          alt={a.alt}
          keyLabel={a.keyLabel}
        />
      ))}
    </div>
  );
}
