import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { NewInterestBtn } from "./buttons/new-interest-btn";
import { useGameStore } from "@/stores/gameStore";
import { CrownIcon } from "lucide-react";

type UserInfoProps = {
  userId?: string;
  name: string;
  interests: string[];
  initials: string;
};

export default function UserInfo({
  userId,
  name,
  interests,
  initials,
}: UserInfoProps) {
  const storeRemoveUserInterest = useGameStore(
    (state) => state.storeRemoveUserInterest
  );

  return (
    <div className="flex gap-4 items-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src="" alt="@shadcn" />
        <AvatarFallback className="border border-black bg-transparent">
          <p className="text-4xl">{initials}</p>
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <p className="text-2xl">{name}</p>
        <div className="max-w-full overflow-x-hidden">
          <div className="flex space-x-2">
            {interests.map((interest) => (
              <Badge
                key={interest}
                className="rounded-xl bg-transparent text-black border-black hover:bg-transparent cursor-pointer"
                onClick={() => {
                  if (userId) {
                    console.log(userId);
                    console.log("removing");
                    storeRemoveUserInterest(userId, interest);
                  }
                }}
              >
                {interest}
              </Badge>
            ))}
            {userId && (
              <NewInterestBtn userId={userId} className="flex-shrink-0" />
            )}
          </div>
        </div>
        {/* <div className="space-x-2">
          {interests.map((interest) => (
            <Badge
              key={interest}
              className="rounded-xl bg-transparent text-black border-black hover:bg-transparent"
            >
              {interest}
            </Badge>
          ))}
          {userId && <NewInterestBtn userId={userId} />}
        </div> */}
      </div>
    </div>
  );
}
