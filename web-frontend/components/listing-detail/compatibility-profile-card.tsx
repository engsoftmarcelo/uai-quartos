import { HeartHandshake, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ListingDetail } from "@/lib/types";

const genderLabel: Record<ListingDetail["roommateProfile"]["genderPolicy"], string> = {
  all_genders: "todos os generos",
  men_only: "casa masculina",
  mixed: "casa mista",
  women_only: "casa feminina",
};

export function CompatibilityProfileCard({
  listing,
}: {
  listing: ListingDetail;
}) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
          <HeartHandshake className="h-4 w-4" aria-hidden="true" />
          perfil de convivência
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Com quem vou morar
        </h2>
      </div>

      <div className="grid gap-3 rounded-md bg-brand-soft p-4">
        <p className="font-display text-4xl font-bold text-brand-strong">
          {listing.roommateProfile.compatibilityScore}%
        </p>
        <p className="text-sm leading-6 text-brand-strong">
          Compatibilidade estimada pelo perfil declarado do anúncio. A decisao
          final continua no contato e nos fluxos existentes.
        </p>
      </div>

      <div className="grid gap-2">
        <Info label="Política da casa" value={genderLabel[listing.roommateProfile.genderPolicy]} />
        <Info label="Faixa etaria" value={listing.roommateProfile.ageRange} />
        <Info label="Rotina" value={listing.roommateProfile.routine} />
      </div>

      <div className="flex flex-wrap gap-2">
        {listing.roommateProfile.tags.map((tag) => (
          <Badge
            icon={<Users className="h-3.5 w-3.5" aria-hidden="true" />}
            key={tag}
            tone="signal"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div className="grid gap-2 rounded-md bg-surface-muted p-3">
        <h3 className="text-sm font-bold text-muted-strong">
          Ideal para você se...
        </h3>
        <ul className="grid gap-2 text-sm leading-6 text-muted">
          {listing.idealFor.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md border border-border p-3">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="text-sm font-bold text-muted-strong">{value}</p>
    </div>
  );
}
