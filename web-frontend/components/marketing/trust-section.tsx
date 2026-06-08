import { BadgeCheck, Headphones, ReceiptText, Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const pillars = [
  {
    icon: BadgeCheck,
    title: "Anuncios verificados",
    text: "Status visivel para dono validado, checklist de contrato e sinais de perfil estudantil.",
  },
  {
    icon: ReceiptText,
    title: "Custos transparentes",
    text: "Preco, contas inclusas e previsoes aparecem antes do contato para reduzir surpresa.",
  },
  {
    icon: Headphones,
    title: "Suporte rapido",
    text: "Mensagens e estados de erro foram desenhados para orientar o proximo passo sem friccao.",
  },
  {
    icon: Star,
    title: "Reviews reais",
    text: "A interface privilegia avaliacao, contexto da rotina e comentarios de quem ja visitou.",
  },
];

export function TrustSection() {
  return (
    <section className="uai-section bg-foreground text-white">
      <div className="uai-container grid gap-6">
        <SectionHeader
          eyebrow="Confianca sem teatro"
          subtitle="O estudante precisa decidir rapido, mas sem sentir que esta assumindo risco escondido."
          title="Sinais que ajudam antes de chamar no contato"
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;

            return (
              <article
                className="grid gap-3 rounded-md border border-white/12 bg-white/8 p-5"
                key={pillar.title}
              >
                <span className="grid h-11 w-11 place-items-center rounded-md bg-white text-brand">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  {pillar.title}
                </h3>
                <p className="text-sm leading-6 text-white/72">{pillar.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
