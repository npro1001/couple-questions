"use client";

import { actionLogOut } from "@/actions/user-actions";
import { Button } from "../ui/button";

export default function SignOutBtn() {
  return <Button onClick={async () => await actionLogOut()}>Sign out</Button>;
}
