"use client";

import { Checkbox } from "@/components/ui/checkbox";

const suggestedRules = [
  "visitas combinadas",
  "sem fumantes",
  "silencio depois das 22h",
  "pets sob consulta",
  "limpeza compartilhada",
  "festas com acordo previo",
];

export function HouseRulesFormSection({
  rules,
  onChange,
}: {
  rules: string[];
  onChange: (rules: string[]) => void;
}) {
  function toggleRule(rule: string, checked: boolean) {
    onChange(checked ? [...rules, rule] : rules.filter((item) => item !== rule));
  }

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Regras da casa
        </h2>
        <p className="mt-1 text-sm text-muted">
          Regras claras reduzem desalinhamento e visitas improdutivas.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {suggestedRules.map((rule) => (
          <Checkbox
            checked={rules.includes(rule)}
            key={rule}
            label={rule}
            onChange={(event) => toggleRule(rule, event.target.checked)}
          />
        ))}
      </div>
    </section>
  );
}
