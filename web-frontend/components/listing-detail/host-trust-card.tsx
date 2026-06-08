import { BadgeCheck, Clock3, ShieldCheck, UserRoundCheck } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { ListingDetail } from "@/lib/types";

export function HostTrustCard({ listing }: { listing: ListingDetail }) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <Avatar
          alt={listing.host.name}
          fallback={listing.host.name}
          size="lg"
          src={listing.host.avatarUrl}
        />
        <div className="grid gap-1">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">
            locador
          </p>
          <h2 className="font-display text-2xl font-bold text-foreground">
            {listing.host.name}
          </h2>
          <p className="text-sm text-muted">{listing.host.sinceLabel}</p>
        </div>
      </div>

      <p className="text-sm leading-6 text-muted">{listing.host.bio}</p>

      <div className="grid gap-2">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
          <Clock3 className="h-4 w-4 text-brand" aria-hidden="true" />
          {listing.host.responseTimeLabel}
        </p>
        {listing.host.verification.map((item) => (
          <p
            className="inline-flex items-center gap-2 text-sm text-muted-strong"
            key={item}
          >
            <UserRoundCheck className="h-4 w-4 text-success" aria-hidden="true" />
            {item}
          </p>
        ))}
      </div>

      <div className="grid gap-3 rounded-md bg-success-soft p-3">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-success">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Verificacao do anuncio
        </p>
        <ul className="grid gap-2 text-sm text-success">
          {[...listing.verification.landlord, ...listing.verification.listing].map(
            (item) => (
              <li className="inline-flex items-center gap-2" key={item}>
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                {item}
              </li>
            ),
          )}
        </ul>
      </div>
    </section>
  );
}
