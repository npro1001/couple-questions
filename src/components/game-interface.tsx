"use client";
import React, { useEffect } from "react";
import QuestionCard from "./question-card";
import { useUserStore } from "@/stores/userStore";
import { useGameStore } from "@/stores/gameStore";
import NextQuestionBtn from "@/components/buttons/next-question-btn";
import GameParticipants from "./game-participants";

export default function GameInterface() {
  // const initializeUser = useUserStore((state) => state.initializeUser);
  // const storeInitializeGame = useGameStore(
  //   (state) => state.storeInitializeGame
  // );

  // useEffect(() => {
  //   const initialize = async () => {
  //     await initializeUser();
  //     await storeInitializeGame();
  //   };
  //   initialize();
  // }, [storeInitializeGame, initializeUser]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center min-h-full ">
        <QuestionCard />
        <NextQuestionBtn />
      </div>
    </div>
  );
}
