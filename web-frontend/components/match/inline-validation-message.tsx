"use client";

import { AlertCircle } from "lucide-react";

export function InlineValidationMessage({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <p
      className="inline-flex items-start gap-2 rounded-md border border-danger/25 bg-danger-soft px-3 py-2 text-sm font-medium leading-6 text-danger"
      role="alert"
    >
      <AlertCircle className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
