import Link from "next/link";
import { Home, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main
      className="uai-container grid min-h-screen content-center py-10"
      id="conteudo"
    >
      <EmptyState
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
              href="/"
            >
              <Home className="h-4 w-4" />
              Início
            </Link>
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
              href="/buscar"
            >
              <Search className="h-4 w-4" />
              Explorar quartos
            </Link>
          </div>
        }
        title="Página não encontrada"
      >
        O endereço pode ter mudado ou o anúncio pode não estar mais
        disponível.
      </EmptyState>
    </main>
  );
}
