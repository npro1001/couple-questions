import GameClientContainer from "@/components/game-client-container";
import QuestionCard from "@/components/question-card";
import React from "react";

export default function GamePage() {
  return (
    <main>
      <GameClientContainer>
        <div className="flex flex-col">
          <div className="flex flex-col items-center justify-center min-h-full">
            <QuestionCard />
          </div>
        </div>
      </GameClientContainer>
      <div className="flex gap-4 w-96" />
    </main>
  );
}
