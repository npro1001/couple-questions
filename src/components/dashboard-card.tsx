import NewGameBtn from "./buttons/new-game-btn";

export default function DashboardCard() {
  return (
    <div className="flex items-center justify-center px-16">
      <div className="relative">
        <div className="absolute top-0 -left-8 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply blur-xl filter opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-8 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply blur-xl  filter opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply blur-xl filter opacity-70 animate-blob animation-delay-4000"></div>
        <div className="relative flex-1 mt-10 flex flex-col items-center justify-center border-black/35 border-2 border-round rounded-md bg-slate-300/80 min-w-[450px] min-h-[250px]">
          <p className="font-playwrite text-4xl">Couple Questions</p>
          <NewGameBtn />
        </div>
      </div>
    </div>
  );
}
