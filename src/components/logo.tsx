import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <Link href="/">
      {" "}
      <p className={cn("font-playwrite text-3xl", className)}>
        --<span className="font-bold">CQ</span>--
      </p>
    </Link>
  );
}
