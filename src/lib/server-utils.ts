// import "server-only";

import { User } from ".prisma/client";
import prisma from "./db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  triggerGameStartedEvent,
  triggerParticipantInterestChange,
  triggerParticipantJoinedEvent,
  triggerParticipantLeftEvent,
} from "./pusherServer";

//* SERVER USER UTILS */

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

export async function serverGetAuthedUserInfo() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      interests: true,
      qCoins: true,
      qSkips: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
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

  try {
    const activeGameId = await serverGetUserActiveGameId();
    triggerParticipantInterestChange(activeGameId, userId);
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    throw error;
  }

  return updatedUser;
}

export async function serverRemoveUserInterest(
  userId: string,
  interest: string
) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // Only users can remove their own interests
  if (session.user.id !== userId) {
    return null;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      interests: {
        set: (
          await prisma.user.findUnique({ where: { id: userId } })
        ).interests.filter((i: string) => i !== interest),
      },
    },
  });

  try {
    const activeGameId = await serverGetUserActiveGameId();
    triggerParticipantInterestChange(activeGameId, userId);
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    throw error;
  }

  return updatedUser;
}

//* SERVER GAME UTILS */

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

  // Trigger a Pusher event to notify all participants
  try {
    triggerParticipantLeftEvent(gameId, session.user.id);
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    throw error;
  }
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
      currentQuestion: true,
      questionTypes: true,
      pocketLevel: true,
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
    currentQuestion: game.currentQuestion,
    questionTypes: game.questionTypes,
    pocketLevel: game.pocketLevel,
  };
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

  // Trigger a Pusher event to notify all participants
  try {
    triggerParticipantJoinedEvent(gameId, session.user.id);
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    throw error;
  }

  console.log(`User ${session.user.id} added to game ${gameId}`);
}

export async function serverStartGame(gameId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const game = await prisma.game.update({
    where: { id: gameId },
    data: {
      status: "ACTIVE",
    },
  });

  if (!game) {
    throw new Error("Game not found");
  }

  // Trigger a Pusher event to notify all participants
  try {
    triggerGameStartedEvent(gameId);
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    throw error;
  }

  return game;
}

export async function serverUseQCoin() {
  const session = await auth();
  if (!session?.user) {
    redirect("login");
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      qCoins: { decrement: 1 },
    },
  });

  return user;
}

export async function serverSetQuestion(gameId: string, question: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("login");
  }

  const game = await prisma.game.update({
    where: { id: gameId },
    data: {
      currentQuestion: question,
    },
  });

  return game;

  // TODO trigger a pusher event
}

export async function serverUpdateGameQuestionTypes(
  gameId: string,
  questionTypes: string[]
) {
  const session = await auth();
  if (!session?.user) {
    redirect("login");
  }

  const game = await prisma.game.update({
    where: { id: gameId },
    data: {
      questionTypes: questionTypes,
    },
  });

  return game;
}

export async function serverUpdateGamePocketLevel(
  gameId: string,
  pocketLevel: number
) {
  const session = await auth();
  if (!session?.user) {
    redirect("login");
  }

  const game = await prisma.game.update({
    where: { id: gameId },
    data: {
      pocketLevel: pocketLevel,
    },
  });

  return game;
}
