"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import {
  addUserInterest,
  addUserToGame,
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
import { redirect } from "next/navigation";
import { AuthError, NextAuthResult } from "next-auth";
import { sleep } from "@/lib/utils";
import getServerSession from "next-auth";
import { config } from "@/lib/auth"; // Make sure you import your NextAuth config

// export async function logIn(prevState: unknown, formData: unknown) {
export async function logIn(formData: FormData, callbackUrl: string) {
  if (!(formData instanceof FormData)) {
    console.log("Invalid form data");
    return { message: "Invalid form data" };
  }

  const formDataObject = Object.fromEntries(formData.entries());

  const gameId = formData.get("gameId") as string;
  console.log("GAME ID ", gameId);
  console.log("CALLBACK URL ", callbackUrl);

  try {
    await signIn("credentials", {
      ...formDataObject,
      callbackUrl,
      redirect: false,
    });

    // if (gameId) {
    //   const session = await auth();
    //   console.log(JSON.stringify(session));
    //   if (!session?.user) {
    //     console.log("Session not found after sign-in");
    //     throw new Error("Session not found after sign-in");
    //   }
    //   console.log("Calling addUserToGame with gameId:", gameId);
    //   await addUserToGame(gameId);
    // } else {
    //   console.log("NO GAME ID");
    // }

    redirect(callbackUrl);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { message: "Invalid credentials" };
        }
        default: {
          return { message: "Error. Could not sign in" };
        }
      }
    }
    throw error; //! nextjs redirect throws an error, so we need to rethrow it
  }
}

export async function logOut() {
  await signOut({ redirectTo: "/login", redirect: true });
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
  const { game } = await createGame();
  if (!game) {
    return { message: "Failed to create game" };
  }

  redirect("/app/game-lobby");
}

export async function leaveGame(gameId) {
  await removeUserFromGame(gameId);

  redirect("/app/dashboard");
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
