import Link from "next/link";
import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function StudentEmptyState({
  actionHref,
  actionLabel,
  children,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <EmptyState
      action={
        <Link
          className="inline-flex h-11 items-center justify-center rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      }
      icon={<SearchX className="h-5 w-5" aria-hidden="true" />}
      title={title}
    >
      {children}
    </EmptyState>
  );
}
