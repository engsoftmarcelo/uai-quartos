import { BadgeCheck, Clock3, ListChecks } from "lucide-react";

export function ResultsStats({
  averageCommute,
  totalCount,
  verifiedCount,
}: {
  averageCommute: number;
  totalCount: number;
  verifiedCount: number;
}) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      <Stat
        icon={<ListChecks className="h-4 w-4" aria-hidden="true" />}
        label="resultados"
        value={String(totalCount)}
      />
      <Stat
        icon={<Clock3 className="h-4 w-4" aria-hidden="true" />}
        label="tempo médio ao campus"
        value={`${averageCommute} min`}
      />
      <Stat
        icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />}
        label="verificados"
        value={String(verifiedCount)}
      />
    </dl>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 rounded-md border border-border bg-surface p-3 shadow-xs">
      <dt className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
        <span className="text-brand">{icon}</span>
        {label}
      </dt>
      <dd className="font-display text-2xl font-bold text-foreground">{value}</dd>
    </div>
  );
}
