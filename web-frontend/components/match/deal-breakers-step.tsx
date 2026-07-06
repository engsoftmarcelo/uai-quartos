"use client";

import { OctagonMinus } from "lucide-react";
import type { MatchDealBreakersStep } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DealBreakersStep({
  answer,
  step,
  onChange,
}: {
  answer?: string[];
  step: MatchDealBreakersStep;
  onChange: (value: string[]) => void;
}) {
  const selected = answer ?? [];

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
  }

  return (
    <div className="grid gap-3">
      {step.options.map((option) => {
        const active = selected.includes(option.id);

        return (
          <button
            className={cn(
              "grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 rounded-md border p-4 text-left transition",
              active
                ? "border-danger bg-danger-soft text-danger"
                : "border-border bg-surface hover:bg-surface-muted",
            )}
            key={option.id}
            type="button"
            onClick={() => toggle(option.id)}
          >
            <OctagonMinus className="mt-1 h-5 w-5" aria-hidden="true" />
            <span className="grid gap-1">
              <span className="font-bold">{option.label}</span>
              {option.description ? (
                <span className="text-sm leading-6 text-muted">
                  {option.description}
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
      <p className="text-sm text-muted">
        Opcional. Se nada for inegociável agora, avance sem selecionar.
      </p>
    </div>
  );
}
