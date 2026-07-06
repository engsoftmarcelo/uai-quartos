import { ReceiptText, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { ListingDetail } from "@/lib/types";

export function TransparentPricingCard({
  pricing,
}: {
  pricing: ListingDetail["pricing"];
}) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
          <ReceiptText className="h-4 w-4" aria-hidden="true" />
          custos transparentes
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Quanto custa de verdade
        </h2>
        <p className="text-sm leading-6 text-muted">
          Sem esconder custo inicial: veja aluguel, contas, caução, taxas,
          valor devido hoje e estimativa mensal total.
        </p>
      </div>

      <dl className="grid gap-2">
        {pricing.lines.map((line) => (
          <div
            className="grid gap-1 rounded-md border border-border bg-surface-raised p-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            key={line.id}
          >
            <dt>
              <p className="font-bold text-muted-strong">{line.label}</p>
              <p className="text-sm text-muted">{line.description}</p>
            </dt>
            <dd className="font-display text-xl font-bold text-foreground">
              {line.amount.amount === 0
                ? "R$ 0"
                : formatCurrency(line.amount.amount)}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-3 rounded-md bg-foreground p-4 text-white">
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm text-white/72">Valor devido hoje</p>
          <p className="font-display text-3xl font-bold">
            {formatCurrency(pricing.dueToday.amount)}
          </p>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-white/12 pt-3">
          <p className="text-sm text-white/72">Total por mês</p>
          <p className="font-display text-3xl font-bold">
            {formatCurrency(pricing.monthlyTotal.amount)}
          </p>
        </div>
        <p className="text-sm font-bold text-white/88">
          Você paga isso todo mês. Nada além disso.
        </p>
      </div>

      <div className="grid gap-2">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
          <ShieldCheck className="h-4 w-4 text-success" aria-hidden="true" />
          Incluido no anúncio
        </p>
        <div className="flex flex-wrap gap-2">
          {pricing.included.map((item) => (
            <span
              className="rounded-md bg-success-soft px-2 py-1 text-xs font-bold text-success"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
