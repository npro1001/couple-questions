"use client";

import { useGameStore } from "@/stores/gameStore";
import React, { useEffect } from "react";

export default function Question() {
  const { currentQuestion, storeInitializeGame } = useGameStore();

  useEffect(() => {
    storeInitializeGame();
  }, [currentQuestion]);
  return <div>{currentQuestion}</div>;
}
