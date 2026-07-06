import Link from "next/link";
import { Building2, ShieldCheck } from "lucide-react";
import { HeroSearchForm } from "@/components/marketing/hero-search-form";
import { InlineMessage } from "@/components/ui/inline-message";
import type { SearchFormValues } from "@/lib/types";

export interface SearchStarterPanelProps {
  values?: SearchFormValues;
}

export function SearchStarterPanel({ values }: SearchStarterPanelProps) {
  return (
    <section className="grid gap-5 rounded-md border border-border bg-surface p-4 shadow-sm sm:p-5">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="grid gap-2">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
            Busca de moradia
          </p>
          <h1 className="font-display text-3xl font-bold text-balance text-foreground sm:text-4xl">
            Encontre um quarto perto da faculdade, no seu orçamento.
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-7 text-muted">
            Refine por campus, bairro, preço, data de entrada e sinais de
            confiança. A URL da busca fica compartilhável e pronta para SEO.
          </p>
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
          href="/landlord"
        >
          <Building2 className="h-4 w-4" aria-hidden="true" />
          Anunciar um quarto
        </Link>
      </div>

      <HeroSearchForm compact values={values} />

      <InlineMessage
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="success"
        title="Compare com mais segurança"
      >
        A busca prioriza clareza: preço, distância, status do anúncio e reviews
        ficam visíveis antes do contato.
      </InlineMessage>
    </section>
  );
}
