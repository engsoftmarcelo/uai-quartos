import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, Sparkles } from "lucide-react";
import { ApplicationStatusPanel } from "@/components/student/application-status-panel";
import { NextActionCard } from "@/components/student/next-action-card";
import { PendingChecklist } from "@/components/student/pending-checklist";
import { RecentMessagesPanel } from "@/components/student/recent-messages-panel";
import { SavedListingCard } from "@/components/student/saved-listing-card";
import { SavedListingsPanel } from "@/components/student/saved-listings-panel";
import { StudentDashboardShell } from "@/components/student/student-dashboard-shell";
import { StudentSummaryCard } from "@/components/student/student-summary-card";
import { Badge } from "@/components/ui/badge";
import { createStudentDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Dashboard do estudante",
  description:
    "Home logada do estudante com próximos passos, favoritos, mensagens, candidaturas e recomendações.",
};

export default async function StudentDashboardPage() {
  const adapter = createStudentDashboardAdapter();
  const overview = await adapter.getOverview();
  const nextPendingItem = overview.checklist.find(
    (item) => item.status !== "done",
  );
  const nextApplication = overview.applications[0];

  return (
    <StudentDashboardShell
      action={
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
          href="/buscar/resultados"
        >
          Buscar moradia
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      }
      subtitle="Acompanhe conversas, favoritos e candidaturas sem perder o próximo passo."
      title={`Ola, ${overview.profile.name.split(" ")[0]}`}
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <StudentSummaryCard
          preferences={overview.preferences}
          profile={overview.profile}
        />
        <NextActionCard
          href={nextPendingItem?.href ?? "/mensagens"}
          label={nextPendingItem ? "Resolver agora" : "Abrir conversa"}
          title={
            nextPendingItem?.label ??
            nextApplication?.nextAction ??
            "Continue sua busca com segurança"
          }
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <PendingChecklist items={overview.checklist} />
        <RecentMessagesPanel conversations={overview.conversations} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <SavedListingsPanel listings={overview.savedListings} />
        <ApplicationStatusPanel applications={overview.applications} compact />
      </div>

      <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
              <Bell className="h-4 w-4" aria-hidden="true" />
              Alertas de disponibilidade
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
              Oportunidades que merecem atenção
            </h2>
          </div>
          <Badge tone="signal">{overview.alerts.length} ativos</Badge>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {overview.alerts.map((alert) => (
            <Link
              className="grid gap-1 rounded-md border border-border bg-surface-raised p-3 transition hover:bg-surface-muted"
              href={alert.href}
              key={alert.id}
            >
              <span className="font-bold text-muted-strong">{alert.label}</span>
              <span className="text-sm text-muted">{alert.meta}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Recomendações
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
            Combinam com campus, budget e match
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overview.recommendations.map((listing) => (
            <SavedListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </StudentDashboardShell>
  );
}
