"use client";
import { useGameStore } from "@/stores/gameStore";

export default function Question() {
  const currentQuestion = useGameStore((state) => state.currentQuestion);
  return (
    <div className="flex flex-col text-lg w-full text-center max-w-md p-12 italic mx-auto stretch">
      <div className="whitespace-pre-wrap">{currentQuestion}</div>
    </div>
  );
}
