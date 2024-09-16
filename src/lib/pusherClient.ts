import Pusher from "pusher-js";

let pusherClient: Pusher | null = null;

export function initializePusherClient() {
  // Check if the client already exists to avoid creating multiple instances
  if (!pusherClient) {
    Pusher.logToConsole = true;
    pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
  }
  return pusherClient;
}

export function subscribeToChannel(channelName: string) {
  const pusher = initializePusherClient();
  const channel = pusher.subscribe(channelName);
  return channel;
}

export function unsubscribeFromChannel(channelName: string) {
  const pusher = initializePusherClient();
  pusher.unsubscribe(channelName);
}

export function cleanupPusher() {
  if (pusherClient) {
    pusherClient.disconnect();
    pusherClient = null; // Reset to null for reinitialization later
  }
}
