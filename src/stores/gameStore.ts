import {
  actionGetGameDetails,
  actionRemoveUserFromGame,
} from "@/actions/game-actions";
import {
  actionAddUserInterest,
  actionGetUserActiveGameId,
  actionGetUserInfo,
} from "@/actions/user-actions";
import {
  cleanupPusher,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "@/lib/pusherClient";
import { User } from "@prisma/client";
import toast from "react-hot-toast";
import { create } from "zustand";

type GameStore = {
  gameId: string | null;
  hostId: string | null;
  participantIds: string[];
  participants: User[];
  loading: boolean;
  isHost: boolean; // To track whether the user is the host
  hasPusherSubscribed: boolean; // To ensure we don't double-subscribe the host
  setGameId: (id: string) => void;
  setHostId: (id: string) => void;
  setParticipantIds: (ids: string[]) => void;
  setParticipants: (participants: User[]) => void;
  storeInitializeGame: () => Promise<void>;
  // storeFetchParticipants: () => Promise<void>;
  storeUpdateInterests: (userId: string, interest: string) => Promise<void>;
  storeLeaveGame: () => Promise<void>;
};

export const useGameStore = create<GameStore>((set) => ({
  gameId: null,
  hostId: null,
  participantIds: [],
  participants: [],
  loading: false,
  isHost: false, // To track whether the user is the host
  hasPusherSubscribed: false, // To ensure we don't double-subscribe the host
  setGameId: (id) => set({ gameId: id }),
  setHostId: (id) => set({ hostId: id }),
  setParticipantIds: (ids) => set({ participantIds: ids }),
  setParticipants: (participants) => set({ participants }),

  storeInitializeGame: async () => {
    try {
      set({ loading: true });
      const activeGameId = await actionGetUserActiveGameId();

      if (activeGameId) {
        const game = await actionGetGameDetails(activeGameId);

        // Fetch participants
        const { participantIds } = useGameStore.getState();
        const participantsData = await Promise.all(
          participantIds.map((id) => actionGetUserInfo(id))
        );
        set({
          gameId: game.id,
          hostId: game.hostId,
          participantIds: game.participantIds,
          participants: participantsData,
        });

        // Set up Pusher for the host immediately to receive real-time updates
        if (!useGameStore.getState().hasPusherSubscribed) {
          console.log("Setting up Pusher for real-time updates");

          // Subscribe to the Pusher channel for real-time updates
          const channel = subscribeToChannel(`game-${game.id}`);
          console.log(`Subscribed to channel game-${game.id}`);

          // Listen for the subscription success event
          channel.bind("pusher:subscription_succeeded", () => {
            console.log(`Successfully subscribed to channel game-${game.id}`);

            // Now it's safe to bind the "participant-joined" event
            // Listen for the "participant-joined" event
            channel.bind(
              "participant-joined",
              async (data: { userId: string }) => {
                console.log(
                  "Pusher event received for participant-joined:",
                  data
                );
                const participantThatJoined = await actionGetUserInfo(
                  data.userId
                );
                set((state) => ({
                  participants: [...state.participants, participantThatJoined],
                }));
                toast.success(`${participantThatJoined.name} joined the game`);
              }
            );

            console.log("Successfully bound participant-joined event");
          });

          // Listen for the "participant-left" event
          channel.bind("participant-left", async (data: { userId: string }) => {
            console.log("Pusher event received for participant-left:", data);
            const participantThatLeft = await actionGetUserInfo(data.userId);
            set((state) => ({
              participants: state.participants.filter(
                (participant) => participant.id !== participantThatLeft.id
              ),
            }));
            toast.success(`${participantThatLeft.name} left the game`);
          });

          channel.bind(
            "participant-interests-change",
            async (data: { userId: string }) => {
              console.log(
                "Pusher event received for participant-interests-change:",
                data
              );
              const participantWhoseInterestsChanged = await actionGetUserInfo(
                data.userId
              );
              set((state) => ({
                participants: [
                  ...state.participants.filter(
                    (participant) =>
                      participant.id !== participantWhoseInterestsChanged.id
                  ),
                  participantWhoseInterestsChanged,
                ],
              }));
              // const participantsData = await Promise.all(
              //   participantIds.map((id) => actionGetUserInfo(id))
              // );
              // set(() => ({ participants: participantsData }));
            }
          );

          // Optionally bind to a subscription error event
          channel.bind("pusher:subscription_error", (status) => {
            console.error("Failed to subscribe to channel", status);
          });

          // Mark that Pusher is subscribed (prevents double subscriptions)
          console.log("Pusher subscribed");
          set({ hasPusherSubscribed: true });
        }
      } else {
        console.log("No active game found");
      }
    } catch (error) {
      console.error("Failed to initialize game", error);
    } finally {
      set({ loading: false });
    }
  },

  storeUpdateInterests: async (userId, interest) => {
    try {
      const updatedUser = await actionAddUserInterest(userId, interest);
      set((state) => ({
        participants: state.participants.map((participant) =>
          participant.id === updatedUser.id ? updatedUser : participant
        ),
      }));
    } catch (error) {
      console.error("Failed to update interests", error);
    }
  },

  storeLeaveGame: async () => {
    try {
      set({ loading: true });
      const { gameId } = useGameStore.getState();
      if (!gameId) {
        console.error("No game to leave");
        return;
      }
      await actionRemoveUserFromGame(gameId);
      const CHANNEL_NAME = "game-channel"; // !
      unsubscribeFromChannel(`game-${CHANNEL_NAME}`);
      cleanupPusher(); // Clean up the Pusher client when leaving the game
      console.log("Pusher unsubscribed");

      // Reset local game state
      set({
        gameId: null,
        hostId: null,
        participantIds: [],
        participants: [],
        hasPusherSubscribed: false,
      });
    } catch (error) {
      console.error("Failed to leave game", error);
    } finally {
      set({ loading: false });
    }
  },
}));
