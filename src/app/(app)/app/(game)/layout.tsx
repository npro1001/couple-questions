import GameHeader from "@/components/game-header";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col max-w-[1050px] min-h-screen mx-auto px-4">
      <GameHeader />
      {children}
      <div className="-z-10 bg-[#fbefe2] absolute bottom-1 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75] md:right-[-33rem] lg:right-[-28rem] xl:right-[-15rem] 2xl:right-[-5rem]"></div>
      <div className="-z-10 bg-[#fbd7d7] absolute top-[-1rem] left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem] sm:w-[68.75] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem]"></div>
    </div>
  );
}
