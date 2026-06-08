import type { Metadata } from "next";
import { Bell, CreditCard, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { StudentDashboardShell } from "@/components/student/student-dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { InlineMessage } from "@/components/ui/inline-message";

export const metadata: Metadata = {
  title: "Configuracoes",
  description:
    "Preferencias de notificacao, privacidade, seguranca e pagamentos do estudante.",
};

const settingsSections = [
  {
    description:
      "Receba alertas sobre mensagens, mudancas de preco e disponibilidade perto do campus.",
    icon: Bell,
    label: "Notificacoes",
    status: "ativadas",
  },
  {
    description:
      "Controle dados visiveis para locadores antes e depois de uma candidatura.",
    icon: LockKeyhole,
    label: "Privacidade",
    status: "revisar",
  },
  {
    description:
      "Mantenha pagamentos e sinal dentro de fluxos verificados quando a API estiver conectada.",
    icon: CreditCard,
    label: "Pagamentos seguros",
    status: "preparado",
  },
  {
    description:
      "Confirme e-mail estudantil para aumentar confianca nas conversas.",
    icon: Mail,
    label: "Conta",
    status: "pendente",
  },
];

export default function StudentSettingsPage() {
  return (
    <StudentDashboardShell
      subtitle="Preferencias de conta para manter o uso seguro e previsivel."
      title="Configuracoes"
    >
      <InlineMessage
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="neutral"
        title="Sem backend novo nesta fase"
      >
        Estes controles deixam a arquitetura visual pronta para integrar com as
        APIs existentes de notificacao, privacidade, conta e pagamentos.
      </InlineMessage>

      <section className="grid gap-3 sm:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;

          return (
            <article
              className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs"
              key={section.label}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <Badge tone={section.status === "pendente" ? "accent" : "neutral"}>
                  {section.status}
                </Badge>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {section.label}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {section.description}
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
    </StudentDashboardShell>
  );
}
