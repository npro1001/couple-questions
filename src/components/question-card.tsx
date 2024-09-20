import NextQuestionBtn from "./buttons/next-question-btn";
import Question from "./question";
import UserCoins from "./user-coins";

export default function QuestionCard() {
  return (
    <div className="flex flex-col items-center justify-center px-16">
      <div className="relative">
        <div className="-z-10 absolute top-0 -left-8 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply blur-xl filter opacity-70 animate-blob"></div>
        <div className="-z-10 absolute top-0 -right-8 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply blur-xl  filter opacity-70 animate-blob animation-delay-2000"></div>
        <div className="-z-10 absolute -bottom-20 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply blur-xl filter opacity-70 animate-blob animation-delay-4000"></div>
        <div className="-z-10 relative flex-1 mt-10 flex flex-col items-center justify-center border-black/35 border-2 border-round rounded-md bg-slate-300/80 min-w-[450px] min-h-[250px]">
          {/* <p className="font-playwrite text-4xl">Some Question</p> */}
          <Question />
        </div>
      </div>
      <div className="flex justify-around items-center w-full mt-2">
        <UserCoins className="pl-4 z-10 flex justify-end border-black/35 shadow-2xl" />
      </div>
    </div>
  );
}
