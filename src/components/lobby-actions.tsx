"use client";

import React from "react";
import InviteButton from "./buttons/invite-button";
import { Button } from "./ui/button";
import { useUserStore } from "@/stores/userStore";
import { useFetchNextQuestion, useGameLogic } from "@/lib/hooks";
import { actionStartGame } from "@/actions/game-actions";
import { useGameStore } from "@/stores/gameStore";

export default function LobbyActions() {
  const decrementQCoins = useUserStore((state) => state.decrementQCoins);
  const fetchNextQuestion = useFetchNextQuestion();
  const gameId = useGameStore((state) => state.gameId);
  useGameLogic();

  return (
    <div className="flex gap-4 w-full">
      <InviteButton />
      {/* // TODO check is host */}
      <Button
        className="w-full"
        onClick={async () => {
          await actionStartGame(gameId);
          await fetchNextQuestion();
          await decrementQCoins();
        }}
      >
        Start Game
      </Button>
    </div>
  );
}
