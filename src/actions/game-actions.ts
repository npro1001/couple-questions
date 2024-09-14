"use server";

import {
  serverCreateGame,
  serverGetGameDetails,
  serverRemoveUserFromGame,
} from "@/lib/server-utils";
import { redirect } from "next/navigation";

export async function actionCreateGame() {
  const { game } = await serverCreateGame();
  if (!game) {
    return { message: "Failed to create game" };
  }

  redirect("/app/game-lobby");
}

export async function actionRemoveUserFromGame(gameId: string) {
  await serverRemoveUserFromGame(gameId);

  redirect("/app/dashboard");
}

export async function actionGetGameDetails(gameId: string) {
  const game = await serverGetGameDetails(gameId);
  return game;
}
