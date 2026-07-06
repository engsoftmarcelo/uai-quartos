import Link from "next/link";
import { RotateCcw, SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export function NoResultsState() {
  return (
    <EmptyState
      action={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
            href="/buscar/resultados"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Limpar filtros
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
            href="/buscar/resultados?commuteMax=15&totalMax=1200"
          >
            Ver opções até 15 min
          </Link>
        </div>
      }
      icon={<SearchX className="h-5 w-5" aria-hidden="true" />}
      title="Não achamos nenhum quarto com esses filtros"
    >
      Tira um pouco a exigência — aumenta o orçamento ou testa bairros
      vizinhos — que novas opções aparecem. Quartos novos entram toda semana.
    </EmptyState>
  );
}
