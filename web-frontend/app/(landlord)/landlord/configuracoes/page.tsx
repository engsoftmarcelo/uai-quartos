import type { Metadata } from "next";
import { Bell, CreditCard, LockKeyhole, MessageCircle, ShieldCheck } from "lucide-react";
import { LandlordDashboardShell } from "@/components/landlord/landlord-dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { InlineMessage } from "@/components/ui/inline-message";

export const metadata: Metadata = {
  title: "Configuracoes do locador",
  description:
    "Configuracoes operacionais para notificacoes, mensagens, pagamentos, privacidade e seguranca.",
};

const settings = [
  {
    description:
      "Defina alertas para leads novos, visitas, documentos e conflitos de calendario.",
    icon: Bell,
    label: "Notificacoes operacionais",
    status: "ativo",
  },
  {
    description:
      "Templates, SLA de resposta e regras de comunicacao segura com estudantes.",
    icon: MessageCircle,
    label: "Mensagens",
    status: "preparado",
  },
  {
    description:
      "Preparado para integrar repasses, taxas, splits e conciliacao sem regra no frontend.",
    icon: CreditCard,
    label: "Financeiro",
    status: "adapter",
  },
  {
    description:
      "Controle dados exibidos no perfil publico e documentos usados para verificacao.",
    icon: LockKeyhole,
    label: "Privacidade",
    status: "revisar",
  },
];

export default function LandlordSettingsPage() {
  return (
    <LandlordDashboardShell
      subtitle="Controles operacionais preparados para evoluir com APIs existentes."
      title="Configuracoes"
    >
      <InlineMessage
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="neutral"
        title="Sem backend novo nesta fase"
      >
        Os controles abaixo sao estrutura visual e arquitetural para conexao
        futura com notificacoes, mensagens, financeiro e privacidade.
      </InlineMessage>

      <section className="grid gap-3 sm:grid-cols-2">
        {settings.map((setting) => {
          const Icon = setting.icon;

          return (
            <article
              className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs"
              key={setting.label}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <Badge tone="neutral">{setting.status}</Badge>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {setting.label}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {setting.description}
                </p>
              </div>
              <button
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-bold text-muted-strong transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]"
                type="button"
              >
                Configurar
              </button>
            </article>
          );
        })}
      </section>
    </LandlordDashboardShell>
  );
}
