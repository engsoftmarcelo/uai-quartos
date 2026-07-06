import { CalendarCheck, MessageCircle, Search, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const steps = [
  {
    icon: Search,
    title: "Busque pelo seu mapa mental",
    text: "Digite campus, bairro ou cidade e filtre por orçamento, tipo de quarto e data de entrada.",
  },
  {
    icon: ShieldCheck,
    title: "Compare sinais de confiança",
    text: "Veja dono validado, reviews, custos transparentes e compatibilidade com rotina estudantil.",
  },
  {
    icon: MessageCircle,
    title: "Fale com mais contexto",
    text: "Chegue no contato já sabendo preço, distância, regras da casa e próximos passos.",
  },
  {
    icon: CalendarCheck,
    title: "Agende visita sem enrolacao",
    text: "A experiência prepara o caminho para visita, contrato e pagamento nos fluxos existentes.",
  },
];

export function HowItWorks() {
  return (
    <section className="uai-section bg-background">
      <div className="uai-container grid gap-6">
        <SectionHeader
          eyebrow="Como funciona"
          subtitle="Uma jornada curta para sair de dúvida para opção real, sem reimplementar regra de negocio no frontend."
          title="Da busca ao contato em quatro passos"
        />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
