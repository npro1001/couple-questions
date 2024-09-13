import ContentBlock from "@/components/content-block";
import { Button } from "@/components/ui/button";
import React from "react";
import UserInfo from "@/components/user-info";
import InviteButton from "@/components/buttons/invite-button";
import Image from "next/image";
import LobbyInfo from "@/components/lobby-info";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function GameLobbyPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <main>
      <div className="flex justify-between items-center py-8">
        <h1 className="text-2xl">
          <span className="font-semibold">Game</span>Lobby
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
      <div className="flex flex-row gap-4 justify-center items-center">
        <LobbyInfo userId={session.user.id} />
      </div>
    </main>
  );
}
