"use client";

import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { actionCreateUser } from "@/actions/user-actions";
import { Button } from "../ui/button";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const invite = searchParams.get("invite"); // Get the invite parameter from the URL -- added to formdata

  const [signUpError, dispatchActionSignIn] = useFormState(
    actionCreateUser,
    undefined
  ); // undefined is the initial state

  return (
    <form action={dispatchActionSignIn}>
      <div className="space-y-1 mb-4 ">
        <Label htmlFor="name">Username</Label>
        <Input
          className="border-zinc-400"
          type="text"
          id="name"
          name="name"
          required
          maxLength={100}
        />
      </div>
      <div className="space-y-1 mb-4 mt-2">
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
      {signUpError && (
        <p className="text-red-500 text-sm mt-2 mb-4">{signUpError.message}</p>
      )}
      <Button className="w-full">Sign Up</Button>
      {/* <AuthFormBtn type={type} /> */}
      {/* {signUpError && (
        <p className="text-red-500 text-sm mt-2">{signUpError.message}</p>
      )}
      {logInError && (
        <p className="text-red-500 text-sm mt-2">{logInError.message}</p>
      )} */}
    </form>
  );
}
