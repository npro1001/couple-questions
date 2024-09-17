"use client";

import { actionLogIn } from "@/actions/user-actions";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

export default function LogInBtn() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      Log in
    </Button>
  );
}
