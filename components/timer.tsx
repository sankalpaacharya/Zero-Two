import { useState, useEffect } from "react";

function Clock({ startMinutes = 30, isRunning = true }) {
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
    <div
      style={{ fontSize: "2rem", fontFamily: "monospace", textAlign: "center" }}
    >
      {minutes}:{seconds}
    </div>
  );
}

export default Clock;
