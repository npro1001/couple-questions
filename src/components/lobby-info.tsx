"use client";

import { useGameStore } from "@/stores/gameStore";
import React, { useEffect } from "react";
import UserInfo from "./user-info";
import { Skeleton } from "./ui/skeleton";
import { CrownIcon } from "lucide-react";

type LobbyInfoProps = {
  userId: string;
};

export default function LobbyInfo({ userId }: LobbyInfoProps) {
  const { loading, gameId, hostId, participants, storeInitializeGame } =
    useGameStore();

  useEffect(() => {
    const initializeGame = async () => {
      if (!gameId) {
        await storeInitializeGame();
      }
    };
    initializeGame();
  }, [gameId, storeInitializeGame]);

  if (!gameId || loading) {
    return (
      <Skeleton>
        {/* <div className="p-4 gap-4 bg-transparent border-transparent shadow-none w-[700px]"> */}
        <div className="rounded-full h-24 w-24 bg-transparent shadow-none"></div>
        {/* </div> */}
      </Skeleton>
    );
  }

  return (
    <>
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex shadow-lg rounded-md items-center justify-between p-6 gap-4"
        >
          <UserInfo
            key={participant.id}
            name={participant.name}
            interests={participant.interests}
            initials={participant.name[0]}
            {...(userId == participant.id && { userId })}
          />
          {participant.id === hostId && <CrownIcon />}
          {/* <p className="text-xl font-semibold">
            {" "}
            <CrownIcon />
          </p> */}
        </div>
      ))}
    </>
  );
}
