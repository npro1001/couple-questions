"use client";
import { Button } from "@/components/ui/button";
import { useFetchNextQuestion } from "@/lib/hooks";
import { useUserStore } from "@/stores/userStore";
import { ArrowRightIcon } from "lucide-react";
import { useEffect } from "react";

export default function NextQuestionBtn() {
  const decrementQCoins = useUserStore((state) => state.decrementQCoins);
  const fetchNextQuestion = useFetchNextQuestion();

  // useEffect(() => {
  //   const initialQuestionFetch = async () => {
  //     await fetchNextQuestion();
  //   };
  //   initialQuestionFetch();
  // }, []);

  return (
    <div>
      <Button
        className="flex hover:bg-black/5 border-none bg-transparent shadow-none flex-grow p-2"
        variant={"outline"}
        onClick={async () => {
          await fetchNextQuestion();
          await decrementQCoins();
        }}
      >
        <ArrowRightIcon size={18} />
      </Button>
    </div>
  );
}
