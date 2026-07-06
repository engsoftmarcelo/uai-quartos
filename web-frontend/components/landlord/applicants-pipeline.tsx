"use client";

import { useMemo, useState } from "react";
import { FileWarning, MoveRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  LandlordApplicant,
  LandlordApplicantStage,
  LandlordListing,
} from "@/lib/types";

const orderedStages: LandlordApplicantStage[] = [
  "screening",
  "documents",
  "visit",
  "decision",
  "approved",
  "rejected",
];

const stageLabels: Record<LandlordApplicantStage, string> = {
  approved: "aprovado",
  decision: "decisao",
  documents: "documentos",
  rejected: "recusado",
  screening: "triagem",
  visit: "visita",
};

export function ApplicantsPipeline({
  applicants,
  listings,
}: {
  applicants: LandlordApplicant[];
  listings: LandlordListing[];
}) {
  const [localStages, setLocalStages] = useState<
    Record<string, LandlordApplicantStage>
  >({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<LandlordApplicantStage, LandlordApplicant[]>();
    orderedStages.forEach((stage) => map.set(stage, []));

    applicants.forEach((applicant) => {
      const stage = localStages[applicant.id] ?? applicant.stage;
      map.get(stage)?.push({ ...applicant, stage });
    });

    return map;
  }, [applicants, localStages]);

  function advance(applicant: LandlordApplicant) {
    const currentStage = localStages[applicant.id] ?? applicant.stage;
    const index = orderedStages.indexOf(currentStage);
    const nextStage = orderedStages[Math.min(index + 1, orderedStages.length - 1)];

    setLocalStages((current) => ({ ...current, [applicant.id]: nextStage }));
    setFeedback(`${applicant.name} movido para ${stageLabels[nextStage]}.`);
  }

  return (
    <section className="grid gap-4">
      <div className="rounded-md border border-border bg-surface p-4 shadow-xs">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Pipeline de candidatos
        </h2>
        <p className="mt-1 text-sm text-muted">
          Agrupe por etapa, veja documentos pendentes e mantenha o próximo passo
          claro.
        </p>
        {feedback ? (
          <p className="mt-3 rounded-md bg-brand-soft p-3 text-sm font-bold text-brand">
            {feedback}
          </p>
        ) : null}
      </div>

      <div className="grid gap-3 xl:grid-cols-3 2xl:grid-cols-6">
        {orderedStages.map((stage) => (
          <section
            className="grid content-start gap-3 rounded-md border border-border bg-surface p-3 shadow-xs"
            key={stage}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-display text-lg font-bold text-foreground">
                {stageLabels[stage]}
              </h3>
              <Badge tone="neutral">{grouped.get(stage)?.length ?? 0}</Badge>
            </div>

            {(grouped.get(stage) ?? []).map((applicant) => {
              const listing = listings.find(
                (item) => item.id === applicant.connectedListingId,
              );

              return (
                <article
                  className="grid gap-3 rounded-md border border-border bg-surface-raised p-3"
                  key={applicant.id}
                >
                  <div>
                    <p className="font-bold text-muted-strong">
                      {applicant.name}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {listing?.title ?? "Anúncio"} - {applicant.matchScore}% match
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-muted">
                    {applicant.nextAction}
                  </p>
                  {applicant.documentsPending.length ? (
                    <div className="grid gap-1 rounded-md bg-accent-soft p-2 text-sm text-[#72520d]">
                      <p className="inline-flex items-center gap-2 font-bold">
                        <FileWarning className="h-4 w-4" aria-hidden="true" />
                        Pendencias
                      </p>
                      <p>{applicant.documentsPending.join(", ")}</p>
                    </div>
                  ) : null}
                  <Button
                    disabled={stage === "rejected" || stage === "approved"}
                    disabledReason="Candidatura já esta em etapa final."
                    onClick={() => advance(applicant)}
                    rightIcon={<MoveRight className="h-4 w-4" aria-hidden="true" />}
                    size="sm"
                    variant="secondary"
                  >
                    Avancar
                  </Button>
                </article>
              );
            })}
          </section>
        ))}
      </div>
    </section>
  );
}
