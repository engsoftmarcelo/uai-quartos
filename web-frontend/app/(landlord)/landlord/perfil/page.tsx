import type { Metadata } from "next";
import { Mail, Phone, ShieldCheck, Star } from "lucide-react";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { VerificationAndTrustPanel } from "@/components/landlord/verification-and-trust-panel";
import { Badge } from "@/components/ui/badge";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Perfil do locador",
  description:
    "Perfil operacional do locador com contato, reputacao, verificacao e confianca.",
};

export default async function LandlordProfilePage() {
  const adapter = createLandlordDashboardAdapter();
  const profile = await adapter.getProfile();

  return (
    <LandlordDashboardShell
      subtitle="Dados usados para reputacao, resposta rapida e confianca do anuncio."
      title="Perfil do locador"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                {profile.name}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Perfil preparado para conectar com APIs de conta e verificacao.
              </p>
            </div>
            <Badge tone={profile.verificationStatus === "verified" ? "success" : "accent"}>
              {profile.verificationStatus === "verified"
                ? "verificado"
                : "pendente"}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info
              icon={<Mail className="h-5 w-5" aria-hidden="true" />}
              label="E-mail"
              value={profile.email}
            />
            <Info
              icon={<Phone className="h-5 w-5" aria-hidden="true" />}
              label="Telefone"
              value={profile.phone}
            />
            <Info
              icon={<Star className="h-5 w-5" aria-hidden="true" />}
              label="Reputacao"
              value={profile.reputationScore.toFixed(1)}
            />
            <Info
              icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
              label="Documentos"
              value={profile.documentsVerified ? "verificados" : "pendentes"}
            />
          </div>
        </section>
        <VerificationAndTrustPanel profile={profile} />
      </div>
    </LandlordDashboardShell>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-2 rounded-md bg-surface-muted p-3">
      <span className="text-brand">{icon}</span>
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
        {label}
      </p>
      <p className="text-sm font-bold text-muted-strong">{value}</p>
    </div>
  );
}
