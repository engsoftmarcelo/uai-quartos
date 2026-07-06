import type { Metadata } from "next";
import { ListingWizardShell } from "@/components/landlord/listing-wizard-shell";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Novo anúncio",
  description:
    "Wizard de novo anúncio com mídia, localização, custos, regras, convivência, disponibilidade e documentação.",
};

export default async function NewLandlordListingPage() {
  const adapter = createLandlordDashboardAdapter();
  const draft = await adapter.getDraft();

  return (
    <LandlordDashboardShell
      subtitle="Publique com custos claros, regras explicitas e preview em tempo real."
      title="Novo anúncio"
    >
      <ListingWizardShell initialDraft={draft} mode="create" />
    </LandlordDashboardShell>
  );
}
