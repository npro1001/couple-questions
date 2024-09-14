"use client";

import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import AuthFormBtn from "@/components/auth/auth-form-btn";
import { useFormState } from "react-dom";
import { logIn, signUp } from "@/actions/actions";
import { Button } from "../ui/button";
import { useSearchParams } from "next/navigation";

export default function LogInForm() {
  const searchParams = useSearchParams();
  const invite = searchParams.get("invite"); // Get the invite parameter from the URL
  let callbackUrl;
  if (invite) {
    callbackUrl = `/app/game-lobby?invite=${invite}`;
  } else {
    callbackUrl = "/app/dashboard";
  }

  // const [signUpError, dispatchSignUp] = useFormState(signUp, undefined); // undefined is the initial state
  // const [logInError, dispatchLogIn] = useFormState(logIn, undefined); // undefined is the initial state
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (invite) {
      console.log(invite);
      formData.append("gameId", invite); // Pass invite as part of the form data
      console.log(formData.get("gameId"));
    }

    await logIn(formData, callbackUrl);
  };
  return (
    // Would redirect to callbaclUrl here in this action={}
    // <form action={type === "logIn" ? dispatchLogIn : dispatchSignUp}>
    <form onSubmit={handleSubmit}>
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
          id="email"
          name="password"
          required
          maxLength={100}
        />
      </div>
      <Button className="w-full">Log In</Button>
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
