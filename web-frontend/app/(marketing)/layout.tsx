import { PublicFooter } from "@/components/shared/public-footer";
import { PublicHeader } from "@/components/shared/public-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PublicHeader />
      <main id="conteudo">{children}</main>
      <PublicFooter />
    </>
  );
}
