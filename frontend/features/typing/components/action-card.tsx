import React from "react";
import { Card } from "@/components/ui/8bit/card";
import Image from "next/image";

type Props = {};

export default function ActionCard({}: Props) {
  return (
    <div className="flex w-full justify-center gap-10">
      <Card className="w-20 p-0 relative">
        <span className="absolute size-5 text-xs bg-indigo-700 rounded-full p-1 bottom-0 right-0">
          1
        </span>
        <Image
          src={"/images/fireball.png"}
          alt="fireball"
          width={20}
          height={20}
          className="object-cover h-20 w-25"
        />
      </Card>
      <Card className="w-20 p-0 relative">
        <span className="absolute size-5 text-xs bg-indigo-700 rounded-full p-1 bottom-0 right-0">
          2
        </span>
        <Image
          src={"/images/healup.png"}
          alt="fireball"
          width={20}
          height={20}
          className="object-cover h-20 w-25"
        />
      </Card>
      <Card className="w-20 p-0 relative">
        <span className="absolute size-5 text-xs bg-indigo-700 rounded-full p-1 bottom-0 right-0">
          3
        </span>
        <Image
          src={"/images/flashbang.png"}
          alt="fireball"
          width={20}
          height={20}
          className="object-cover h-20 w-25"
        />
      </Card>
    </div>
  );
}
