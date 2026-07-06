"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ResultsSortKey } from "@/lib/types";

const sortOptions: { label: string; value: ResultsSortKey }[] = [
  { label: "Recomendados", value: "recommended" },
  { label: "Menor custo mensal", value: "price_asc" },
  { label: "Menor valor hoje", value: "due_today_asc" },
  { label: "Mais perto do campus", value: "commute_asc" },
  { label: "Melhor avaliação", value: "rating_desc" },
];

export function ResultsSort({ value }: { value: ResultsSortKey }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateSort(nextSort: ResultsSortKey) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextSort === "recommended") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <label className="grid gap-1.5 text-sm font-bold text-muted-strong sm:min-w-52">
      Ordenar
      <select
        className="h-11 rounded-md border border-border bg-surface px-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        value={value}
        onChange={(event) => updateSort(event.target.value as ResultsSortKey)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
