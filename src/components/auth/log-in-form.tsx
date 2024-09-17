"use client";

import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { actionLogIn } from "@/actions/user-actions";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import LogInBtn from "./log-in-btn";

export default function LogInForm() {
  const searchParams = useSearchParams();
  const invite = searchParams.get("invite"); // Get the invite parameter from the URL -- added to formdata

  const [logInError, dispatchActionLogIn] = useFormState(
    actionLogIn,
    undefined
  ); // undefined is the initial state

  return (
    <form action={dispatchActionLogIn}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          className="border-zinc-400"
          type="email"
          id="email"
          name="email"
          required
          maxLength={100}
        />
      </div>
      <div className="space-y-1 mb-4 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input
          className="border-zinc-400"
          type="password"
          id="password"
          name="password"
          required
          maxLength={100}
        />
      </div>
      <input type="hidden" name="invite" value={invite || ""} />
      {logInError && (
        <p className="text-red-500 text-sm mt-2 mb-4">{logInError.message}</p>
      )}
      <LogInBtn />
    </form>
  );
}
