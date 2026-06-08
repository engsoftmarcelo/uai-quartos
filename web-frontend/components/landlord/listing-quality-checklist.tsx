import { CheckCircle2, CircleAlert } from "lucide-react";

export function ListingQualityChecklist({
  issues,
  score,
}: {
  issues: string[];
  score: number;
}) {
  const complete = score >= 90;

  return (
    <section className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">
            Qualidade do anuncio
          </h2>
          <p className="mt-1 text-sm text-muted">
            Checklist visual para reduzir duvidas antes da publicacao.
          </p>
        </div>
        <span className="font-display text-2xl font-bold text-brand">
          {score}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-brand"
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="grid gap-2">
        {issues.length ? (
          issues.map((issue) => (
            <p
              className="inline-flex items-start gap-2 rounded-md bg-accent-soft p-2 text-sm font-medium text-[#72520d]"
              key={issue}
            >
              <CircleAlert className="mt-0.5 h-4 w-4" aria-hidden="true" />
              {issue}
            </p>
          ))
        ) : (
          <p className="inline-flex items-start gap-2 rounded-md bg-success-soft p-2 text-sm font-medium text-success">
            <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />
            Anuncio pronto para publicar com confianca.
          </p>
        )}
        {complete ? null : (
          <p className="text-sm leading-6 text-muted">
            Priorize midia real, custo total, regras e disponibilidade. Isso
            reduz conversas repetidas e melhora conversao.
          </p>
        )}
      </div>
    </section>
  );
}
