"use client";
import React from "react";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

type AuthFormBtnProps = {
  type: "logIn" | "signUp";
};

export default function AuthFormBtn({ type }: AuthFormBtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} className="w-full">
      {type === "logIn" ? "Log In" : "Sign Up"}
    </Button>
  );
}
