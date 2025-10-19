import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import Link from "next/link";
import Typing from "@/components/typing";

export default function Home() {
  return (
    <div className="flex items-center h-screen justify-center flex-col gap-10">
      <GameStart />
      {/* <Typing /> */}
    </div>
  );
}

function GameStart() {
  return (
    <Card className="w-md ">
      <CardHeader>
        <CardTitle>Racer</CardTitle>
        <CardDescription>kill the op with your speed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href={"/game"}>
          <Button>Start the Game</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
