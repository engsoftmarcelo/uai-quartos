import type { Metadata } from "next";
import { ListingQualityChecklist } from "@/components/landlord/listing-quality-checklist";
import { ListingStatusTable } from "@/components/landlord/listing-status-table";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Anuncios do locador",
  description:
    "Gestao de anuncios com filtros, status, completude, pausa, arquivo e duplicacao.",
};

export default async function LandlordListingsPage() {
  const adapter = createLandlordDashboardAdapter();
  const listings = await adapter.getListings();
  const weakestListing = [...listings].sort(
    (first, second) => first.completionScore - second.completionScore,
  )[0];

  return (
    <LandlordDashboardShell
      subtitle="Gerencie inventario e mantenha cada anuncio pronto para converter."
      title="Anuncios"
    >
      <ListingStatusTable listings={listings} />
      {weakestListing ? (
        <ListingQualityChecklist
          issues={weakestListing.qualityIssues}
          score={weakestListing.completionScore}
        />
      ) : null}
    </LandlordDashboardShell>
  );
}
