import LeaveGameBtn from "./buttons/leave-game-btn";
import GameParticipants from "./game-participants";

export default function GameHeader() {
  return (
    <header className="flex w-full justify-between items-center py-3 border-b border-black">
      <div className="flex-1">
        <LeaveGameBtn />
      </div>
      <p className="font-playwrite text-3xl">
        <span className="font-bold">Couple Questions</span>
      </p>
      <div className="flex flex-1 justify-end">
        <GameParticipants />
      </div>
    </header>
  );
}
