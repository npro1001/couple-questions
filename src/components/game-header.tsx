"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";
import Logo from "./logo";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useGameStore } from "@/stores/gameStore";
import { leaveGame } from "@/actions/actions";

export default function GameHeader() {
  const { gameId } = useGameStore();
  const handleLeaveGame = () => {
    leaveGame(gameId)
      .then(() => {
        // Handle successful leave game action
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  return (
    <header className="flex w-full justify-between items-center py-3 border-b border-black">
      <div className="flex-1">
        <Button
          variant="outline"
          size="icon"
          className="border-none shadow hover:bg-black/5"
          asChild
          onClick={handleLeaveGame}
        >
          <Link href="/app/dashboard">
            <ArrowLeftIcon />
          </Link>
        </Button>
      </div>
      <p className="font-playwrite text-3xl">
        <span className="font-bold">Couple Questions</span>
      </p>
      <div className="flex flex-1 justify-end"></div>
    </header>
  );
}
