import LobbyInfo from "@/components/lobby-info";
import QuestionCard from "@/components/question-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function GamePage() {
  return (
    <main>
      {/* {searchParams && searchParams.invite && (
    <GameIDValidator gameId={searchParams.invite as string} />
  )} */}
      <div className="flex justify-between items-center py-8">
        <h1 className="text-2xl">
          <span className="font-semibold">Game</span>
        </h1>
        <div className="flex flex-row gap-2 shadow-md p-4 rounded-md">
          <div className="flex justify-center w-full gap-2 p-1 ">
            <span className="font-semibold">10</span>
            <Image src="/coin.png" alt="q-coin-image" width={25} height={25} />
          </div>
          <div className="flex justify-center w-full gap-2 p-1">
            <span className="font-semibold">5</span>
            <Image src="/skip.png" alt="q-coin-image" width={25} height={25} />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        {/* <div className="h-[200px]" /> */}
        <div className="flex flex-col items-center min-h-full ">
          <QuestionCard />
          <Button className="flex-grow">Next Question</Button>
        </div>
      </div>
      <div className="flex gap-4 w-96">{/* // TODO check is host */}</div>
    </main>
  );
}
