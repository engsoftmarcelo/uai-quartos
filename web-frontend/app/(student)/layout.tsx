import { AppShell } from "@/components/shared/app-shell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell area="student">{children}</AppShell>;
}
