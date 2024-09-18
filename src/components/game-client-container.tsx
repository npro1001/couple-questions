"use client";

import { useGameStore } from "@/stores/gameStore";
import { useUserStore } from "@/stores/userStore";
import React, { useEffect } from "react";

export default function GameClientContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const initializeUser = useUserStore((state) => state.initializeUser);
  //   const storeInitializeGame = useGameStore(
  // (state) => state.storeInitializeGame
  //   );

  const { initializeUser } = useUserStore();
  const { storeInitializeGame, participants } = useGameStore();

  useEffect(() => {
    console.log("GameClientContainer useEffect");
    const initialize = async () => {
      await initializeUser();
      await storeInitializeGame();
    };
    initialize();
  }, [storeInitializeGame, initializeUser]);
  return <>{children}</>;
}
