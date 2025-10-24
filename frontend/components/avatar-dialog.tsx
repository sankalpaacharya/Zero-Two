import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/8bit/avatar";
import { Alert, AlertTitle } from "@/components/ui/8bit/alert";
import { Card } from "./ui/8bit/card";
import { Progress } from "@/components/ui/8bit/progress";
import Image from "next/image";

type AvatarDialogProps = {
  dialog?: string;
  avatar?: string | number;
  name?: string;
  className?: string;
  health?: number;
  lives?: number;
  getHealthColor?: (value: number) => string;
};

export default function AvatarDialog({
  dialog,
  avatar = 4,
  name,
  className,
  health = 100,
  lives = 3,
  getHealthColor = (value: number) => {
    if (value > 70) return "bg-green-500";
    if (value > 30) return "bg-yellow-500";
    return "bg-red-500";
  },
}: AvatarDialogProps) {
  return (
    <div className={className}>
      <Card className="flex flex-col items-start gap-1 backdrop-blur-sm p-4 rounded-lg border border-white/10">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage
              src={`/characters/${avatar}.png`}
              alt={name ?? "player"}
            />
            <AvatarFallback>
              {(name?.slice(0, 2) ?? "PL").toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            {name && (
              <p className="uppercase text-sm text-white font-semibold">
                {name}
              </p>
            )}
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, index) => (
                <Image
                  key={index}
                  src="/images/life.png"
                  alt="life"
                  width={20}
                  height={20}
                  className={`transition-opacity duration-300 ${
                    index < lives ? "opacity-100" : "opacity-20 grayscale"
                  }`}
                  // make image rendering stable and avoid layout shifts
                  loading="eager"
                  draggable={false}
                />
              ))}
            </div>
          </div>
        </div>
        <Progress
          value={health}
          className="h-3 w-40 sm:w-56 mt-1"
          progressBg={getHealthColor(health)}
        />
      </Card>
      {dialog && dialog.trim().length > 0 && (
        <Alert className="mt-2">
          <AlertTitle className="text-xs sm:text-sm">{dialog}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
