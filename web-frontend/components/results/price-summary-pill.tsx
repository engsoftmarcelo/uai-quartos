import { Banknote, ReceiptText } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import type { ListingSearchResult } from "@/lib/types";

export function PriceSummaryPill({
  pricing,
}: {
  pricing: ListingSearchResult["pricing"];
}) {
  return (
    <div className="grid gap-1 rounded-md bg-surface-muted px-3 py-2">
      <p className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.1em] text-muted">
        <Banknote className="h-3.5 w-3.5" aria-hidden="true" />
        custo mensal
      </p>
      <p className="font-display text-xl font-bold text-foreground">
        {formatCurrency(pricing.totalMonthly.amount)}
      </p>
      <p className="inline-flex items-center gap-1 text-xs font-medium text-muted">
        <ReceiptText className="h-3.5 w-3.5" aria-hidden="true" />
        hoje {formatCurrency(pricing.dueToday.amount)}
      </p>
    </div>
  );
}
