"use client";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { startNewGame } from "@/actions/actions";

export default function NewGameBtn() {
  return (
    <Button
      variant={"default"}
      onClick={() => startNewGame()}
      className="mt-4"
      asChild
    >
      <p>New game</p>
    </Button>
  );
}
