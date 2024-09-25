import Image from "next/image";
import LobbyInfo from "@/components/lobby-info";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { serverAddUserToGame } from "@/lib/server-utils";
import toast, { Toaster } from "react-hot-toast";
import { gameLobbySearchParamsSchema } from "@/lib/validations";
import UserCoins from "@/components/user-coins";
import { GameSettings } from "@/components/game-settings";
import ContentBlock from "@/components/content-block";
import { Button } from "@/components/ui/button";
import LobbyActions from "@/components/lobby-actions";

type GameLobbyPageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function GameLobbyPage({
  searchParams,
}: GameLobbyPageProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const validatedGameLobbySearchParams =
    gameLobbySearchParamsSchema.safeParse(searchParams);
  if (!validatedGameLobbySearchParams.success) {
    redirect("/app/dashboard");
  }
  const { invite: gameId } = validatedGameLobbySearchParams.data;
  if (gameId) {
    await serverAddUserToGame(gameId);
    redirect("/app/game-lobby");
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex justify-between items-center py-8">
        <h1 className="text-2xl">
          <span className="font-semibold">Game</span>Lobby
        </h1>
        <div className="flex flex-row gap-2 shadow-md p-4 rounded-md">
          <div className="flex justify-center w-full gap-2 p-1 ">
            <span className="font-semibold">10</span>
            <Image src="/coin.png" alt="q-coin-image" width={25} height={25} />
          </div>
          <div className="flex justify-center w-full gap-2 p-1">
            <span className="font-semibold">5</span>
            <Image src="/skip.png" alt="q-coin-image" width={25} height={25} />
          </div>
        </div>
        {/* <UserCoins /> */}
      </div>
      <div className="flex flex-col gap-4 justify-center items-center">
        <ContentBlock className="flex flex-col p-8 gap-4 bg-transparent border-transparent shadow-none max-w-[700px]">
          <LobbyInfo userId={session.user.id} />
          <GameSettings />
        </ContentBlock>
      </div>
      <footer className="w-full bg-gray-300 p-8 shadow-2xl fixed bottom-0 left-0">
        <div className="max-w-[700px] mx-auto w-full">
          <LobbyActions />
        </div>
      </footer>
    </main>
  );
}
