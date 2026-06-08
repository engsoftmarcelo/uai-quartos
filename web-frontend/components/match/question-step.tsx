"use client";

import type { ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InlineValidationMessage } from "./inline-validation-message";

export function QuestionStep({
  category,
  children,
  error,
  optional,
  title,
  why,
}: {
  category: string;
  children: ReactNode;
  error?: string | null;
  optional?: boolean;
  title: string;
  why: string;
}) {
  return (
    <section className="grid gap-5 rounded-md border border-border bg-surface p-4 shadow-xs sm:p-5">
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{category}</Badge>
          {optional ? <Badge tone="neutral">opcional</Badge> : null}
        </div>
        <div className="grid gap-2">
          <h1 className="font-display text-2xl font-bold text-balance text-foreground sm:text-3xl">
            {title}
          </h1>
          <p className="grid grid-cols-[1rem_minmax(0,1fr)] gap-2 rounded-md bg-signal-soft px-3 py-2 text-sm leading-6 text-signal">
            <HelpCircle className="mt-1 h-4 w-4" aria-hidden="true" />
            <span>{why}</span>
          </p>
        </div>
      </div>

      {children}
      <InlineValidationMessage message={error} />
    </section>
  );
}
