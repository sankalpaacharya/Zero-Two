import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";

export default function Home() {
  return (
    <div className="flex items-center h-screen justify-center">
      <Card className="w-md ">
        <CardHeader>
          <CardTitle>Racer</CardTitle>
          <CardDescription>kill the op with your speed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button>Start the Game</Button>
        </CardContent>
      </Card>
    </div>
  );
}
