import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export interface PriceLine {
  amount: number;
  label: string;
  tone?: "neutral" | "positive" | "warning";
}

export interface PriceBreakdownProps {
  className?: string;
  lines: PriceLine[];
  periodLabel?: string;
  totalLabel?: string;
}

export function PriceBreakdown({
  className,
  lines,
  periodLabel = "/mes",
  totalLabel = "Total estimado",
}: PriceBreakdownProps) {
  const total = lines.reduce((sum, line) => sum + line.amount, 0);

  return (
    <dl
      className={cn(
        "grid gap-3 rounded-md border border-border bg-surface p-4",
        className,
      )}
    >
      {lines.map((line) => (
        <div className="flex items-center justify-between gap-4" key={line.label}>
          <dt className="text-sm text-muted">{line.label}</dt>
          <dd
            className={cn(
              "text-sm font-bold text-muted-strong",
              line.tone === "positive" && "text-success",
              line.tone === "warning" && "text-[#72520d]",
            )}
          >
            {formatCurrency(line.amount)}
          </dd>
        </div>
      ))}
      <div className="flex items-end justify-between gap-4 border-t border-border pt-3">
        <dt className="text-sm font-bold text-muted-strong">{totalLabel}</dt>
        <dd className="text-right">
          <span className="font-display text-2xl font-bold text-foreground">
            {formatCurrency(total)}
          </span>
          <span className="ml-1 text-sm text-muted">{periodLabel}</span>
        </dd>
      </div>
    </dl>
  );
}
