import Link from "next/link";
import { CalendarCheck, MessageCircle, ShieldCheck } from "lucide-react";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import type { ListingDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StickyDecisionBar({
  listing,
  variant = "mobile",
}: {
  listing: ListingDetail;
  variant?: "mobile" | "sidebar";
}) {
  const messageHref = `/entrar?intent=message&listing=${listing.slug}`;
  const reserveHref = `/entrar?intent=apply&listing=${listing.slug}`;

  return (
    <aside
      className={cn(
        "grid gap-3 border border-border bg-surface p-4 shadow-md",
        variant === "mobile" &&
          "fixed inset-x-0 bottom-0 z-[var(--z-header)] rounded-t-md lg:hidden",
        variant === "sidebar" &&
          "hidden rounded-md lg:sticky lg:top-24 lg:grid",
      )}
      aria-label="Acoes para decidir"
    >
      <div className="grid gap-1">
        <p className="text-sm text-muted">Estimativa mensal total</p>
        <p className="font-display text-3xl font-bold text-foreground">
          {formatCurrency(listing.pricing.monthlyTotal.amount)}
        </p>
        <p className="text-sm text-muted">
          Hoje: {formatCurrency(listing.pricing.dueToday.amount)} - disponivel{" "}
          {formatShortDate(listing.availability.availableFrom)}
        </p>
      </div>

      <div className="grid gap-2">
        <Link
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href={messageHref}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Enviar mensagem
        </Link>
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
          href={reserveHref}
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Candidatar / reservar
        </Link>
      </div>

      <p className="inline-flex items-start gap-2 text-xs leading-5 text-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
        Voce ve custos e verificacao antes de qualquer compromisso.
      </p>
    </aside>
  );
}
