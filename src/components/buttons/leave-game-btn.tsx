"use client";

import { ArrowLeftIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useGameStore } from "@/stores/gameStore";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { DialogHeader, DialogFooter, DialogPortal } from "../ui/dialog";

export default function LeaveGameBtn() {
  const storeLeaveGame = useGameStore((state) => state.storeLeaveGame);
  const gameId = useGameStore((state) => state.gameId);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
    <>
      <Button
        variant="outline"
        size="icon"
        className="border-none shadow hover:bg-black/5"
        onClick={() => setIsDialogOpen(true)}
      >
        <ArrowLeftIcon className="p-1" />
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogPortal>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Leave Game</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to leave the game?
            </DialogDescription>
            <DialogFooter>
              <Button
                variant={"secondary"}
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant={"default"} onClick={handleLeaveGame}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
  // return (
  //   <Button
  //     variant="outline"
  //     size="icon"
  //     className="border-none shadow hover:bg-black/5"
  //     asChild
  //     onClick={handleLeaveGame}
  //   >
  //     <ArrowLeftIcon className="p-2" />
  //   </Button>
  // );
}
