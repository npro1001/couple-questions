"use server";

import {
  serverCreateGame,
  serverGetGameDetails,
  serverRemoveUserFromGame,
  serverStartGame,
} from "@/lib/server-utils";
import { redirect } from "next/navigation";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";

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

export async function actionStartGame(gameId: string) {
  const game = await serverStartGame(gameId);
  if (!game) {
    throw new Error("Failed to start game");
  }

  // redirect(`/app/game/${game.id}`); handled client side
}

export async function actionStreamNextQuestion() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // const openai = new OpenAIApi(configuration);

  const result = await streamText({
    model: openai("gpt-4o"),
    prompt: "Ask me an amazing question",
  });

  for await (const textPart of result.textStream) {
    console.log(textPart);
  }
  // stream next question
}
