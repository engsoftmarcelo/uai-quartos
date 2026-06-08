import Link from "next/link";
import { ArrowRight, FileWarning } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StudentApplication } from "@/lib/types";
import { ApplicationTimeline } from "./application-timeline";
import { StudentEmptyState } from "./student-empty-state";

const statusLabel: Record<StudentApplication["status"], string> = {
  approved: "aprovada",
  draft: "rascunho",
  rejected: "encerrada",
  sent: "enviada",
  under_review: "em analise",
  visit_scheduled: "visita marcada",
};

export function ApplicationStatusPanel({
  applications,
  compact = false,
}: {
  applications: StudentApplication[];
  compact?: boolean;
}) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Candidaturas e reservas
          </h2>
          <p className="mt-1 text-sm text-muted">
            Progresso concreto, documentos e proximo passo.
          </p>
        </div>
        {compact ? (
          <Link
            className="inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm font-bold text-brand hover:bg-brand-soft"
            href="/reservas"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {applications.length ? (
        <div className="grid gap-3">
          {(compact ? applications.slice(0, 2) : applications).map((application) => (
            <article
              className="grid gap-3 rounded-md border border-border bg-surface-raised p-3"
              key={application.id}
            >
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge tone="brand">{statusLabel[application.status]}</Badge>
                    <Badge tone="neutral">{application.submittedAtLabel}</Badge>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold text-foreground">
                    {application.listing.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Proximo passo: {application.nextAction}
                  </p>
                </div>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-bold text-white transition hover:bg-brand-strong"
                  href="/mensagens"
                >
                  Abrir conversa
                </Link>
              </div>

              {application.documentsPending.length ? (
                <div className="grid gap-1 rounded-md bg-accent-soft p-3 text-sm text-[#72520d]">
                  <p className="inline-flex items-center gap-2 font-bold">
                    <FileWarning className="h-4 w-4" aria-hidden="true" />
                    Documentos pendentes
                  </p>
                  <p>{application.documentsPending.join(", ")}</p>
                </div>
              ) : null}

              <ApplicationTimeline events={application.history} />
            </article>
          ))}
        </div>
      ) : (
        <StudentEmptyState
          actionHref="/favoritos"
          actionLabel="Ver favoritos"
          title="Nenhuma candidatura ainda"
        >
          Quando voce se candidatar ou reservar uma visita, o progresso aparece
          aqui.
        </StudentEmptyState>
      )}
    </section>
  );
}
