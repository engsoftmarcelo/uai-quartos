"use client";

import type { BudgetPreferenceAnswer, MatchBudgetStep } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

export function BudgetStep({
  answer,
  step,
  onChange,
}: {
  answer?: BudgetPreferenceAnswer;
  step: MatchBudgetStep;
  onChange: (value: BudgetPreferenceAnswer) => void;
}) {
  const value = answer ?? {
    maxMonthly: step.suggestedMax,
    moveInBudget: Math.round(step.suggestedMax / 2),
  };

  function update(patch: Partial<BudgetPreferenceAnswer>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className="grid gap-4">
      <BudgetInput
        label="Estimativa mensal total"
        max={step.max}
        min={step.min}
        value={value.maxMonthly}
        onChange={(next) => update({ maxMonthly: next })}
      />
      <BudgetInput
        label="Valor que voce consegue pagar hoje"
        max={step.max}
        min={0}
        value={value.moveInBudget}
        onChange={(next) => update({ moveInBudget: next })}
      />
      <div className="rounded-md bg-surface-muted p-3 text-sm leading-6 text-muted">
        Confirmacao: buscar moradias ate{" "}
        <span className="font-bold text-foreground">
          {formatCurrency(value.maxMonthly)}
        </span>{" "}
        por mes, com entrada perto de{" "}
        <span className="font-bold text-foreground">
          {formatCurrency(value.moveInBudget)}
        </span>
        .
      </div>
    </div>
  );
}

function BudgetInput({
  label,
  max,
  min,
  value,
  onChange,
}: {
  label: string;
  max: number;
  min: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-2 rounded-md border border-border bg-surface-raised p-4">
      <span className="text-sm font-bold text-muted-strong">{label}</span>
      <input
        className="h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        inputMode="numeric"
        max={max}
        min={min}
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        className="w-full accent-brand"
        max={max}
        min={min}
        step={50}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <span className="text-sm font-bold text-brand">
        {formatCurrency(value)}
      </span>
    </label>
  );
}
