import Link from "next/link";
import { GraduationCap, HeartHandshake, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type {
  StudentHousingPreferences,
  StudentProfileSummary,
} from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

export function StudentSummaryCard({
  preferences,
  profile,
}: {
  preferences: StudentHousingPreferences;
  profile: StudentProfileSummary;
}) {
  return (
    <article className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <Avatar alt={profile.name} fallback={profile.name} size="lg" src={profile.avatarUrl} />
        <div className="grid gap-1">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {profile.name}
          </h2>
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <GraduationCap className="h-4 w-4 text-brand" aria-hidden="true" />
            {profile.course} - {profile.university}
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Fact label="Campus" value={profile.campus} />
        <Fact
          label="Budget"
          value={`${formatCurrency(preferences.budgetMax.amount)}/mes`}
        />
        <Fact label="Deslocamento" value={`até ${preferences.commuteMaxMinutes} min`} />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
            <HeartHandshake className="h-4 w-4 text-brand" aria-hidden="true" />
            Match profile
          </p>
          <p className="text-sm font-bold text-brand">{profile.matchCompletion}%</p>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${profile.matchCompletion}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {preferences.priorities.map((priority) => (
          <Badge key={priority}>{priority}</Badge>
        ))}
        <Badge
          icon={<ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />}
          tone={profile.verificationStatus === "verified" ? "success" : "accent"}
        >
          {profile.verificationStatus === "verified"
            ? "verificada"
            : "verificação pendente"}
        </Badge>
      </div>

      <Link
        className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
        href="/perfil"
      >
        Ver perfil completo
      </Link>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md bg-surface-muted p-3">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="text-sm font-bold text-muted-strong">{value}</p>
    </div>
  );
}
