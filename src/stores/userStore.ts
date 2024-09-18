import {
  actionGetAuthedUserInfo,
  actionUseQCoin,
} from "@/actions/user-actions";
import toast from "react-hot-toast";
import { create } from "zustand";

type UserStore = {
  userId: string;
  name: string;
  qCoins: number;
  qSkips: number;
  loading: boolean;
  setQCoins: (qCoins: number) => void;
  initializeUser: () => Promise<void>;
  decrementQCoins: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set, get) => ({
  userId: "uninitialized",
  name: "uninitialized",
  qCoins: 0,
  qSkips: 0,
  setQCoins: (qCoins) => set({ qCoins }),
  loading: true,
  initializeUser: async () => {
    try {
      set({ loading: true });
      const userInfo = await actionGetAuthedUserInfo();
      set({
        userId: userInfo.id,
        name: userInfo.name,
        qCoins: userInfo.qCoins,
        qSkips: userInfo.qSkips,
      });
    } catch (error) {
      console.error("Failed to initialize user:", error);
    } finally {
      set({ loading: false });
    }
  },
  decrementQCoins: async () => {
    const { qCoins } = get();
    if (qCoins === 0) {
      toast.error("Not enough qCoins");
      return;
    }

    try {
      await actionUseQCoin();
      set((state) => ({ qCoins: state.qCoins - 1 }));
    } catch (error) {
      console.error("Failed to use user qCoins:", error);
    }
  },
}));
