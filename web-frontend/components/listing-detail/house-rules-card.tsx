import { DoorOpen, Moon, PawPrint, ShieldCheck } from "lucide-react";
import type { ListingDetail } from "@/lib/types";

const labels = {
  guests: {
    allowed: "hospedes permitidos",
    limited: "hospedes combinados",
    not_allowed: "sem hospedes",
  },
  noise: {
    balanced: "ruido moderado",
    lively: "casa movimentada",
    quiet: "silencioso",
  },
  pets: {
    allowed: "pets permitidos",
    not_allowed: "sem pets",
  },
  smoker: {
    allowed: "fumante ok",
    not_allowed: "nao fumante",
    outside_only: "fumante so fora",
  },
} as const;

export function HouseRulesCard({ rules }: { rules: ListingDetail["houseRules"] }) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          regras da casa
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          O que precisa combinar
        </h2>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Rule icon={<DoorOpen className="h-4 w-4" />} label="Hospedes" value={labels.guests[rules.guests]} />
        <Rule icon={<PawPrint className="h-4 w-4" />} label="Pets" value={labels.pets[rules.pets]} />
        <Rule icon={<Moon className="h-4 w-4" />} label="Ruido" value={labels.noise[rules.noise]} />
        <Rule icon={<ShieldCheck className="h-4 w-4" />} label="Fumante" value={labels.smoker[rules.smoker]} />
      </div>

      <ul className="grid gap-2 rounded-md bg-surface-muted p-3 text-sm leading-6 text-muted">
        {rules.policySummary.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </section>
  );
}

function Rule({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 rounded-md border border-border p-3">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-muted">
        <span className="text-brand">{icon}</span>
        {label}
      </p>
      <p className="text-sm font-bold text-muted-strong">{value}</p>
    </div>
  );
}
