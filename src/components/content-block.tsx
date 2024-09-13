import { cn } from "@/lib/utils";
import React from "react";

type ContentBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ContentBlock({
  children,
  className,
}: ContentBlockProps) {
  return (
    <div
      className={cn(
        "border shadow-md border-black rounded-md min-h-[300px] bg-slate-200 w-full py-8",
        className
      )}
    >
      {children}
    </div>
  );
}
