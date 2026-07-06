"use client";

import type { MatchRangeField, MatchRangeStep } from "@/lib/types";

export function RangePreferenceStep({
  answer,
  step,
  onChange,
}: {
  answer?: Record<string, number>;
  step: MatchRangeStep;
  onChange: (value: Record<string, number>) => void;
}) {
  const values = getValues(step.fields, answer);

  function update(field: MatchRangeField, value: number) {
    onChange({
      ...values,
      [field.id]: value,
    });
  }

  return (
    <div className="grid gap-4">
      {step.fields.map((field) => (
        <div
          className="grid gap-3 rounded-md border border-border bg-surface-raised p-4"
          key={field.id}
        >
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm font-bold text-muted-strong" htmlFor={field.id}>
              {field.label}
            </label>
            <span className="rounded-md bg-brand-soft px-2 py-1 text-sm font-bold text-brand-strong">
              {formatRangeValue(values[field.id] ?? field.defaultValue, field.unit)}
            </span>
          </div>
          <input
            className="w-full accent-brand"
            id={field.id}
            max={field.max}
            min={field.min}
            step={field.step}
            type="range"
            value={values[field.id] ?? field.defaultValue}
            onChange={(event) => update(field, Number(event.target.value))}
          />
          <div className="flex items-center justify-between text-xs font-bold text-muted">
            <span>{field.lowLabel}</span>
            <span>{field.highLabel}</span>
          </div>
        </div>
      ))}
      {step.optional ? (
        <p className="text-sm text-muted">Opcional: você pode manter o valor sugerido.</p>
      ) : null}
    </div>
  );
}

function getValues(
  fields: MatchRangeField[],
  answer?: Record<string, number>,
) {
  return fields.reduce<Record<string, number>>((acc, field) => {
    acc[field.id] = answer?.[field.id] ?? field.defaultValue;
    return acc;
  }, {});
}

function formatRangeValue(value: number, unit?: string) {
  if (unit === "h") {
    const normalized = value >= 24 ? value - 24 : value;
    return `${String(normalized).padStart(2, "0")}:00`;
  }

  if (unit) return `${value}${unit}`;

  return String(value);
}
