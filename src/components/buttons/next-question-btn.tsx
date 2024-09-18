"use client";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";

export default function NextQuestionBtn() {
  const decrementQCoins = useUserStore((state) => state.decrementQCoins);
  return (
    <div className="h-[200px]">
      <Button
        className="flex mt-5"
        onClick={async () => await decrementQCoins()}
      >
        Next Question
      </Button>
    </div>
  );
}
