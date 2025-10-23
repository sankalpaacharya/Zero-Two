import { useState, useEffect } from "react";
import { Card } from "./ui/8bit/card";

function Clock({ startMinutes = 1, isRunning = true }) {
  const [secondsLeft, setSecondsLeft] = useState(startMinutes * 60);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <Card className="text-white font-bold text-2xl backdrop-blur-sm px-6 py-3 rounded-lg border shadow-lg">
      {minutes}:{seconds}
    </Card>
  );
}

export default Clock;
