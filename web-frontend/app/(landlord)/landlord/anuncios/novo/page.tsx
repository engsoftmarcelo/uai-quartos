import type { Metadata } from "next";
import { ListingWizardShell } from "@/components/landlord/listing-wizard-shell";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Novo anuncio",
  description:
    "Wizard de novo anuncio com midia, localizacao, custos, regras, convivencia, disponibilidade e documentacao.",
};

export default async function NewLandlordListingPage() {
  const adapter = createLandlordDashboardAdapter();
  const draft = await adapter.getDraft();

  return (
    <LandlordDashboardShell
      subtitle="Publique com custos claros, regras explicitas e preview em tempo real."
      title="Novo anuncio"
    >
      <ListingWizardShell initialDraft={draft} mode="create" />
    </LandlordDashboardShell>
  );
}
