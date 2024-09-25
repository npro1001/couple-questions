"use client";
import { useGameStore } from "@/stores/gameStore";
import { Badge } from "./ui/badge";

export default function Question() {
  const currentQuestion = useGameStore((state) => state.currentQuestion);
  const { currentQuestionChosenInterest, currentQuestionChosenType } =
    useGameStore();
  return (
    <div className="flex flex-col text-lg w-full text-center max-w-md p-12 italic mx-auto stretch">
      {currentQuestion ? (
        <div className="whitespace-pre-wrap">{currentQuestion}</div>
      ) : (
        <div>Loading...</div>
      )}
      <div className="flex justify-center flex-wrap gap-4 mt-4">
        <Badge className="rounded-xl bg-transparent text-black border-black hover:bg-transparent cursor-pointer">
          {currentQuestionChosenInterest}
        </Badge>
        <Badge className="rounded-xl bg-transparent text-black border-black hover:bg-transparent cursor-pointer">
          {currentQuestionChosenType}
        </Badge>
      </div>
    </div>
  );
}
