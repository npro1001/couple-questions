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
import { redirect } from "next/navigation";
import { MouseEvent, useState } from "react";
import { useGameStore } from "@/stores/gameStore";
import { Badge } from "../ui/badge";
import { interestSchema } from "@/lib/validations";
import toast from "react-hot-toast";

type NewInterestBtnProps = {
  userId: string;
  className?: string;
};

export function NewInterestBtn({ userId }: NewInterestBtnProps) {
  const [interest, setInterest] = useState("");
  const storeAddUserInterest = useGameStore(
    (state) => state.storeAddUserInterest
  );

  const handleAddInterest = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (interest.trim() === "") {
      return; // Do nothing if the input is empty
    }
    const validatedInterest = interestSchema.safeParse(interest);
    if (!validatedInterest.success) {
      toast.error("Interest can't contain special characters");
      return;
    }
    const interestV = validatedInterest.data;
    if (userId) {
      await storeAddUserInterest(userId, interestV);
      setInterest(""); // Clear the input after adding the interest
    } else {
      console.error("User is not authenticated");
      redirect("/login");
    }
  };

  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()}>
        <Badge className="rounded-xl bg-transparent text-black border-black hover:bg-black/20">
          +
        </Badge>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Add an interest 🧐</DialogTitle>
          <DialogDescription>Its fun</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="interest"
              className="col-span-4"
              placeholder="starwars before disney"
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
