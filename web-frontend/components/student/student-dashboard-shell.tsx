import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";

export function StudentDashboardShell({
  action,
  children,
  subtitle,
  title,
}: {
  action?: ReactNode;
  children: ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <section className="grid gap-6">
      <SectionHeader
        action={action}
        eyebrow="Area do estudante"
        subtitle={subtitle}
        title={title}
      />
      {children}
    </section>
  );
}
