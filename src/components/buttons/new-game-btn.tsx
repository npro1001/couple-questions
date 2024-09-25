"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { actionCreateGame } from "@/actions/game-actions";

export default function NewGameBtn() {
  return (
    <Button
      variant={"default"}
      onClick={async () => {
        await actionCreateGame();
      }}
      className="mt-4 cursor-pointer"
      asChild
    >
      <p>New game</p>
    </Button>
  );
}
