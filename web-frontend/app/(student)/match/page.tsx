import type { Metadata } from "next";
import { HeartHandshake, ShieldCheck } from "lucide-react";
import { MatchWizardShell } from "@/components/match/match-wizard-shell";
import { InlineMessage } from "@/components/ui/inline-message";
import { matchWizardSteps } from "@/lib/constants";

type RawSearchParams = Record<string, string | string[] | undefined>;

interface MatchPageProps {
  searchParams: Promise<RawSearchParams>;
}

export const metadata: Metadata = {
  title: "Roommate Matching",
  description:
    "Fluxo leve para criar um perfil de convivência e melhorar o matching de moradia universitária.",
};

export default async function MatchPage({ searchParams }: MatchPageProps) {
  const params = await searchParams;
  const step = Array.isArray(params.step) ? params.step[0] : params.step;

  return (
    <div className="grid gap-5">
      <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs sm:p-5">
        <div className="grid gap-2">
          <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
            <HeartHandshake className="h-4 w-4" aria-hidden="true" />
            Roommate Matching
          </p>
          <h1 className="font-display text-3xl font-bold text-balance text-foreground sm:text-4xl">
            Monte seu perfil de convivência sem burocracia.
          </h1>
          <p className="max-w-3xl text-pretty text-sm leading-6 text-muted sm:text-base">
            Responda uma coisa por vez. O objetivo e entender rotina, limites e
            prioridades para sugerir casas e pessoas mais compatíveis.
          </p>
        </div>
        <InlineMessage
          icon={<ShieldCheck className="h-5 w-5" />}
          tone="success"
          title="Você controla o ritmo"
        >
          O progresso fica salvo neste dispositivo e a etapa atual aparece na
          URL para você voltar sem perder contexto.
        </InlineMessage>
      </section>

      <MatchWizardShell initialStepId={step} steps={matchWizardSteps} />
    </div>
  );
}
