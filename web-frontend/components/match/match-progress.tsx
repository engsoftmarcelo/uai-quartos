"use client";

import { Check } from "lucide-react";
import type { MatchWizardStep } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MatchProgress({
  currentIndex,
  steps,
}: {
  currentIndex: number;
  steps: MatchWizardStep[];
}) {
  const percent = Math.round(((currentIndex + 1) / steps.length) * 100);

  return (
    <section
      className="grid gap-3 rounded-md border border-border bg-surface p-3 shadow-xs"
      aria-label="Progresso do perfil"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-muted-strong">
          Etapa {currentIndex + 1} de {steps.length}
        </p>
        <p className="text-sm font-bold text-brand">{percent}%</p>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol className="hidden gap-1 sm:grid sm:grid-cols-6 lg:grid-cols-12">
        {steps.map((step, index) => (
          <li key={step.id}>
            <span
              className={cn(
                "grid h-8 place-items-center rounded-md text-xs font-bold",
                index < currentIndex && "bg-success-soft text-success",
                index === currentIndex && "bg-brand text-white",
                index > currentIndex && "bg-surface-muted text-muted",
              )}
              title={step.title}
            >
              {index < currentIndex ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
