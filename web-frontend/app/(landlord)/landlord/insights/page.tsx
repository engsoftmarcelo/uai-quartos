import type { Metadata } from "next";
import { KPIGrid } from "@/components/landlord/kpi-grid";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { PerformanceChartsShell } from "@/components/landlord/performance-charts-shell";
import { ReviewManagementPanel } from "@/components/landlord/review-management-panel";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Insights de inventario com visualizacoes, contatos, candidaturas, conversao, qualidade e reviews.",
};

export default async function LandlordInsightsPage() {
  const adapter = createLandlordDashboardAdapter();
  const [overview, insights] = await Promise.all([
    adapter.getOverview(),
    adapter.getInsights(),
  ]);

  return (
    <LandlordDashboardShell
      subtitle="Transforme dados operacionais em decisoes para melhorar ocupacao."
      title="Insights"
    >
      <KPIGrid kpis={overview.kpis} />
      <PerformanceChartsShell
        listings={insights.listings}
        performance={insights.performance}
      />
      <ReviewManagementPanel reviews={insights.reviews} />
    </LandlordDashboardShell>
  );
}
