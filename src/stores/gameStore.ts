import {
  actionGetGameDetails,
  actionRemoveUserFromGame,
  actionUpdatePocketLevel,
  actionUpdateQuestionTypes,
} from "@/actions/game-actions";
import {
  actionAddUserInterest,
  actionGetAuthedUserInfo,
  actionGetUserActiveGameId,
  actionGetUserInfo,
  actionRemoveUserInterest,
} from "@/actions/user-actions";
import {
  cleanupPusher,
  subscribeToChannel,
  unsubscribeFromChannel,
} from "@/lib/pusherClient";
import { User } from "@prisma/client";
import { debounce, DebouncedFunc } from "lodash";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { create } from "zustand";

type GameStore = {
  gameId: string | null;
  hostId: string | null;
  participantIds: string[];
  participants: User[];
  loading: boolean;
  isHost: boolean; // To track whether the user is the host
  currentQuestion: string;
  questionTypes: string[];
  pocketLevel: number;
  hasPusherSubscribed: boolean; // To ensure we don't double-subscribe the host
  combinedInterests: string[];
  currentQuestionChosenInterest: string;
  currentQuestionChosenType: string;
  setGameId: (id: string) => void;
  setHostId: (id: string) => void;
  setParticipantIds: (ids: string[]) => void;
  setParticipants: (participants: User[]) => void;
  storeInitializePusher: (router: AppRouterInstance) => void;
  storeInitializeGame: () => Promise<void>;
  storeAddUserInterest: (userId: string, interest: string) => Promise<void>;
  storeRemoveUserInterest: (userId: string, interest: string) => Promise<void>;
  storeLeaveGame: () => Promise<void>;
  debouncedUpdateQuestionTypes: DebouncedFunc<
    (newTypes: string[]) => Promise<void>
  >;
  storeUpdateQuestionTypes: (newTypes: string[]) => void;
  debouncedUpdatePocketLevel: DebouncedFunc<
    (newLevel: number) => Promise<void>
  >;
  storeUpdatePocketLevel: (newLevel: number) => void;
  storeSetCurrentQuestion: (q: string) => void;
  storeSetCurrentQuestionChosenInterest: (interest: string) => void;
  storeSetCurrentQuestionChosenType: (type: string) => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  gameId: null,
  participantIds: [],
  participants: [],
  loading: false,
  hostId: null,
  isHost: false, // To track whether the user is the host
  currentQuestion: "",
  questionTypes: ["get to know eachother", "scenarios"],
  pocketLevel: 3,
  combinedInterests: [],
  currentQuestionChosenInterest: "",
  currentQuestionChosenType: "",
  hasPusherSubscribed: false, // To ensure we don't double-subscribe the host
  setGameId: (id) => set({ gameId: id }),
  setHostId: (id) => set({ hostId: id }),
  setParticipantIds: (ids) => set({ participantIds: ids }),
  setParticipants: (participants) => set({ participants }),
  storeInitializePusher: (router) => {
    const { gameId } = get();
    if (!gameId) return;

    if (!useGameStore.getState().hasPusherSubscribed) {
      console.log("Setting up Pusher for real-time updates");

      // Subscribe to the Pusher channel for real-time updates
      const channel = subscribeToChannel(`game-${gameId}`);
      console.log(`Subscribed to channel game-${gameId}`);

      // Listen for the subscription success event
      channel.bind("pusher:subscription_succeeded", () => {
        console.log(`Successfully subscribed to channel game-${gameId}`);

        // Now it's safe to bind the "participant-joined" event
        // Listen for the "participant-joined" event
        channel.bind("participant-joined", async (data: { userId: string }) => {
          console.log("Pusher event received for participant-joined:", data);
          const participantThatJoined = await actionGetUserInfo(data.userId);
          set((state) => ({
            participants: [...state.participants, participantThatJoined],
          }));
          toast.success(`${participantThatJoined.name} joined the game`);
        });

        console.log("Successfully bound participant-joined event");

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
              participants: state.participants.map((participant) =>
                participant.id === participantWhoseInterestsChanged.id
                  ? participantWhoseInterestsChanged
                  : participant
              ),
            }));
          }
        );

        channel.bind("game-started", async () => {
          console.log("Pusher event received for game-started:");
          router.push(`/app/game`);
        });
      });

      // Optionally bind to a subscription error event
      channel.bind("pusher:subscription_error", (status: string) => {
        console.error("Failed to subscribe to channel", status);
      });

      // Mark that Pusher is subscribed (prevents double subscriptions)
      console.log("Pusher subscribed");
      set({ hasPusherSubscribed: true });
    }

    if (!get().hasPusherSubscribed) {
      const channel = subscribeToChannel(`game-${gameId}`);

      channel.bind("game-started", () => {
        console.log("Pusher event received for game-started");

        // Navigate to the game page
        router.push("/app/game");
      });

      set({ hasPusherSubscribed: true });
    }
  },
  storeInitializeGame: async () => {
    try {
      set({ loading: true });
      const activeGameId = await actionGetUserActiveGameId();
      const { id: userId } = await actionGetAuthedUserInfo();

      if (activeGameId) {
        // Set isHost
        const game = await actionGetGameDetails(activeGameId);
        set({ isHost: game.hostId === userId });

        // Fetch participants via participantIds
        const { participantIds } = useGameStore.getState();
        const participantsData = await Promise.all(
          participantIds.map((id) => actionGetUserInfo(id))
        );

        // Derive combinedInterests
        const deriveCombinedInterests = (
          participantsData: User[]
        ): string[] => {
          const interestsSet = new Set<string>();
          participantsData.forEach((participant) => {
            participant.interests.forEach((interest: string) => {
              interestsSet.add(interest);
            });
          });
          return Array.from(interestsSet);
        };
        const combinedInterests = deriveCombinedInterests(participantsData);

        // Set other game attributes
        set({
          gameId: game.id,
          hostId: game.hostId,
          currentQuestion: game.currentQuestion,
          participantIds: game.participantIds,
          participants: participantsData,
          questionTypes: game.questionTypes,
          pocketLevel: game.pocketLevel,
          combinedInterests: combinedInterests,
        });

        // Set up Pusher for the host immediately to receive real-time updates
        //* No longer handle pusher subscription here - done in useGameLogicHook
      } else {
        console.log("No active game found");
      }
    } catch (error) {
      console.error("Failed to initialize game", error);
    } finally {
      set({ loading: false });
    }
  },

  storeAddUserInterest: async (userId, interest) => {
    try {
      await actionAddUserInterest(userId, interest);
      set((state) => ({
        participants: state.participants.map((participant) =>
          participant.id === userId
            ? {
                ...participant,
                interests: [...participant.interests, interest],
              }
            : participant
        ),
      }));
      // state is change in pusher callback
    } catch (error) {
      console.error("Failed to update interests", error);
    }
  },

  storeRemoveUserInterest: async (userId, interest) => {
    try {
      await actionRemoveUserInterest(userId, interest);
      set((state) => ({
        participants: state.participants.map((participant) =>
          participant.id === userId
            ? {
                ...participant,
                interests: participant.interests.filter((i) => i !== interest),
              }
            : participant
        ),
      }));
      // state is change in pusher callback
    } catch (error) {
      console.error("Failed to remove interest", error);
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
      unsubscribeFromChannel(`game-${gameId}`);
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
  storeSetCurrentQuestion: (question) => set({ currentQuestion: question }),

  // Debounced API call for updating question types
  debouncedUpdateQuestionTypes: debounce(async (newTypes) => {
    const { gameId } = get();
    if (!gameId) return;
    await actionUpdateQuestionTypes(gameId, newTypes);
    toast.success("Question types changed");
  }, 1000),
  // Store update for question types with immediate state change and debounced API call
  storeUpdateQuestionTypes: (newTypes) => {
    const { isHost } = get();
    if (!isHost) {
      toast.error("Only the host can change game settings");
      return;
    }

    // Update the UI immediately
    set({ questionTypes: newTypes });

    // Trigger the debounced server-side update
    get().debouncedUpdateQuestionTypes(newTypes);
  },

  // Debounced API call for updating pocket level
  debouncedUpdatePocketLevel: debounce(async (newLevel) => {
    const { gameId } = get();
    if (!gameId) return;
    await actionUpdatePocketLevel(gameId, newLevel);
    toast.success("Pocket level changed");
  }, 500),
  // Store update for pocket level with immediate state change and debounced API call
  storeUpdatePocketLevel: (newLevel) => {
    const { isHost } = get();
    if (!isHost) {
      toast.error("Only the host can change game settings");
      return;
    }

    // Update the UI immediately
    set({ pocketLevel: newLevel });

    // Trigger the debounced server-side update
    get().debouncedUpdatePocketLevel(newLevel);
  },
  storeSetCurrentQuestionChosenInterest: (question) => {
    set({ currentQuestionChosenInterest: question });
  },
  storeSetCurrentQuestionChosenType: (type) => {
    set({ currentQuestionChosenType: type });
  },
}));
