import type { Metadata } from "next";
import { ApplicationStatusPanel } from "@/components/student/application-status-panel";
import { StudentDashboardShell } from "@/components/student/student-dashboard-shell";
import { createStudentDashboardAdapter } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "Reservas e candidaturas",
  description:
    "Acompanhe status, timeline, documentos pendentes e histórico de candidaturas.",
};

export default async function StudentReservationsPage() {
  const adapter = createStudentDashboardAdapter();
  const applications = await adapter.getApplications();

  return (
    <StudentDashboardShell
      subtitle="Veja o status real de cada candidatura e o próximo passo recomendado."
      title="Reservas e candidaturas"
    >
      <ApplicationStatusPanel applications={applications} />
    </StudentDashboardShell>
  );
}
