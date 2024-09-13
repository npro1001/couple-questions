import { useSession } from "next-auth/react";
import { addInterest } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { Badge } from "../ui/badge";

type NewInterestBtnProps = {
  userId: string;
};

export function NewInterestBtn({ userId }: NewInterestBtnProps) {
  const [interest, setInterest] = useState("");
  const { updateInterests } = useGameStore();

  const handleAddInterest = async () => {
    if (interest.trim() === "") {
      return; // Do nothing if the input is empty
    }
    if (userId) {
      await updateInterests(userId, interest);
      setInterest(""); // Clear the input after adding the interest
    } else {
      console.error("User is not authenticated");
      redirect("/login");
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Badge className="rounded-xl bg-transparent text-black border-black hover:bg-black/20">
          +
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Its fun</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="interest"
              className="col-span-3"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleAddInterest}>
            Add interest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
