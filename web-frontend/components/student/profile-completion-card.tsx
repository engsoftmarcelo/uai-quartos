import Link from "next/link";
import { HeartHandshake, UserRound } from "lucide-react";
import type {
  StudentHousingPreferences,
  StudentProfileSummary,
} from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

export function ProfileCompletionCard({
  preferences,
  profile,
}: {
  preferences: StudentHousingPreferences;
  profile: StudentProfileSummary;
}) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-soft text-brand">
          <UserRound className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Perfil do estudante
          </h2>
          <p className="mt-1 text-sm text-muted">
            Dados usados para candidaturas e recomendacoes.
          </p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Info label="Nome" value={profile.name} />
        <Info label="E-mail" value={profile.email} />
        <Info label="Universidade" value={profile.university} />
        <Info label="Curso" value={profile.course} />
        <Info label="Campus" value={profile.campus} />
        <Info
          label="Budget"
          value={`${formatCurrency(preferences.budgetMax.amount)}/mes`}
        />
      </div>
      <div className="grid gap-2 rounded-md bg-surface-muted p-3">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
          <HeartHandshake className="h-4 w-4 text-brand" aria-hidden="true" />
          Match profile: {profile.matchCompletion}%
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${profile.matchCompletion}%` }}
          />
        </div>
      </div>
      <Link
        className="inline-flex h-11 items-center justify-center rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
        href="/match"
      >
        Atualizar preferencias
      </Link>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md bg-surface-muted p-3">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="text-sm font-bold text-muted-strong">{value}</p>
    </div>
  );
}
