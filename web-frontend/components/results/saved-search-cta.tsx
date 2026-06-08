import { Bell, ShieldCheck } from "lucide-react";

export function SavedSearchCTA() {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-foreground p-4 text-white shadow-xs">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-brand">
          <Bell className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold">Salvar esta busca</h2>
          <p className="text-sm text-white/72">
            Receba alertas quando aparecer moradia com estes filtros.
          </p>
        </div>
      </div>
      <button
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-bold text-foreground transition hover:bg-[#ffd06a]"
        type="button"
      >
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Criar alerta seguro
      </button>
    </section>
  );
}
