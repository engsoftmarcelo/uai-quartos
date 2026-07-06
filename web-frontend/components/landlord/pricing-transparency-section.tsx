"use client";

import { Banknote, ShieldCheck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { InlineMessage } from "@/components/ui/inline-message";
import { PriceBreakdown } from "@/components/ui/price-breakdown";
import { formatCurrency } from "@/lib/formatters";

export function PricingTransparencySection({
  billsIncluded,
  depositAmount,
  monthlyRent,
  onBillsIncludedChange,
  onDepositChange,
  onRentChange,
}: {
  billsIncluded: boolean;
  depositAmount: number;
  monthlyRent: number;
  onBillsIncludedChange: (value: boolean) => void;
  onDepositChange: (value: number) => void;
  onRentChange: (value: number) => void;
}) {
  const estimatedBills = billsIncluded ? 0 : 180;
  const dueToday = depositAmount;

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Custos transparentes
        </h2>
        <p className="mt-1 text-sm text-muted">
          O estudante precisa entender mensalidade, contas e valor para entrar.
        </p>
      </div>
      <InlineMessage
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="success"
        title="Sem custo escondido"
      >
        Mostre o total mensal estimado e deixe claro se contas estão inclusas.
      </InlineMessage>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Aluguel mensal"
          leadingIcon={<Banknote className="h-4 w-4" aria-hidden="true" />}
          min={0}
          onChange={(event) => onRentChange(Number(event.target.value))}
          type="number"
          value={monthlyRent}
        />
        <Input
          label="Caução / depósito"
          leadingIcon={<Banknote className="h-4 w-4" aria-hidden="true" />}
          min={0}
          onChange={(event) => onDepositChange(Number(event.target.value))}
          type="number"
          value={depositAmount}
        />
      </div>
      <Checkbox
        checked={billsIncluded}
        description="Quando ativado, o anúncio comunica que contas recorrentes já entram no valor."
        label="Contas inclusas"
        onChange={(event) => onBillsIncludedChange(event.target.checked)}
      />
      <PriceBreakdown
        lines={[
          { amount: monthlyRent, label: "Aluguel mensal" },
          {
            amount: estimatedBills,
            label: billsIncluded ? "Contas inclusas" : "Estimativa de contas",
            tone: billsIncluded ? "positive" : "warning",
          },
          { amount: dueToday, label: "Valor devido hoje", tone: "warning" },
        ]}
        totalLabel={`Total estimado: ${formatCurrency(monthlyRent + estimatedBills)}/mes`}
      />
    </section>
  );
}
