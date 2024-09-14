"use client";

import { ArrowLeftIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useGameStore } from "@/stores/gameStore";

export default function LeaveGameBtn() {
  const storeLeaveGame = useGameStore((state) => state.storeLeaveGame);
  const gameId = useGameStore((state) => state.gameId);
  const handleLeaveGame = async () => {
    try {
      console.log(gameId);

      await storeLeaveGame();
    } catch (error) {
      console.log(gameId);
      console.error("Failed to leave game", gameId, error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="border-none shadow hover:bg-black/5"
      asChild
      onClick={handleLeaveGame}
    >
      <ArrowLeftIcon className="p-2" />
    </Button>
  );
}
