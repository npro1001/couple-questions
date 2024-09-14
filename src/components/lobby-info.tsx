"use client";

import { useGameStore } from "@/stores/gameStore";
import React, { useEffect } from "react";
import ContentBlock from "./content-block";
import InviteButton from "./buttons/invite-button";
import { Button } from "./ui/button";
import UserInfo from "./user-info";
import { Skeleton } from "./ui/skeleton";

type LobbyInfoProps = {
  userId: string;
};

export default function LobbyInfo({ userId }: LobbyInfoProps) {
  const { loading, gameId, participants, initializeGame, fetchParticipants } =
    useGameStore();

  useEffect(() => {
    if (!gameId) {
      initializeGame();
    }
  }, [gameId, initializeGame]);

  useEffect(() => {
    if (gameId) {
      fetchParticipants();
    }
  }, [gameId, fetchParticipants]);

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
      <div className="flex shadow-lg rounded-md items-center justify-between p-6 gap-4">
        {participants.map((participant) => (
          <UserInfo
            key={participant.id}
            name={participant.name}
            interests={participant.interests}
            initials={participant.name[0]}
            {...(userId && { userId })}
          />
        ))}
        <p className="text-xl font-semibold">⚽️</p>
      </div>
      <div className="flex gap-4 w-full">
        <InviteButton />
        <Button className="w-full">Start Game</Button>
      </div>
    </ContentBlock>
  );
}
