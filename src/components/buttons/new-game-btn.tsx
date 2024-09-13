"use client";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { startNewGame } from "@/actions/actions";

export default function NewGameBtn() {
  //   const handleNewGame = async () => {

  //   };
  return (
    <Button onClick={() => startNewGame()} className="mt-4" asChild>
      <Link href="/app/game-lobby">New game</Link>
    </Button>
  );
}
