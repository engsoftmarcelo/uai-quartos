"use client";

import type { ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface TooltipProps {
  children: ReactNode;
  className?: string;
  content: ReactNode;
}

export function Tooltip({ children, className, content }: TooltipProps) {
  const id = useId();

  return (
    <span className="group relative inline-flex" aria-describedby={id}>
      {children}
      <span
        className={cn(
          "pointer-events-none absolute bottom-full left-1/2 z-[var(--z-overlay)] mb-2 hidden max-w-56 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-medium text-white shadow-sm group-hover:block group-focus-within:block",
          className,
        )}
        id={id}
        role="tooltip"
      >
        {content}
      </span>
    </span>
  );
}
