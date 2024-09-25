"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { useChat } from "ai/react";
import { actionSetQuestion } from "@/actions/game-actions";
import { getRandomInterest, getRandomQuestionType } from "./utils";

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
  const {
    questionTypes,
    pocketLevel,
    combinedInterests,
    gameId,
    storeSetCurrentQuestion,
    storeSetCurrentQuestionChosenInterest,
    storeSetCurrentQuestionChosenType,
  } = useGameStore((state) => ({
    questionTypes: state.questionTypes,
    pocketLevel: state.pocketLevel,
    combinedInterests: state.combinedInterests,
    gameId: state.gameId,
    storeSetCurrentQuestion: state.storeSetCurrentQuestion,
    storeSetCurrentQuestionChosenInterest:
      state.storeSetCurrentQuestionChosenInterest,
    storeSetCurrentQuestionChosenType: state.storeSetCurrentQuestionChosenType,
  }));

  const chosenQuestionType = getRandomQuestionType(questionTypes);
  const chosenInterest = getRandomInterest(combinedInterests);

  // Function to fetch the next question
  const fetchNextQuestion = async () => {
    // Predefined string to send to the AI
    console.log("Fetching next question");
    const predefinedQuestion = `Ask me a question that will lead to fun conversation. This should be a '${chosenQuestionType}' question, with an 'out-of-pocket level' of ${pocketLevel} out of 10. \
      Keep the question relevant to the interest '${chosenInterest}'. The higher the pocket-level, the more provocative, taboo, or wild the question can be. \
      This question is for a mature audience, so it can be provocative or edgy if necessary. Please ensure the theme remains focused on '${chosenInterest}'.`;

    console.log(predefinedQuestion);

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

    storeSetCurrentQuestion(response as string);
    storeSetCurrentQuestionChosenInterest(chosenInterest);
    storeSetCurrentQuestionChosenType(chosenQuestionType);

    await actionSetQuestion(gameId!, response as string);
  };

  // Trigger fetching the next question when the hook is first used
  useEffect(() => {
    fetchNextQuestion();
  }, []); // Empty array so it runs only once when the component mounts

  // Return the function to allow calling it manually (e.g., from a button click)
  return fetchNextQuestion;
}
