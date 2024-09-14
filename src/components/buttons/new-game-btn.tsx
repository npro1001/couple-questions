"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { actionCreateGame } from "@/actions/game-actions";

export default function NewGameBtn() {
  return (
    <Button
      variant={"default"}
      onClick={() => actionCreateGame()}
      className="mt-4"
      asChild
    >
      <p>New game</p>
    </Button>
  );
}
