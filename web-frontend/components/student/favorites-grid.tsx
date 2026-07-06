"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  GitCompare,
  Heart,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/lib/formatters";
import type { StudentSavedListing } from "@/lib/types";
import { cn } from "@/lib/utils";

type FavoritesSort = "match" | "price" | "recent";

const sortOptions = [
  { label: "Melhor match", value: "match" },
  { label: "Menor custo mensal", value: "price" },
  { label: "Salvos recentemente", value: "recent" },
];

export function FavoritesGrid({
  listings,
}: {
  listings: StudentSavedListing[];
}) {
  const [sort, setSort] = useState<FavoritesSort>("match");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const sortedListings = useMemo(() => {
    return [...listings].sort((first, second) => {
      if (sort === "price") {
        return first.totalMonthly.amount - second.totalMonthly.amount;
      }

      if (sort === "recent") {
        return first.savedAtLabel.localeCompare(second.savedAtLabel);
      }

      return second.matchScore - first.matchScore;
    });
  }, [listings, sort]);

  function toggleSelection(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  }

  if (!listings.length) {
    return (
      <section className="grid gap-4 rounded-md border border-dashed border-border bg-surface p-6 text-center">
        <Heart className="mx-auto h-8 w-8 text-brand" aria-hidden="true" />
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Sua shortlist ainda esta vazia
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted">
            Salve quartos promissores para comparar custos, match, mudanças de
            preço e próximo passo sem recomecar a busca.
          </p>
        </div>
        <Link
          className="mx-auto inline-flex h-11 items-center justify-center rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href="/buscar/resultados"
        >
          Buscar quartos
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs md:grid-cols-[minmax(0,1fr)_16rem_auto] md:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Favoritos salvos
          </h2>
          <p className="mt-1 text-sm text-muted">
            Compare opções vivas por custo real, match e mudanças recentes.
          </p>
        </div>
        <Select
          label="Ordenar"
          onChange={(event) => setSort(event.target.value as FavoritesSort)}
          options={sortOptions}
          value={sort}
        />
        <Button
          disabled={selectedIds.length < 2}
          disabledReason="Selecione pelo menos dois anúncios para comparar."
          leftIcon={<GitCompare className="h-4 w-4" aria-hidden="true" />}
          variant="secondary"
        >
          Comparar {selectedIds.length ? `(${selectedIds.length})` : ""}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sortedListings.map((listing) => {
          const selected = selectedIds.includes(listing.id);

          return (
            <article
              className={cn(
                "overflow-hidden rounded-md border bg-surface shadow-xs transition",
                selected
                  ? "border-brand ring-2 ring-brand/20"
                  : "border-border hover:-translate-y-0.5 hover:shadow-sm",
              )}
              key={listing.id}
            >
              <div className="relative aspect-[4/3] bg-surface-muted">
                <Image
                  alt={listing.title}
                  className="object-cover"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1280px) 28vw, (min-width: 640px) 45vw, 100vw"
                  src={listing.imageUrl}
                />
                <Badge
                  className="absolute left-3 top-3"
                  icon={<Heart className="h-3.5 w-3.5 fill-current" />}
                  tone="brand"
                >
                  {listing.matchScore}% match
                </Badge>
                <button
                  aria-pressed={selected}
                  className="absolute right-3 top-3 inline-flex h-10 items-center gap-2 rounded-md bg-surface/95 px-3 text-xs font-bold text-muted-strong shadow-xs transition hover:bg-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]"
                  onClick={() => toggleSelection(listing.id)}
                  type="button"
                >
                  <CheckCircle2
                    className={cn(
                      "h-4 w-4",
                      selected ? "text-brand" : "text-muted",
                    )}
                    aria-hidden="true"
                  />
                  Comparar
                </button>
              </div>

              <div className="grid gap-3 p-4">
                <div>
                  <p className="text-sm font-bold text-brand">
                    {listing.campusLabel}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground">
                    {listing.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {listing.neighborhood}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {listing.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>

                <div className="grid gap-2 rounded-md bg-surface-muted p-3">
                  <p className="font-display text-2xl font-bold text-foreground">
                    {formatCurrency(listing.totalMonthly.amount)}
                    <span className="text-sm font-medium text-muted">/mês</span>
                  </p>
                  <p className="text-sm text-muted">
                    Hoje: {formatCurrency(listing.dueToday.amount)} -{" "}
                    {listing.savedAtLabel}
                  </p>
                </div>

                {listing.changes.length ? (
                  <div className="grid gap-1 rounded-md bg-success-soft p-3">
                    {listing.changes.map((change) => (
                      <p
                        className="inline-flex items-center gap-2 text-sm font-bold text-success"
                        key={change}
                      >
                        {change.includes("preço") ? (
                          <TrendingDown
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bell className="h-4 w-4" aria-hidden="true" />
                        )}
                        {change}
                      </p>
                    ))}
                  </div>
                ) : null}

                <Link
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
                  href={`/anuncio/${listing.slug}`}
                >
                  Ver detalhes
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
