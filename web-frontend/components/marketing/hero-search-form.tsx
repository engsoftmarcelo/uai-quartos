import { CalendarDays, Home, MapPin, Search, WalletCards } from "lucide-react";
import type { SearchFormValues } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface HeroSearchFormProps {
  action?: string;
  className?: string;
  compact?: boolean;
  values?: SearchFormValues;
}

const roomTypes = [
  { label: "Qualquer tipo", value: "" },
  { label: "Quarto individual", value: "private" },
  { label: "Quarto compartilhado", value: "shared" },
  { label: "Suíte", value: "suite" },
] as const;

const budgets = [
  { label: "Qualquer orçamento", value: "" },
  { label: "Até R$ 700", value: "700" },
  { label: "Até R$ 900", value: "900" },
  { label: "Até R$ 1.200", value: "1200" },
  { label: "Até R$ 1.500", value: "1500" },
] as const;

export function HeroSearchForm({
  action = "/buscar/resultados",
  className,
  compact = false,
  values,
}: HeroSearchFormProps) {
  return (
    <form
      action={action}
      className={cn(
        "grid gap-3 rounded-md border border-border bg-surface p-3 text-foreground shadow-md",
        compact
          ? "lg:grid-cols-[minmax(0,1.4fr)_minmax(9rem,0.8fr)_minmax(9rem,0.8fr)_minmax(9rem,0.8fr)_auto]"
          : "sm:p-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(9rem,0.8fr)_minmax(9rem,0.8fr)_minmax(9rem,0.8fr)_auto]",
        className,
      )}
      method="get"
      role="search"
    >
      <SearchField
        icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
        label="Localização"
      >
        <input
          className="h-11 w-full rounded-md border border-border bg-surface px-3 pl-9 text-sm outline-none transition placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-brand/20"
          defaultValue={values?.location}
          name="location"
          placeholder="Universidade, campus, cidade ou bairro"
          type="search"
        />
      </SearchField>

      <SearchField
        icon={<WalletCards className="h-4 w-4" aria-hidden="true" />}
        label="Orçamento"
      >
        <select
          className="h-11 w-full rounded-md border border-border bg-surface px-3 pl-9 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          defaultValue={values?.budget ?? ""}
          name="budget"
        >
          {budgets.map((budget) => (
            <option key={budget.value} value={budget.value}>
              {budget.label}
            </option>
          ))}
        </select>
      </SearchField>

      <SearchField icon={<Home className="h-4 w-4" aria-hidden="true" />} label="Tipo">
        <select
          className="h-11 w-full rounded-md border border-border bg-surface px-3 pl-9 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          defaultValue={values?.roomType ?? ""}
          name="roomType"
        >
          {roomTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </SearchField>

      <SearchField
        icon={<CalendarDays className="h-4 w-4" aria-hidden="true" />}
        label="Entrada"
      >
        <input
          className="h-11 w-full rounded-md border border-border bg-surface px-3 pl-9 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          defaultValue={values?.moveIn}
          name="moveIn"
          type="date"
        />
      </SearchField>

      <div className="grid content-end">
        <button
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand px-5 text-sm font-bold text-white shadow-xs transition hover:bg-brand-strong lg:h-11"
          type="submit"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Encontrar moradia
        </button>
      </div>
    </form>
  );
}

function SearchField({
  children,
  icon,
  label,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      <span className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brand">
          {icon}
        </span>
        {children}
      </span>
    </label>
  );
}
