// import "server-only";

import { User } from ".prisma/client";
import prisma from "./db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function serverGetUserByEmail(
  email: User["email"]
): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user;
}

export async function serverCreateUser(
  name: User["name"],
  email: User["email"],
  hashedPassword: User["hashedPassword"]
): Promise<User> {
  const user = await prisma.user.create({
    data: {
      name,
      email,
      hashedPassword,
    },
  });
  return user;
}

export async function serverCreateGame() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  console.log(session.user.id);

  const game = await prisma.game.create({
    data: {
      host: {
        connect: { id: session.user.id },
      },
      // hostId: session.user.id, -- had to delete after changing the Game.User and Game.hostId to nullable (String?)
      participantIds: [session.user.id],
    },
  });
  if (!game) {
    throw Error("Failed to create game");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { activeGameId: game.id },
  });

  const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/app/game-lobby?invite=${game.id}`;

  return { game, inviteLink };
}

export async function serverRemoveUserFromGame(gameId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  let game;
  game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) {
    throw new Error("Game not found or user is not a participant");
  }

  // Remove user from the participants
  await prisma.game.update({
    where: { id: gameId },
    data: {
      participantIds: {
        set: game.participantIds.filter((id: string) => id !== session.user.id),
      },
    },
  });

  // Get updated game object
  game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  // If user is the host
  if (game.hostId === session.user.id) {
    console.log("User was the host");

    // Change host
    if (game.participantIds.length > 0) {
      console.log("Changing host");
      await prisma.game.update({
        where: { id: gameId },
        data: { hostId: game.participantIds[0] },
      });

      // Delete game
    } else {
      console.log("Deleting game");
      await prisma.game.delete({
        where: { id: gameId },
      });
    }
  }

  // Remove the activeGameId from the user's record
  await prisma.user.update({
    where: { id: session.user.id },
    data: { activeGameId: null },
  });
}

export async function serverGetUserActiveGameId() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
    // throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { activeGameId: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.activeGameId;
}

export async function serverGetGameDetails(gameId: string) {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
    select: {
      id: true,
      hostId: true,
      participantIds: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  return {
    id: game.id,
    hostId: game.hostId,
    participantIds: game.participantIds.map((id: string) => id),
  };
}

export async function serverGetUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, interests: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function serverAddUserToGame(gameId: string) {
  console.log("ADDING USER TO GAME");

  const session = await auth();
  if (!session?.user) {
    console.log("NO SESSION");
    redirect("/login");
  }

  console.log("UPDATING GAME: ", gameId);
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game) {
    console.log("Game not found");
    throw new Error("Game not found");
  }

  console.log("UPDATING USER");
  await prisma.game.update({
    where: { id: gameId },
    data: {
      participantIds: {
        push: session.user.id, // Add the user to the participants list
      },
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { activeGameId: gameId },
  });

  console.log(`User ${session.user.id} added to game ${gameId}`);
}

export async function serverAddUserInterest(userId: string, interest: string) {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      interests: {
        push: interest,
      },
    },
  });

  // await pusher.trigger('game-channel', 'interests-updated', {
  //   userId: updatedUser.id,
  //   interests: updatedUser.interests,
  // });

  return updatedUser;
}
