import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";

export function LandlordDashboardShell({
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
        eyebrow="Area do locador"
        subtitle={subtitle}
        title={title}
      />
      {children}
    </section>
  );
}
