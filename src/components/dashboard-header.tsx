import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Logo from "./logo";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Session } from "@/lib/types";
import Link from "next/link";

export default async function Header() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const userInitial =
    session.user.name && session.user.name.length > 0
      ? session.user.name[0]
      : "S";

  return (
    <header className="flex w-full justify-between items-center py-3 border-b border-black">
      {/* <div className="flex-1 flex-row items-center justify-center">
        <div className="border-r w-full border-black/10">
          <span className="text-2xl">10</span>
          <span className="text-2xl text-red-700"> Q</span>
        </div>
        <div>
          <span className="text-2xl">5</span>
          <span className="text-2xl text-red-700"> S</span>
        </div>
      </div> */}
      <div className="flex-1">
        <Button
          variant={"ghost"}
          className=" hover:scale-95 transition bg-gray-300 hover:bg-gray-400/20"
        >
          Feature Request
        </Button>
      </div>
      <Logo />
      <div className="flex flex-1 justify-end">
        <Link href="/app/account">
          <Avatar className="shadow-lg border border-black hover:scale-95 transition ">
            <AvatarImage src="" alt="@shadcn" />
            <AvatarFallback className=" bg-gray-300 hover:bg-gray-400/20">
              <span>{userInitial}</span>
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
