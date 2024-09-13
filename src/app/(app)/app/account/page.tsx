import { logOut } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutBtn from "@/components/auth/sign-out-btn";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  return (
    <main className="flex flex-col">
      <div className="flex justify-between items-center py-8">
        <h1 className="text-2xl">
          <span className="font-semibold">Hey </span>
          {session?.user.name}!
        </h1>
      </div>
      <div className="h-[200px]" />
      <div className="flex flex-col items-center min-h-full  gap-6">
        <Link href="/app/dashboard">
          <Button>Home</Button>
        </Link>
        <SignOutBtn />
      </div>
    </main>
  );
}
