import type { Metadata } from "next";
import { AuthPanel } from "@/components/forms/auth-panel";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Fundacao visual do acesso para estudantes e locadores.",
};

export default function SignInPage() {
  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <SectionHeader
        eyebrow="Identidade"
        subtitle="Base visual para login, criacao de conta e verificacao sem reimplementar regra de negocio."
        title="Acesse sua area"
      />
      <AuthPanel />
    </div>
  );
}
