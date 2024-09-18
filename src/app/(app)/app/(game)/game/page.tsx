import GameClientContainer from "@/components/game-client-container";
import GameInterface from "@/components/game-interface";
import GameParticipants from "@/components/game-participants";
import UserCoins from "@/components/user-coins";
import React from "react";

export default function GamePage() {
  return (
    <main>
      <GameClientContainer>
        <div className="flex justify-between items-center py-8">
          <GameParticipants />
          {/* <UserCoins /> */}
        </div>
        <GameInterface />
      </GameClientContainer>
      <div className="flex gap-4 w-96" />
    </main>
  );
}
