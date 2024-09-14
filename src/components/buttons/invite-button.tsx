"use client";

import React, { act, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Copy } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";

type InviteButtonProps = {
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
};

export default function InviteButton({
  disabled,
  children,
  onClick,
}: InviteButtonProps) {
  const gameId = useGameStore((state) => state.gameId);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full hover:bg-black/5" variant={"outline"}>
          Invite a friend
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy and share game link</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Anyone who has this link will be able to join your current game.
        </DialogDescription>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              // defaultValue={`${process.env.NEXT_PUBLIC_BASE_URL}/app/game-lobby`}
              defaultValue={`${process.env.NEXT_PUBLIC_BASE_URL}/app/game-lobby?invite=${gameId}`}
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() =>
              navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_BASE_URL}/app/game-lobby?invite=${gameId}`
                // `${process.env.NEXT_PUBLIC_BASE_URL}/app/game-lobby`
              )
            }
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
