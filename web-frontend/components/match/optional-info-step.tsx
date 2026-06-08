"use client";

import type { MatchOptionalInfoStep, OptionalInfoAnswer } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OptionalInfoStep({
  answer,
  step,
  onChange,
}: {
  answer?: OptionalInfoAnswer;
  step: MatchOptionalInfoStep;
  onChange: (value: OptionalInfoAnswer) => void;
}) {
  const value = answer ?? { note: "", priorities: [] };

  function togglePriority(id: string) {
    const priorities = value.priorities.includes(id)
      ? value.priorities.filter((item) => item !== id)
      : [...value.priorities, id];

    onChange({ ...value, priorities });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <p className="text-sm font-bold text-muted-strong">
          Prioridades pessoais
        </p>
        <div className="flex flex-wrap gap-2">
          {step.priorityOptions.map((option) => {
            const active = value.priorities.includes(option.id);

            return (
              <button
                className={cn(
                  "min-h-10 rounded-md border px-3 text-sm font-bold transition",
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-surface text-muted-strong hover:bg-surface-muted",
                )}
                key={option.id}
                type="button"
                onClick={() => togglePriority(option.id)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <label className="grid gap-2">
        <span className="text-sm font-bold text-muted-strong">
          Contexto livre <span className="font-medium text-muted">(opcional)</span>
        </span>
        <textarea
          className="min-h-32 rounded-md border border-border bg-surface px-3 py-2 text-sm leading-6 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          placeholder={step.placeholder}
          value={value.note}
          onChange={(event) => onChange({ ...value, note: event.target.value })}
        />
      </label>
    </div>
  );
}
