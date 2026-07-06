import { HeartHandshake, MessageCircle, Search } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    icon: Search,
    title: "Conte o que você precisa",
    text: "Campus, orçamento e seu jeito de morar: tranquilo, festeiro, com pet, focado em provas. Leva 2 minutos.",
  },
  {
    icon: HeartHandshake,
    title: "Veja repúblicas compatíveis",
    text: "A gente mostra o preço total com contas, a distância até a aula e o quanto cada casa combina com você.",
  },
  {
    icon: MessageCircle,
    title: "Fale pelo contato seguro",
    text: "Chame o dono verificado, combine a visita e assine com contrato. Sem depósito às cegas, sem golpe.",
  },
];

export function HowItWorks() {
  return (
    <section className="uai-section bg-background">
      <div className="uai-container grid gap-6">
        <SectionHeader
          eyebrow="Como funciona"
          subtitle="Três passos entre 'preciso de um quarto' e 'achei minha república'."
          title="Da busca ao contrato em três passos"
        />
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                className="grid gap-4 rounded-md border border-border bg-surface p-5 shadow-xs"
                key={step.title}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-md bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-3xl font-bold text-border-strong">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="grid gap-2">
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
