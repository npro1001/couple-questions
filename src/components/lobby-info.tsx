"use client";

import { useGameStore } from "@/stores/gameStore";
import React, { useEffect } from "react";
import ContentBlock from "./content-block";
import InviteButton from "./buttons/invite-button";
import { Button } from "./ui/button";
import UserInfo from "./user-info";
import { Skeleton } from "./ui/skeleton";
import { useGameLogic } from "@/lib/hooks";
import { actionStartGame } from "@/actions/game-actions";

type LobbyInfoProps = {
  userId: string;
};

export default function LobbyInfo({ userId }: LobbyInfoProps) {
  const { loading, gameId, participants, storeInitializeGame } = useGameStore();
  useGameLogic();

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
        <div className="p-4 gap-4 bg-transparent border-transparent shadow-none w-[700px]" />
        <div className="p-4 gap-4 bg-transparent border-transparent shadow-none w-[700px]" />
      </Skeleton>
    );
  }

  return (
    <ContentBlock className="flex flex-col p-8 gap-4 bg-transparent border-transparent shadow-none max-w-[700px]">
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
          <p className="text-xl font-semibold">⚽️</p>
        </div>
      ))}

      <div className="flex gap-4 w-full">
        <InviteButton />
        {/* // TODO check is host */}
        <Button
          className="w-full"
          onClick={async () => await actionStartGame(gameId)}
        >
          Start Game
        </Button>
      </div>
    </ContentBlock>
  );
}
