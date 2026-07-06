import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListingWizardShell } from "@/components/landlord/listing-wizard-shell";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditListingPageProps): Promise<Metadata> {
  const { id } = await params;
  const adapter = createLandlordDashboardAdapter();
  const listing = await adapter.getListing(id);

  return {
    title: listing ? `Editar ${listing.title}` : "Anúncio não encontrado",
    description:
      "Wizard de edicao de anúncio com preview em tempo real e checklist de qualidade.",
  };
}

export default async function EditLandlordListingPage({
  params,
}: EditListingPageProps) {
  const { id } = await params;
  const adapter = createLandlordDashboardAdapter();
  const listing = await adapter.getListing(id);

  if (!listing) {
    notFound();
  }

  const draft = await adapter.getDraft(id);

  return (
    <LandlordDashboardShell
      subtitle="Atualize dados criticos sem esconder custos ou disponibilidade."
      title={`Editar ${listing.title}`}
    >
      <ListingWizardShell initialDraft={draft} mode="edit" />
    </LandlordDashboardShell>
  );
}
