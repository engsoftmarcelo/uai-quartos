import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/student/favorites-grid";
import { StudentDashboardShell } from "@/components/student/student-dashboard-shell";
import { createStudentDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Favoritos",
  description:
    "Shortlist do estudante com anuncios salvos, ordenacao, mudancas recentes e comparacao.",
};

export default async function StudentFavoritesPage() {
  const adapter = createStudentDashboardAdapter();
  const favorites = await adapter.getFavorites();

  return (
    <StudentDashboardShell
      subtitle="Mantenha sua shortlist viva e compare opcoes sem ansiedade."
      title="Favoritos"
    >
      <FavoritesGrid listings={favorites} />
    </StudentDashboardShell>
  );
}
