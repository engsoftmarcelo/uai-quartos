import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function ListingNotFound() {
  return (
    <div className="uai-container grid min-h-[70svh] content-center py-10">
      <EmptyState
        action={
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
            href="/buscar/resultados"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            Voltar para resultados
          </Link>
        }
        icon={<SearchX className="h-5 w-5" aria-hidden="true" />}
        title="Anuncio nao encontrado"
      >
        Este quarto pode ter sido removido, reservado ou ainda nao estar
        disponivel para visualizacao publica.
      </EmptyState>
    </div>
  );
}
