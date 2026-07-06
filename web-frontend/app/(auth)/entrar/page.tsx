import type { Metadata } from "next";
import { AuthPanel } from "@/components/forms/auth-panel";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Entrar ou criar conta",
  description:
    "Acesse sua conta de estudante ou locador no UAI QUARTOS para buscar moradia, conversar e gerenciar anúncios.",
};

export default function SignInPage() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <SectionHeader
        eyebrow="Bem-vindo"
        subtitle="Entre para continuar a busca, salvar favoritos e conversar com locadores — ou crie sua conta em menos de um minuto."
        title="Acesse sua área"
      />
      <AuthPanel />
    </div>
  );
}
