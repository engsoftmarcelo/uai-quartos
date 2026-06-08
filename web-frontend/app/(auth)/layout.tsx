import { PublicFooter } from "@/components/shared/public-footer";
import { PublicHeader } from "@/components/shared/public-header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main className="uai-container grid min-h-[calc(100svh-8rem)] content-center py-8" id="conteudo">
        {children}
      </main>
      <PublicFooter />
    </>
  );
}
