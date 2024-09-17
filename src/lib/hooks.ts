// useGameLogic.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";

export function useGameLogic() {
  const router = useRouter();
  const { gameId, storeInitializePusher } = useGameStore();

  useEffect(() => {
    if (gameId) {
      storeInitializePusher(router);
    }
  }, [gameId, storeInitializePusher, router]);
}
