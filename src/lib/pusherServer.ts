// pusherServer.ts (for backend usage)
import Pusher from "pusher";

let pusherServer: Pusher | null = null;

// Server-side Pusher initialization
export function initializePusherServer() {
  if (!pusherServer) {
    pusherServer = new Pusher({
      appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
      key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
      secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      useTLS: false, // Ensure TLS for secure connections
    });
  }
  return pusherServer;
}

export async function triggerParticipantJoinedEvent(
  gameId: string,
  userId: string
) {
  try {
    console.log(
      `Triggering Pusher event for game-${gameId}, participant joined: ${userId}`
    );
    const pusher = initializePusherServer();
    await pusher.trigger(`game-${gameId}`, "participant-joined", {
      userId: userId,
    });
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    throw error;
  }
}

export async function triggerParticipantLeftEvent(
  gameId: string,
  userId: string
) {
  try {
    console.log(
      `Triggering Pusher event for game-${gameId}, participant left: ${userId}`
    );
    const pusher = initializePusherServer();
    await pusher.trigger(`game-${gameId}`, "participant-left", {
      userId: userId,
    });
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    throw error;
  }
}

export async function triggerParticipantInterestChange(
  gameId: string,
  userId: string
) {
  try {
    console.log(
      `Triggering Pusher event for game-${gameId}, participant ${userId} interests changed`
    );
    const pusher = initializePusherServer();
    await pusher.trigger(`game-${gameId}`, "participant-interests-change", {
      userId: userId,
    });
  } catch (error) {
    console.error("Error triggering Pusher event:", error);
    throw error;
  }
}
