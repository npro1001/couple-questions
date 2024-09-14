import {
  actionGetGameDetails,
  actionRemoveUserFromGame,
} from "@/actions/game-actions";
import {
  actionAddUserInterest,
  actionGetUserActiveGameId,
  actionGetUserInfo,
} from "@/actions/user-actions";
import { create } from "zustand";

type GameStore = {
  gameId: string | null;
  hostId: string | null;
  participantIds: string[];
  participants: any[];
  loading: boolean;
  setGameId: (id: string) => void;
  setHostId: (id: string) => void;
  setParticipantIds: (ids: string[]) => void;
  setParticipants: (participants: any[]) => void;
  storeInitializeGame: () => Promise<void>;
  storeFetchParticipants: () => Promise<void>;
  storeUpdateInterests: (userId: string, interest: string) => Promise<void>;
  storeLeaveGame: () => Promise<void>;
};

export const useGameStore = create<GameStore>((set) => ({
  gameId: null,
  hostId: null,
  participantIds: [],
  participants: [],
  loading: false,
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
        set({
          gameId: game.id,
          hostId: game.hostId,
          participantIds: game.participantIds,
          loading: false,
        });
      } else {
        console.log("activeGameId on user NOT FOUND");
      }
    } catch (error) {
      console.error("Failed to initialize game", error);
      set({ loading: false });
    }
  },

  storeFetchParticipants: async () => {
    try {
      set({ loading: true });
      const { participantIds } = useGameStore.getState();
      const participantsData = await Promise.all(
        participantIds.map((id) => actionGetUserInfo(id))
      );
      set({ participants: participantsData, loading: false });
    } catch (error) {
      console.error("Failed to fetch participants", error);
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

      // Reset local game state
      set({
        gameId: null,
        hostId: null,
        participantIds: [],
        participants: [],
      });
    } catch (error) {
      console.error("Failed to leave game", error);
    } finally {
      set({ loading: false });
    }
  },
}));
