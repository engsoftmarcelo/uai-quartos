import { AppShell } from "@/components/shared/app-shell";

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell area="landlord">{children}</AppShell>;
}
