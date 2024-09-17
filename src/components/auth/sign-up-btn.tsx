"use client";

import { actionLogIn } from "@/actions/user-actions";
import { Button } from "../ui/button";
import { useFormStatus } from "react-dom";

export default function SignUpBtn() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      Sign up
    </Button>
  );
}
