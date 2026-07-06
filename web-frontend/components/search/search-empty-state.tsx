import Link from "next/link";
import { RotateCcw, SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function SearchEmptyState() {
  return (
    <EmptyState
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
            href="/buscar"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Limpar filtros
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
            href="/buscar?nearCampus=true"
          >
            Ver perto do campus
          </Link>
        </div>
      }
      icon={<SearchX className="h-5 w-5" aria-hidden="true" />}
      title="Nenhum quarto bateu exatamente com essa busca"
    >
      Tente aumentar o orçamento, remover a data de entrada ou buscar por um
      bairro próximo. A gente mostra filtros claros para você não perder tempo.
    </EmptyState>
  );
}
