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
              defaultValue="https://couplequestions.ai/join/123456"
              readOnly
            />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() =>
              navigator.clipboard.writeText(
                `${window.location.origin}/join/123456`
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
