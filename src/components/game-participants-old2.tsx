"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useGameStore } from "@/stores/gameStore";
import { Badge } from "./ui/badge";
import { useUserStore } from "@/stores/userStore";
import { NewInterestBtn } from "./buttons/new-interest-btn";

export default function GameParticipantsOld2() {
  const [isExpanded, setIsExpanded] = useState(false);
  const userId = useUserStore((state) => state.userId);
  const participants = useGameStore((state) => state.participants);

  const toggleLayout = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="w-full flex flex-col items-center justify-start p-4"
      style={{ zIndex: 0 }}
    >
      <div
        className="relative cursor-pointer flex justify-center items-start w-full"
        onClick={toggleLayout}
      >
        <div className="flex justify-center items-start w-full">
          {participants.map((participant, index) => (
            <div
              key={participant.id}
              className={`flex flex-col items-center transition-all duration-700 ease-in-out ${
                isExpanded ? "w-1/2" : "w-1/2"
              }`}
              style={{
                transform: isExpanded
                  ? `translateX(${index === 0 ? "-25%" : "25%"})`
                  : "translateX(0)",
              }}
            >
              <Avatar className="h-16 w-16 shadow-md rounded-full">
                <AvatarImage src="" alt={participant.name} />
                <AvatarFallback className="bg-gray-300 rounded-full">
                  <p className="text-2xl">{participant.name[0]}</p>
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex flex-col items-center space-y-2 mt-2 transition-all duration-700 ease-in-out ${
                  isExpanded
                    ? "opacity-100 max-h-[1000px]"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <p className="text-lg font-medium">{participant.name}</p>

                <div className="flex flex-wrap justify-center gap-2 mt-2 w-full max-w-[150px]">
                  {participant.interests.map((interest) => (
                    <Badge
                      key={interest}
                      className="flex justify-center items-center bg-transparent rounded-xl text-black border-black text-xs px-2 py-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Removing interest: ${interest}`);
                      }}
                    >
                      {interest}
                    </Badge>
                  ))}
                  {userId === participant.id && (
                    <NewInterestBtn userId={userId} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
