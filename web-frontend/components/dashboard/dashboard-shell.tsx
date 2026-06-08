import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/section-header";

export interface DashboardShellProps {
  children: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title: string;
}

export function DashboardShell({
  children,
  eyebrow = "Dashboard",
  subtitle,
  title,
}: DashboardShellProps) {
  return (
    <section className="grid gap-6">
      <SectionHeader eyebrow={eyebrow} subtitle={subtitle} title={title} />
      {children}
    </section>
  );
}
