import type { Metadata } from "next";
import { AvailabilityCalendar } from "@/components/landlord/availability-calendar";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { createLandlordDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Calendario",
  description:
    "Calendario operacional de disponibilidade por anuncio, visitas, bloqueios e conflitos.",
};

export default async function LandlordCalendarPage() {
  const adapter = createLandlordDashboardAdapter();
  const [slots, listings] = await Promise.all([
    adapter.getCalendar(),
    adapter.getListings(),
  ]);

  return (
    <LandlordDashboardShell
      subtitle="Evite conflitos e mantenha disponibilidade clara para cada quarto."
      title="Calendario"
    >
      <AvailabilityCalendar listings={listings} slots={slots} />
    </LandlordDashboardShell>
  );
}
