"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type {
  LandlordCalendarSlot,
  LandlordCalendarStatus,
  LandlordListing,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const statusLabel: Record<LandlordCalendarStatus, string> = {
  available: "disponivel",
  blocked: "bloqueado",
  conflict: "conflito",
  visit: "visita",
};

const statusTone: Record<LandlordCalendarStatus, "success" | "accent" | "danger" | "brand"> = {
  available: "success",
  blocked: "accent",
  conflict: "danger",
  visit: "brand",
};

export function AvailabilityCalendar({
  slots,
  listings,
}: {
  slots: LandlordCalendarSlot[];
  listings: LandlordListing[];
}) {
  const [listingId, setListingId] = useState(listings[0]?.id ?? "all");
  const [minimumStay, setMinimumStay] = useState(
    String(listings[0]?.minimumStayMonths ?? 3),
  );

  const filteredSlots = useMemo(
    () =>
      slots.filter((slot) => (listingId === "all" ? true : slot.listingId === listingId)),
    [listingId, slots],
  );
  const selectedListing = listings.find((listing) => listing.id === listingId);
  const hasConflicts = filteredSlots.some((slot) => slot.status === "conflict");

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs md:grid-cols-[minmax(0,1fr)_16rem_12rem] md:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Calendario de disponibilidade
          </h2>
          <p className="mt-1 text-sm text-muted">
            Controle datas por imovel/quarto, conflitos e duracao minima.
          </p>
        </div>
        <Select
          label="Anuncio"
          onChange={(event) => {
            const nextListingId = event.target.value;
            const nextListing = listings.find((item) => item.id === nextListingId);
            setListingId(nextListingId);
            setMinimumStay(String(nextListing?.minimumStayMonths ?? minimumStay));
          }}
          options={[
            { label: "Todos", value: "all" },
            ...listings.map((listing) => ({
              label: listing.title,
              value: listing.id,
            })),
          ]}
          value={listingId}
        />
        <Input
          label="Duracao minima"
          min={1}
          onChange={(event) => setMinimumStay(event.target.value)}
          trailingElement={<span className="text-xs font-bold">meses</span>}
          type="number"
          value={minimumStay}
        />
      </div>

      {hasConflicts ? (
        <p className="inline-flex items-start gap-2 rounded-md border border-danger/25 bg-danger-soft p-3 text-sm font-bold text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4" aria-hidden="true" />
          Existem conflitos de data para revisar antes de aceitar novas visitas.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSlots.map((slot) => {
          const listing = listings.find((item) => item.id === slot.listingId);

          return (
            <article
              className={cn(
                "grid gap-3 rounded-md border bg-surface p-4 shadow-xs",
                slot.status === "conflict"
                  ? "border-danger/30"
                  : "border-border",
              )}
              key={slot.id}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-soft text-brand">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                </span>
                <Badge tone={statusTone[slot.status]}>
                  {statusLabel[slot.status]}
                </Badge>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {slot.dateLabel}
                </h3>
                <p className="mt-1 text-sm font-bold text-muted-strong">
                  {listing?.title ?? selectedListing?.title ?? "Anuncio"}
                </p>
                <p className="mt-2 text-sm leading-6 text-muted">{slot.note}</p>
              </div>
              <p className="inline-flex items-center gap-2 text-sm font-bold text-muted">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                Duracao minima atual: {minimumStay || "0"} meses
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
