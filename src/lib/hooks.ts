"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { useChat } from "ai/react";
import { actionSetQuestion } from "@/actions/game-actions";

export function useGameLogic() {
  const router = useRouter();
  const { gameId, storeInitializePusher } = useGameStore();

  useEffect(() => {
    if (gameId) {
      storeInitializePusher(router);
    }
  }, [gameId, storeInitializePusher, router]);
}

export function useFetchNextQuestion() {
  const { append, messages } = useChat();
  const setCurrentQuestion = useGameStore((state) => state.setCurrentQuestion);
  const gameId = useGameStore((state) => state.gameId);

  // Function to fetch the next question
  const fetchNextQuestion = async () => {
    // Predefined string to send to the AI
    console.log("Fetching next question");
    const predefinedQuestion =
      "Ask me a question that will insight conversation. This is for a card game, so it can be dirty and provacative as the audience is mature adults.";

    // Send the predefined string to the AI
    append({
      role: "user",
      content: predefinedQuestion,
    });

    // Wait for the response and update the currentQuestion state
    const response = await new Promise((resolve) => {
      const interval = setInterval(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.role === "assistant") {
          clearInterval(interval);
          resolve(lastMessage.content);
        }
      }, 100);
    });

    setCurrentQuestion(response as string);
    await actionSetQuestion(gameId!, response as string);
  };

  // Trigger fetching the next question when the hook is first used
  useEffect(() => {
    fetchNextQuestion();
  }, []); // Empty array so it runs only once when the component mounts

  // Return the function to allow calling it manually (e.g., from a button click)
  return fetchNextQuestion;
}
