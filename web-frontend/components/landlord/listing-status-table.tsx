"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Archive,
  Copy,
  Edit3,
  Eye,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import type { LandlordListing, LandlordListingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const statusLabels: Record<LandlordListingStatus, string> = {
  active: "ativo",
  archived: "arquivado",
  draft: "rascunho",
  paused: "pausado",
};

const statusTone: Record<LandlordListingStatus, "success" | "accent" | "neutral"> = {
  active: "success",
  archived: "neutral",
  draft: "accent",
  paused: "accent",
};

const filterOptions = [
  { label: "Todos", value: "all" },
  { label: "Ativos", value: "active" },
  { label: "Pausados", value: "paused" },
  { label: "Rascunhos", value: "draft" },
  { label: "Arquivados", value: "archived" },
];

export function ListingStatusTable({
  compact = false,
  listings,
}: {
  compact?: boolean;
  listings: LandlordListing[];
}) {
  const [filter, setFilter] = useState<LandlordListingStatus | "all">("all");
  const [localStatuses, setLocalStatuses] = useState<
    Record<string, LandlordListingStatus>
  >({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const visibleListings = useMemo(() => {
    const mergedListings = listings.map((listing) => ({
      ...listing,
      status: localStatuses[listing.id] ?? listing.status,
    }));

    return mergedListings.filter((listing) =>
      filter === "all" ? true : listing.status === filter,
    );
  }, [filter, listings, localStatuses]);

  function updateStatus(id: string, status: LandlordListingStatus) {
    setLocalStatuses((current) => ({ ...current, [id]: status }));
    setFeedback("Alteracao local pronta para sincronizar com a API.");
  }

  function duplicateListing(title: string) {
    setFeedback(`Rascunho duplicado criado a partir de ${title}.`);
  }

  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem_auto] md:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Gestao de anuncios
          </h2>
          <p className="mt-1 text-sm text-muted">
            Liste, filtre, pause, arquive, duplique e acompanhe completude.
          </p>
        </div>
        <Select
          label="Status"
          onChange={(event) =>
            setFilter(event.target.value as LandlordListingStatus | "all")
          }
          options={filterOptions}
          value={filter}
        />
        <Link
          className="inline-flex h-11 items-center justify-center rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href="/landlord/anuncios/novo"
        >
          Novo anuncio
        </Link>
      </div>

      {feedback ? (
        <p className="rounded-md bg-brand-soft p-3 text-sm font-bold text-brand">
          {feedback}
        </p>
      ) : null}

      <div className="grid gap-3">
        {visibleListings.slice(0, compact ? 2 : undefined).map((listing) => (
          <article
            className="grid gap-3 rounded-md border border-border bg-surface-raised p-3 lg:grid-cols-[5.5rem_minmax(0,1fr)_auto] lg:items-center"
            key={listing.id}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-surface-muted lg:aspect-square">
              <Image
                alt={listing.title}
                className="object-cover"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 88px, 100vw"
                src={listing.imageUrl}
              />
            </div>

            <div className="grid gap-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={statusTone[listing.status]}>
                      {statusLabels[listing.status]}
                    </Badge>
                    <Badge tone="brand">{listing.completionScore}% completo</Badge>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{listing.addressLabel}</p>
                </div>
                <p className="font-display text-xl font-bold text-foreground">
                  {formatCurrency(listing.monthlyTotal.amount)}
                  <span className="text-sm font-medium text-muted">/mes</span>
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-4">
                <Fact label="Leads" value={String(listing.activeLeads)} />
                <Fact label="Views 30d" value={String(listing.viewsLast30Days)} />
                <Fact label="Resposta" value={`${listing.responseRate}%`} />
                <Fact label="Disponivel" value={listing.availableFromLabel} />
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div
                  className={cn(
                    "h-full rounded-full",
                    listing.completionScore >= 85 ? "bg-success" : "bg-accent",
                  )}
                  style={{ width: `${listing.completionScore}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-surface px-3 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
                href={`/anuncio/${listing.id}`}
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Ver
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-3 text-sm font-bold text-white transition hover:bg-brand-strong"
                href={`/landlord/anuncios/${listing.id}/editar`}
              >
                <Edit3 className="h-4 w-4" aria-hidden="true" />
                Editar
              </Link>
              <Button
                leftIcon={
                  listing.status === "paused" ? (
                    <PlayCircle className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <PauseCircle className="h-4 w-4" aria-hidden="true" />
                  )
                }
                onClick={() =>
                  updateStatus(
                    listing.id,
                    listing.status === "paused" ? "active" : "paused",
                  )
                }
                size="sm"
                variant="secondary"
              >
                {listing.status === "paused" ? "Ativar" : "Pausar"}
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  aria-label={`Duplicar ${listing.title}`}
                  leftIcon={<Copy className="h-4 w-4" aria-hidden="true" />}
                  onClick={() => duplicateListing(listing.title)}
                  size="sm"
                  variant="secondary"
                >
                  Copiar
                </Button>
                <Button
                  aria-label={`Arquivar ${listing.title}`}
                  leftIcon={<Archive className="h-4 w-4" aria-hidden="true" />}
                  onClick={() => updateStatus(listing.id, "archived")}
                  size="sm"
                  variant="secondary"
                >
                  Arquivar
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md bg-surface-muted p-2">
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="text-sm font-bold text-muted-strong">{value}</p>
    </div>
  );
}
