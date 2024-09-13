import {
  addInterest,
  getGame,
  getUserInfoById,
  getUsersGame,
} from "@/actions/actions";
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
  initializeGame: () => Promise<void>;
  fetchParticipants: () => Promise<void>;
  updateInterests: (userId: string, interest: string) => Promise<void>;
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

  initializeGame: async () => {
    try {
      set({ loading: true });
      const activeGameId = await getUsersGame();

      if (activeGameId) {
        const game = await getGame(activeGameId);
        set({
          gameId: game.id,
          hostId: game.hostId,
          participantIds: game.participantIds,
          loading: false,
        });
      } else {
        console.log("activeGameId on user NOT FOUND");
        // const game = await createGame();
        // set({
        //   gameId: game.id,
        //   hostId: game.hostId,
        //   participantIds: game.participantIds,
        // });
      }
    } catch (error) {
      console.error("Failed to initialize game", error);
      set({ loading: false });
    }
  },

  fetchParticipants: async () => {
    try {
      set({ loading: true });
      const { participantIds } = useGameStore.getState();
      const participantsData = await Promise.all(
        participantIds.map((id) => getUserInfoById(id))
      );
      set({ participants: participantsData, loading: false });
    } catch (error) {
      console.error("Failed to fetch participants", error);
      set({ loading: false });
    }
  },

  updateInterests: async (userId, interest) => {
    try {
      const updatedUser = await addInterest(userId, interest);
      set((state) => ({
        participants: state.participants.map((participant) =>
          participant.id === updatedUser.id ? updatedUser : participant
        ),
      }));
    } catch (error) {
      console.error("Failed to update interests", error);
    }
  },
}));
