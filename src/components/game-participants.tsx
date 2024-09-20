"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import Dialog components from ShadCN
import { useGameStore } from "@/stores/gameStore";
import { Badge } from "./ui/badge";
import { useUserStore } from "@/stores/userStore";
import { NewInterestBtn } from "./buttons/new-interest-btn";

export default function GameParticipants() {
  const userId = useUserStore((state) => state.userId);
  const participants = useGameStore((state) => state.participants);

  return (
    <div className="w-full flex justify-center">
      <Dialog>
        {/* A single trigger for all avatars */}
        <DialogTrigger asChild>
          <div className="w-full flex justify-end gap-8 cursor-pointer">
            {participants.map((participant) => (
              <Avatar
                key={participant.id}
                className="h-9 w-9 shadow-md rounded-full"
              >
                <AvatarImage src="" alt={participant.name} />
                <AvatarFallback className="bg-gray-300 rounded-full">
                  <p className="text-xs">{participant.name[0]}</p>
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </DialogTrigger>

        {/* Dialog that opens with all participant details */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Participants</DialogTitle>
          </DialogHeader>

          {/* Render each participant's details inside the dialog */}
          <div className="space-y-4">
            {participants.map((participant) => (
              <div key={participant.id} className="border-b pb-4">
                <p className="text-lg font-medium">{participant.name}</p>

                {/* Participant's Interests */}
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {participant.interests.map((interest) => (
                    <Badge
                      key={interest}
                      className="flex justify-center items-center bg-transparent rounded-xl text-black border-black text-xs"
                      style={{ minWidth: "3rem" }}
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
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
