import { LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InlineMessage } from "@/components/ui/inline-message";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";

export function AuthPanel() {
  return (
    <section className="grid gap-5 rounded-md border border-border bg-surface p-4 shadow-xs sm:p-5">
      <InlineMessage
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="success"
        title="Acesso preparado para identidade verificada"
      >
        Este formulario e apenas a fundacao visual. Ele preserva a integracao
        futura com os fluxos existentes de autenticacao.
      </InlineMessage>

      <form className="grid gap-4">
        <Input
          autoComplete="email"
          label="E-mail universitario"
          name="email"
          placeholder="voce@universidade.br"
          type="email"
        />
        <Input
          autoComplete="current-password"
          label="Senha"
          name="password"
          placeholder="Minimo de 8 caracteres"
          type="password"
        />
        <RadioGroup
          defaultValue="student"
          label="Perfil"
          name="role"
          options={[
            {
              description: "Buscar quartos, conversar e reservar visitas.",
              label: "Estudante",
              value: "student",
            },
            {
              description: "Gerenciar inventario, leads e pagamentos.",
              label: "Locador",
              value: "landlord",
            },
          ]}
        />
        <Checkbox
          description="Necessario para receber alertas de seguranca e contrato."
          label="Aceito comunicacoes essenciais da plataforma"
          name="essentialConsent"
        />
        <Button leftIcon={<LogIn className="h-4 w-4" />} type="submit">
          Continuar
        </Button>
      </form>
    </section>
  );
}
