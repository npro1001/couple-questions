"use client";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useGameStore } from "@/stores/gameStore";
import { Badge } from "./ui/badge";
import { useUserStore } from "@/stores/userStore";
import { NewInterestBtn } from "./buttons/new-interest-btn";
import { Skeleton } from "./ui/skeleton";
import UserCoins from "./user-coins";

export default function GameParticipants() {
  const [isVertical, setIsVertical] = useState(false); // State to track layout
  const [showNames, setShowNames] = useState(false); // State to control the unveiling of names
  const userId = useUserStore((state) => state.userId);
  const participants = useGameStore((state) => state.participants);
  const loading = useGameStore((state) => state.loading);
  const storeRemoveUserInterest = useGameStore(
    (state) => state.storeRemoveUserInterest
  );

  // Toggle layout and delay unveiling the names
  const toggleLayout = () => {
    setIsVertical(!isVertical);
  };

  useEffect(() => {
    if (isVertical) {
      // Delay name unveiling until after avatars are almost fully vertical (e.g., 500ms)
      const timeout = setTimeout(() => {
        setShowNames(true);
      }, 500);
      return () => clearTimeout(timeout); // Cleanup timeout
    } else {
      // Reset the names if layout is horizontal
      setShowNames(false);
    }
  }, [isVertical]);

  if (loading) {
    return (
      <div className="flex space-x-[-1rem]">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full " />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  return (
    <div
      className={`relative cursor-pointer ${
        !isVertical && "hover:scale-105"
      } w-full `}
      onClick={toggleLayout}
      style={{
        height: isVertical ? `${participants.length * 4}rem` : "4rem", // Adjust container height
        transition: "height 0.7s ease",
      }}
    >
      {participants.map((participant, index) => (
        <div
          key={participant.id}
          className={`absolute z-10 flex items-center transition-transform duration-1000 ease-in-out w-full ${
            isVertical ? "flex-row space-x-4" : ""
          }`}
          style={{
            transform: isVertical
              ? `translateY(${index * 4}rem)`
              : `translateX(${index * 1.5}rem)`,
          }}
        >
          {/* Avatar Component */}
          <Avatar className="h-12 w-12 shadow-md rounded-full">
            <AvatarImage src="" alt={participant.name} />
            <AvatarFallback className="bg-gray-300 rounded-full">
              <p className="text-sm">{participant.name[0]}</p>
            </AvatarFallback>
          </Avatar>

          {/* Participant Details (Name and Interests as Badges) */}
          {isVertical && showNames && (
            <div className="flex flex-row gap-2 items-center w-full no-scrollbar">
              <div className="overflow-hidden">
                <p
                  className="text-lg font-medium animate-unveil"
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {participant.name}
                </p>
              </div>
              {/* Interests */}
              <div className="flex-grow overflow-x-auto whitespace-nowrap flex space-x-2 mt-2">
                {participant.interests.map((interest) => (
                  <Badge
                    key={interest}
                    className="z-10 rounded-xl bg-transparent text-black border-black hover:bg-transparent cursor-pointer animate-unveil"
                    onClick={(e) => {
                      e.stopPropagation();
                      storeRemoveUserInterest(participant.id, interest);
                    }}
                  >
                    {interest}
                  </Badge>
                ))}
                {userId === participant.id && (
                  <NewInterestBtn
                    userId={userId}
                    className="flex-shrink-0 animate-unveil"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <UserCoins />
    </div>
  );
}
