"use client";

import { BadgeCheck, Home, Moon, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  BudgetPreferenceAnswer,
  MatchAnswers,
  MatchProfileSummary,
  OptionalInfoAnswer,
} from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

export function MatchProfilePreview({
  answers,
}: {
  answers: MatchAnswers;
}) {
  const profile = buildMatchProfileSummary(answers);

  return (
    <aside className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">
          perfil em construcao
        </p>
        <h2 className="font-display text-xl font-bold text-foreground">
          Seu perfil de convivência
        </h2>
        <p className="text-sm leading-6 text-muted">
          Esta previa será usada futuramente no score de compatibilidade.
        </p>
      </div>

      <div className="grid gap-2">
        <PreviewLine
          icon={<Moon className="h-4 w-4" aria-hidden="true" />}
          label="Rotina"
          value={profile.routineLabel}
        />
        <PreviewLine
          icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />}
          label="Estudo"
          value={profile.studyLabel}
        />
        <PreviewLine
          icon={<WalletCards className="h-4 w-4" aria-hidden="true" />}
          label="Orçamento"
          value={profile.budgetLabel}
        />
        <PreviewLine
          icon={<Home className="h-4 w-4" aria-hidden="true" />}
          label="Casa"
          value={profile.houseStyle.join(", ") || "a definir"}
        />
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-bold text-muted-strong">Tags</p>
        <div className="flex flex-wrap gap-2">
          {profile.profileTags.length ? (
            profile.profileTags.map((tag) => <Badge key={tag}>{tag}</Badge>)
          ) : (
            <Badge tone="neutral">respondendo...</Badge>
          )}
        </div>
      </div>

      {profile.dealBreakers.length ? (
        <div className="grid gap-2 rounded-md bg-danger-soft p-3">
          <p className="text-sm font-bold text-danger">Não negociáveis</p>
          <p className="text-sm leading-6 text-danger">
            {profile.dealBreakers.join(", ")}
          </p>
        </div>
      ) : null}
    </aside>
  );
}

export function buildMatchProfileSummary(
  answers: MatchAnswers,
): MatchProfileSummary {
  const budget = answers.budget as BudgetPreferenceAnswer | undefined;
  const optional = answers["optional-info"] as OptionalInfoAnswer | undefined;
  const sleepRoutine = answers["sleep-routine"] as string | undefined;
  const sleepHours = answers["sleep-hours"] as Record<string, number> | undefined;
  const studyNoise = answers["study-noise"] as Record<string, number> | undefined;
  const houseStyle = (answers["house-style"] as string[] | undefined) ?? [];
  const sensitiveRules = (answers["sensitive-rules"] as string[] | undefined) ?? [];
  const dealBreakers = (answers["deal-breakers"] as string[] | undefined) ?? [];

  const profileTags = [
    labelFor("sleep-routine", sleepRoutine),
    ...(answers.cleanliness ? [labelFor("cleanliness", answers.cleanliness as string)] : []),
    ...sensitiveRules.map((item) => labelFor("sensitive-rules", item)),
    ...(optional?.priorities ?? []).map((item) => labelFor("priorities", item)),
  ].filter(Boolean);

  const routineLabel = sleepHours
    ? `acorda ${formatHour(sleepHours.wakeHour)} / dorme ${formatHour(sleepHours.sleepHour)}`
    : labelFor("sleep-routine", sleepRoutine) || "rotina a definir";

  const studyLabel = studyNoise
    ? studyNoise.studyQuiet >= 70
      ? "precisa de silêncio para estudar"
      : "tolera ruido moderado"
    : "preferência de estudo a definir";

  return {
    budgetLabel: budget
      ? `${formatCurrency(budget.maxMonthly)}/mês, entrada ${formatCurrency(
          budget.moveInBudget,
        )}`
      : "orçamento a definir",
    dealBreakers: dealBreakers.map((item) => labelFor("deal-breakers", item)),
    houseStyle: houseStyle.map((item) => labelFor("house-style", item)),
    profileTags,
    routineLabel,
    studyLabel,
  };
}

function PreviewLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 rounded-md bg-surface-muted p-3">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted">
        <span className="text-brand">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-bold text-muted-strong">{value}</p>
    </div>
  );
}

function formatHour(value?: number) {
  if (value === undefined) return "--:--";
  const normalized = value >= 24 ? value - 24 : value;
  return `${String(normalized).padStart(2, "0")}:00`;
}

function labelFor(group: string, value?: string) {
  if (!value) return "";

  const labels: Record<string, Record<string, string>> = {
    "deal-breakers": {
      "frequent-parties": "sem festas frequentes",
      "high-deposit": "sem caução alta",
      "indoor-smoking": "sem fumante dentro",
      "no-cleaning-plan": "precisa de limpeza combinada",
    },
    cleanliness: {
      balanced: "organização equilibrada",
      relaxed: "limpeza flexível",
      "very-organized": "muito organizada",
    },
    "house-style": {
      "long-term": "longa duração",
      "short-term": "curta duração",
      "social-house": "casa social",
      "study-house": "casa de estudos",
    },
    priorities: {
      "friendly-roommates": "pessoas parecidas",
      "low-cost": "baixo custo",
      "near-campus": "perto do campus",
      "private-room": "quarto individual",
      quiet: "silêncio",
    },
    "sensitive-rules": {
      "no-pets": "sem pets",
      "no-smoking": "não fumante",
      "pets-ok": "pets ok",
      "quiet-night": "noites silenciosas",
    },
    "sleep-routine": {
      early: "pessoa da manha",
      flexible: "rotina flexível",
      night: "pessoa da noite",
    },
  };

  return labels[group]?.[value] ?? value;
}
