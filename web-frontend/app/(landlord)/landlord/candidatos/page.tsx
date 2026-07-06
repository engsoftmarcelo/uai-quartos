import type { Metadata } from "next";
import { ApplicantsPipeline } from "@/components/landlord/applicants-pipeline";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Candidatos",
  description:
    "Pipeline de candidatos por etapa, documentos pendentes, visitas e próximos passos.",
};

export default async function LandlordApplicantsPage() {
  const adapter = createLandlordDashboardAdapter();
  const [applicants, listings] = await Promise.all([
    adapter.getApplicants(),
    adapter.getListings(),
  ]);

  return (
    <LandlordDashboardShell
      subtitle="Acompanhe triagem, documentos, visitas, decisao e histórico operacional."
      title="Candidatos"
    >
      <ApplicantsPipeline applicants={applicants} listings={listings} />
    </LandlordDashboardShell>
  );
}
