import Link from "next/link";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { StudentProfileSummary } from "@/lib/types";

export function VerificationStatusCard({
  profile,
}: {
  profile: StudentProfileSummary;
}) {
  const verified = profile.verificationStatus === "verified";

  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-success-soft text-success">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Verificação e privacidade
          </h2>
          <p className="mt-1 text-sm text-muted">
            Aumenta confiança sem expor dados desnecessarios.
          </p>
        </div>
      </div>

      <Badge tone={verified ? "success" : "accent"}>
        {verified ? "perfil verificado" : "verificação pendente"}
      </Badge>

      <div className="grid gap-2 rounded-md bg-surface-muted p-3 text-sm leading-6 text-muted">
        <p className="inline-flex items-center gap-2 font-bold text-muted-strong">
          <LockKeyhole className="h-4 w-4 text-brand" aria-hidden="true" />
          Privacidade
        </p>
        <p>
          Locadores veem apenas dados necessários para avaliar candidatura. Dados
          sensíveis devem ser enviados somente em fluxos verificados.
        </p>
      </div>

      <Link
        className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
        href="/perfil"
      >
        Revisar privacidade
      </Link>
    </section>
  );
}
