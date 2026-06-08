import Link from "next/link";
import { BadgeCheck, Clock, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LandlordProfile } from "@/lib/types";

export function VerificationAndTrustPanel({
  profile,
}: {
  profile: LandlordProfile;
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
            Verificacao e confianca
          </h2>
          <p className="mt-1 text-sm text-muted">
            Sinais que reduzem risco percebido para estudantes.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          icon={<BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
          tone={verified ? "success" : "accent"}
        >
          {verified ? "locador verificado" : "verificacao pendente"}
        </Badge>
        <Badge
          icon={<Clock className="h-3.5 w-3.5" aria-hidden="true" />}
          tone="brand"
        >
          responde em {profile.averageResponseMinutes} min
        </Badge>
      </div>

      <div className="grid gap-2 rounded-md bg-surface-muted p-3">
        <p className="text-sm font-bold text-muted-strong">
          Reputacao {profile.reputationScore.toFixed(1)}/5
        </p>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-success"
            style={{ width: `${(profile.reputationScore / 5) * 100}%` }}
          />
        </div>
      </div>

      <Link
        className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted"
        href="/landlord/perfil"
      >
        Revisar dados de confianca
      </Link>
    </section>
  );
}
