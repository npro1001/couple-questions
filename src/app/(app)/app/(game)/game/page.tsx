import GameClientContainer from "@/components/game-client-container";
import GameParticipants from "@/components/game-participants";
import Question from "@/components/question";
import QuestionCard from "@/components/question-card";
import UserCoins from "@/components/user-coins";
import React from "react";

export default function GamePage() {
  return (
    <main>
      <GameClientContainer>
        {/* <div className="flex justify-between items-center py-8"></div> */}
        {/* <GameParticipants /> */}
        <div className="flex flex-col">
          <div className="flex flex-col items-center justify-center min-h-full">
            {/* <GameParticipants /> */}
            <QuestionCard />
          </div>
        </div>
      </GameClientContainer>
      <div className="flex gap-4 w-96" />
    </main>
  );
}
