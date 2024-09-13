import { cn } from "@/lib/utils";
import React from "react";

type H1Props = {
  className?: string;
  children: React.ReactNode;
};

export default function H1({ className, children }: H1Props) {
  return (
    <h1 className={cn("font-playwrite text-2xl leading-6", className)}>
      {children}
    </h1>
  );
}
