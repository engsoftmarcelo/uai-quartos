import type { Metadata } from "next";
import { LeadsInbox } from "@/components/landlord/leads-inbox";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Leads",
  description:
    "Inbox operacional do locador com leads agrupados por anúncio, histórico e resposta rápida.",
};

export default async function LandlordLeadsPage() {
  const adapter = createLandlordDashboardAdapter();
  const [leads, listings] = await Promise.all([
    adapter.getLeads(),
    adapter.getListings(),
  ]);

  return (
    <LandlordDashboardShell
      subtitle="Centralize conversas, respostas rápidas e contexto de cada anúncio."
      title="Leads"
    >
      <LeadsInbox leads={leads} listings={listings} />
    </LandlordDashboardShell>
  );
}
