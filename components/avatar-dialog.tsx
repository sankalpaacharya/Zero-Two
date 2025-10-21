import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/8bit/avatar";
import { Alert, AlertTitle } from "@/components/ui/8bit/alert";
import { Progress } from "@/components/ui/8bit/progress";

type AvatarDialogProps = {
  dialog?: string;
  avatar?: string | number;
  name?: string;
  className?: string;
  health?: number;
  getHealthColor?: (value: number) => string;
};

export default function AvatarDialog({
  dialog,
  avatar = 4,
  name,
  className,
  health = 100,
  getHealthColor = (value: number) => {
    if (value > 70) return "bg-green-500";
    if (value > 30) return "bg-yellow-500";
    return "bg-red-500";
  },
}: AvatarDialogProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-start gap-1">
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
          {name && <p className="uppercase text-sm opacity-80">{name}</p>}
        </div>
        <Progress
          value={health}
          className="h-3 w-40 sm:w-56 mt-1"
          progressBg={getHealthColor(health)}
        />
      </div>
      {dialog && dialog.trim().length > 0 && (
        <Alert className="mt-2">
          <AlertTitle className="text-xs sm:text-sm">{dialog}</AlertTitle>
        </Alert>
      )}
    </div>
  );
}
