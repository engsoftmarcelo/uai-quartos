import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ActionCenter } from "@/components/landlord/action-center";
import { KPIGrid } from "@/components/landlord/kpi-grid";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { ListingStatusTable } from "@/components/landlord/listing-status-table";
import { PerformanceChartsShell } from "@/components/landlord/performance-charts-shell";
import { ReviewManagementPanel } from "@/components/landlord/review-management-panel";
import { Badge } from "@/components/ui/badge";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Dashboard do locador",
  description:
    "Painel operacional do locador com KPIs, tarefas, leads, inventario, reviews e performance.",
};

export default async function LandlordDashboardPage() {
  const adapter = createLandlordDashboardAdapter();
  const overview = await adapter.getOverview();
  const newLeads = overview.leads.filter((lead) => lead.stage === "new");

  return (
    <LandlordDashboardShell
      action={
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href="/landlord/anuncios/novo"
        >
          Novo anuncio
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      }
      subtitle="Gestao de inventario, leads, candidatos e performance em um unico fluxo operacional."
      title="Painel operacional"
    >
      <KPIGrid kpis={overview.kpis} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <ActionCenter tasks={overview.tasks} />
        <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Leads novos
              </h2>
              <p className="mt-1 text-sm text-muted">
                Responda rapido para manter a conversao viva.
              </p>
            </div>
            <Badge tone="accent">{newLeads.length} novos</Badge>
          </div>
          <div className="grid gap-2">
            {newLeads.map((lead) => (
              <Link
                className="grid gap-1 rounded-md border border-border bg-surface-raised p-3 transition hover:bg-surface-muted"
                href="/landlord/leads"
                key={lead.id}
              >
                <span className="font-bold text-muted-strong">{lead.name}</span>
                <span className="line-clamp-2 text-sm leading-5 text-muted">
                  {lead.messagePreview}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-brand">
                  {lead.matchScore}% match - {lead.lastInteractionLabel}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <ListingStatusTable compact listings={overview.listings} />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <PerformanceChartsShell
          listings={overview.listings}
          performance={overview.performance}
        />
        <ReviewManagementPanel reviews={overview.reviews} />
      </section>

      <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Recomendacoes para conversao
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            "Responder leads novos em ate 1 hora",
            "Completar midia real dos anuncios ativos",
            "Deixar valor de entrada e contas sempre visiveis",
          ].map((recommendation) => (
            <p
              className="rounded-md bg-surface-muted p-3 text-sm font-bold text-muted-strong"
              key={recommendation}
            >
              {recommendation}
            </p>
          ))}
        </div>
      </section>
    </LandlordDashboardShell>
  );
}
