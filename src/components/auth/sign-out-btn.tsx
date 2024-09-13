"use client";

import { logOut } from "@/actions/actions";
import React from "react";
import { Button } from "../ui/button";

export default function SignOutBtn() {
  return <Button onClick={async () => await logOut()}>Sign out</Button>;
}
