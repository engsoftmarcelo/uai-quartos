"use client";

import { CheckCircle2 } from "lucide-react";
import type { MatchMultiChoiceStep } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MultiChoiceStep({
  answer,
  step,
  onChange,
}: {
  answer?: string | string[];
  step: MatchMultiChoiceStep;
  onChange: (value: string | string[]) => void;
}) {
  const selected = Array.isArray(answer) ? answer : answer ? [answer] : [];

  function toggle(optionId: string) {
    if (step.mode === "single") {
      onChange(optionId);
      return;
    }

    const exists = selected.includes(optionId);
    const next = exists
      ? selected.filter((item) => item !== optionId)
      : [...selected, optionId];

    if (step.maxSelections && next.length > step.maxSelections) return;
    onChange(next);
  }

  return (
    <div className="grid gap-3">
      {step.options.map((option) => {
        const active = selected.includes(option.id);

        return (
          <button
            className={cn(
              "grid min-h-20 grid-cols-[minmax(0,1fr)_1.5rem] items-start gap-3 rounded-md border p-4 text-left transition",
              active
                ? "border-brand bg-brand-soft text-brand-strong"
                : "border-border bg-surface hover:bg-surface-muted",
            )}
            key={option.id}
            type="button"
            onClick={() => toggle(option.id)}
          >
            <span className="grid gap-1">
              <span className="font-bold text-foreground">{option.label}</span>
              {option.description ? (
                <span className="text-sm leading-6 text-muted">
                  {option.description}
                </span>
              ) : null}
            </span>
            <CheckCircle2
              className={cn(
                "h-5 w-5 text-border-strong",
                active && "text-brand",
              )}
              aria-hidden="true"
            />
          </button>
        );
      })}
      {step.mode === "multiple" ? (
        <p className="text-sm text-muted">
          Selecione uma ou mais opcoes.{" "}
          {step.optional ? "Esta etapa e opcional." : null}
        </p>
      ) : null}
    </div>
  );
}
