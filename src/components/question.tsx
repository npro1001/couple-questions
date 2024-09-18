"use client";

import { useGameStore } from "@/stores/gameStore";

export default function Question() {
  const currentQuestion = useGameStore((state) => state.currentQuestion);

  return <div>{currentQuestion}</div>;
}
