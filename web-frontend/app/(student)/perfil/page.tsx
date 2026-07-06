import type { Metadata } from "next";
import { Clock, GraduationCap, Home, ShieldCheck } from "lucide-react";
import { ProfileCompletionCard } from "@/components/student/profile-completion-card";
import { StudentDashboardShell } from "@/components/student/student-dashboard-shell";
import { VerificationStatusCard } from "@/components/student/verification-status-card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { createStudentDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Perfil do estudante",
  description:
    "Dados pessoais, universidade, preferências de moradia, verificação e privacidade.",
};

export default async function StudentProfilePage() {
  const adapter = createStudentDashboardAdapter();
  const { preferences, profile } = await adapter.getProfile();

  return (
    <StudentDashboardShell
      subtitle="Controle os dados que sustentam candidaturas, match e recomendações."
      title="Perfil"
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ProfileCompletionCard preferences={preferences} profile={profile} />
        <VerificationStatusCard profile={profile} />
      </div>

      <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-soft text-brand">
            <Home className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Preferências de moradia
            </h2>
            <p className="mt-1 text-sm text-muted">
              Dados preparados para alimentar recomendações e score de
              compatibilidade.
            </p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            icon={<GraduationCap className="h-5 w-5" aria-hidden="true" />}
            label="Campus"
            value={profile.campus}
          />
          <InfoCard
            icon={<Clock className="h-5 w-5" aria-hidden="true" />}
            label="Deslocamento máximo"
            value={`${preferences.commuteMaxMinutes} min`}
          />
          <InfoCard
            icon={<Home className="h-5 w-5" aria-hidden="true" />}
            label="Budget máximo"
            value={`${formatCurrency(preferences.budgetMax.amount)}/mes`}
          />
          <InfoCard
            icon={<ShieldCheck className="h-5 w-5" aria-hidden="true" />}
            label="Entrada"
            value={preferences.moveInWindow}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...preferences.houseStyle, ...preferences.priorities].map((item) => (
            <Badge key={item} tone="neutral">
              {item}
            </Badge>
          ))}
        </div>
      </section>
    </StudentDashboardShell>
  );
}

function InfoCard({
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
