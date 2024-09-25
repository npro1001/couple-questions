import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRandomInterest(interests: string[]): string {
  if (interests.length === 0) {
    // throw new Error("No interests available to pick from.");
    // TODO this should be okay
    return "whatever you like";
  }
  // 20% chance to return "IGNORED"
  if (Math.random() < 0.2) {
    return "whatever you like";
  }
  const randomIndex = Math.floor(Math.random() * interests.length);
  return interests[randomIndex];
}

export function getRandomQuestionType(questionTypes: string[]): string {
  if (questionTypes.length === 0) {
    throw new Error("No question types to pick from.");
  }
  // 20% chance to return "IGNORED"
  const randomIndex = Math.floor(Math.random() * questionTypes.length);
  return questionTypes[randomIndex];
}
