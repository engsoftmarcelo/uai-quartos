import Link from "next/link";
import { CalendarCheck, MessageCircle, ShieldAlert } from "lucide-react";
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
  const hasIncludedBills = listing.pricing.included.length > 0;

  return (
    <aside
      className={cn(
        "grid gap-3 border border-border bg-surface p-4 shadow-md",
        variant === "mobile" &&
          "fixed inset-x-0 bottom-0 z-[var(--z-header)] rounded-t-md lg:hidden",
        variant === "sidebar" &&
          "hidden rounded-md lg:sticky lg:top-24 lg:grid",
      )}
      aria-label="Ações para decidir"
    >
      <div className="grid gap-1">
        <p className="text-sm text-muted">Total por mês — sem taxa escondida</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <p className="font-display text-3xl font-bold text-foreground">
            {formatCurrency(listing.pricing.monthlyTotal.amount)}
          </p>
          {hasIncludedBills ? (
            <span className="rounded-md bg-success-soft px-2 py-0.5 text-xs font-bold text-success">
              contas incluídas
            </span>
          ) : null}
        </div>
        <p className="text-sm text-muted">
          Hoje: {formatCurrency(listing.pricing.dueToday.amount)} · disponível{" "}
          {formatShortDate(listing.availability.availableFrom)}
        </p>
      </div>

      <div className="grid gap-2">
        <Link
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href={messageHref}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Enviar pedido seguro
        </Link>
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
          href={reserveHref}
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Agendar visita
        </Link>
        <p className="text-center text-xs leading-5 text-muted">
          A gente registra esse contato pra você ter mais segurança. O WhatsApp
          do dono é liberado depois do primeiro contato.
        </p>
      </div>

      <p className="inline-flex items-start gap-2 rounded-md bg-accent-soft p-2.5 text-xs leading-5 text-[#72520d]">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Nunca envie dinheiro fora da plataforma sem contrato assinado.{" "}
        <Link className="font-bold underline" href="/seguranca">
          Dicas de segurança
        </Link>
      </p>
    </aside>
  );
}
