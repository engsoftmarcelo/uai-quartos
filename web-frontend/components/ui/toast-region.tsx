"use client";

import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastTone = "neutral" | "success" | "danger";

export interface ToastMessage {
  description?: string;
  id: string;
  title: string;
  tone?: ToastTone;
}

const toneClasses: Record<ToastTone, string> = {
  neutral: "border-border bg-surface text-muted-strong",
  success: "border-success/30 bg-success-soft text-success",
  danger: "border-danger/30 bg-danger-soft text-danger",
};

export function ToastRegion({ messages = [] }: { messages?: ToastMessage[] }) {
  return (
    <section
      aria-label="Notificacoes"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[var(--z-toast)] grid w-[min(22rem,calc(100vw-2rem))] gap-2"
    >
      {messages.map((message) => {
        const Icon =
          message.tone === "success"
            ? CheckCircle2
            : message.tone === "danger"
              ? TriangleAlert
              : Info;

        return (
          <article
            className={cn(
              "grid grid-cols-[1.25rem_minmax(0,1fr)] gap-3 rounded-md border p-3 text-sm shadow-sm",
              toneClasses[message.tone ?? "neutral"],
            )}
            key={message.id}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            <div className="grid gap-1">
              <p className="font-bold">{message.title}</p>
              {message.description ? <p>{message.description}</p> : null}
            </div>
          </article>
        );
      })}
    </section>
  );
}
