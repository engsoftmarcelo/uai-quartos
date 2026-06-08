import type { Metadata } from "next";
import { StudentInbox } from "@/components/student/student-inbox";
import { StudentDashboardShell } from "@/components/student/student-dashboard-shell";
import { createStudentDashboardAdapter } from "@/lib/adapters";

type RawSearchParams = Record<string, string | string[] | undefined>;

interface MessagesPageProps {
  searchParams: Promise<RawSearchParams>;
}

export const metadata: Metadata = {
  title: "Mensagens",
  description:
    "Inbox do estudante com conversas, templates rapidos, anexos e avisos de pagamento seguro.",
};

export default async function StudentMessagesPage({
  searchParams,
}: MessagesPageProps) {
  const params = await searchParams;
  const initialConversationId = Array.isArray(params.conversation)
    ? params.conversation[0]
    : params.conversation;
  const adapter = createStudentDashboardAdapter();
  const conversations = await adapter.getConversations();

  return (
    <StudentDashboardShell
      subtitle="Centralize combinados, documentos e proximos passos com cada locador."
      title="Mensagens"
    >
      <StudentInbox
        conversations={conversations}
        initialConversationId={initialConversationId}
      />
    </StudentDashboardShell>
  );
}
