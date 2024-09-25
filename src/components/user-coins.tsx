"use client";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";
import NextQuestionBtn from "./buttons/next-question-btn";
import { useGameStore } from "@/stores/gameStore";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Skeleton } from "./ui/skeleton";

type UserCoinsProps = {
  className?: string;
};

export default function UserCoins({ className }: UserCoinsProps) {
  const qCoins = useUserStore((state) => state.qCoins);
  const userloading = useUserStore((state) => state.loading);
  const participants = useGameStore((state) => state.participants);

  if (userloading || participants.length === 0) {
    return (
      <Skeleton className="flex flex-row gap-2 shadow-lg p-2 rounded-md"></Skeleton>
    );
  }

  return (
    <div
      className={cn("flex flex-row gap-2 shadow-lg p-2 rounded-md", className)}
    >
      <div className="mr-2 -ml-2 w-full flex text-center items-center justify-center">
        <Avatar className="h-8 w-8 shadow-md rounded-full">
          <AvatarImage src="" alt={participants[0].name} />
          <AvatarFallback className="bg-gray-300 rounded-full ">
            <p className="text-xs mt-2">{participants[0].name[0]}</p>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex justify-center w-full space-x-1 items-center">
        <span className="font-semibold">{qCoins}</span>
        <Image src="/coin.png" alt="q-coin-image" width={25} height={25} />
      </div>
      <div></div>
      <div className="flex justify-center w-full space-x-1 items-center">
        <span className="font-semibold">5</span>
        <Image src="/skip.png" alt="q-coin-image" width={25} height={25} />
      </div>
      <NextQuestionBtn />
    </div>

    // <div className="flex flex-col md:flex-row items-center gap-2 justify-center align-middle shadow-md p-4 rounded-md">
    //   {/* Coin 1 */}
    //   <div className="flex flex-col space-x-1 md:flex-row items-center">
    //     <span className="font-semibold">{qCoins}</span>
    //     <Image src="/coin.png" alt="q-coin-image" width={25} height={25} />
    //   </div>
    //   {/* Coin 2 */}
    //   <div className="flex flex-col space-x-1 md:flex-row items-center">
    //     <span className="font-semibold">5</span>
    //     <Image src="/skip.png" alt="q-coin-image" width={25} height={25} />
    //   </div>
    // </div>
  );
}
