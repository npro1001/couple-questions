"use server";

import { signIn, signOut } from "@/lib/auth";
import {
  addUserInterest,
  createGame,
  createUser,
  getGameDetails,
  getUserActiveGameId,
  getUserInfo,
  removeUserFromGame,
} from "@/lib/server-utils";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";

// export async function logIn(prevState: unknown, formData: unknown) {
export async function logIn(formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }
  await signIn("credentials", formData);
}

export async function logOut() {
  await signOut({ redirectTo: "/login" });
}
// export async function signUp(prevState: unknown, formData: unknown) {
export async function signUp(formData: FormData) {
  if (!(formData instanceof FormData)) {
    return { message: "Invalid form data" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const hashedPassword = await bcrypt.hash(
    formData.get("password") as string,
    10
  );

  const user = await createUser(name, email, hashedPassword);
  if (!user) {
    return { message: "Failed to create user" };
  }

  await signIn("credentials", formData);
}

export async function startNewGame() {
  const game = await createGame();
  if (!game) {
    return { message: "Failed to create game" };
  }

  revalidatePath("/app/game-lobby", "page");
}

export async function leaveGame(gameId) {
  await removeUserFromGame(gameId);
}

export async function getUsersGame() {
  const activeGameId = await getUserActiveGameId();
  if (!activeGameId) {
    return null;
  }
  return activeGameId;
}

export async function getGame(gameId: string) {
  const game = await getGameDetails(gameId);
  return game;
}

export async function getUserInfoById(userId: string) {
  const user = await getUserInfo(userId);
  return user;
}

export async function addInterest(userId: string, interest: string) {
  return await addUserInterest(userId, interest);
}
