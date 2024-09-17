// // components/GameIDValidator.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { gameLobbySearchParamsSchema } from "@/lib/validations";
// import { serverAddUserToGame } from "@/lib/server-utils";

// interface GameIDValidatorProps {
//   gameId: string;
// }

// export default function GameIDValidator({ gameId }: GameIDValidatorProps) {
//   const router = useRouter();
//   useEffect(() => {
//     const check = async (gameIdTest: string) => {
//       console.log("GAME ID", gameId);
//       const validatedGameLobbySearchParams =
//         gameLobbySearchParamsSchema.safeParse({ invite: gameIdTest });
//       if (!validatedGameLobbySearchParams.success) {
//         toast.error("Invalid game ID");
//         router.push("/app/dashboard");
//       }
//       const { invite: gameId } = validatedGameLobbySearchParams.data;
//       if (gameId) {
//         await serverAddUserToGame(gameId);
//         router.push("/app/game-lobby");
//       }
//     };
//     check(gameId);
//     // If valid, you can perform any other actions here
//   }, [gameId, router]);

//   // You can return null or any JSX if needed
//   return null;
// }
