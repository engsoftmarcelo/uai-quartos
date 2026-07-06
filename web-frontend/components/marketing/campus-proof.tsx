import { MessageCircle, Route, ShieldCheck } from "lucide-react";
import { ReviewSnippet } from "@/components/ui/review-snippet";
import { SectionHeader } from "@/components/ui/section-header";

const signals = [
  {
    icon: Route,
    title: "Rotas e bairro antes do contato",
    text: "A interface reserva espaço para campus, tempo de deslocamento e filtros cartograficos sem amarrar regra de negocio no frontend.",
  },
  {
    icon: ShieldCheck,
    title: "Confiança visível em cada fluxo",
    text: "Estados de verificação, foco acessível e mensagens inline deixam risco, status e próximo passo claros.",
  },
  {
    icon: MessageCircle,
    title: "Preparado para eventos",
    text: "Componentes pequenos permitem evoluir mensageria, notificações e async UI por adapters tipados.",
  },
];

export function CampusProof() {
  return (
    <section className="uai-section bg-background">
      <div className="uai-container grid gap-8">
        <SectionHeader
          eyebrow="Produto grande, base simples"
          subtitle="A fundação separa componentes reutilizáveis, adapters e tipos para crescer sem duplicar UI ou espalhar regra de negocio."
          title="Feito para a rotina real de quem divide casa"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {signals.map((signal) => {
            const Icon = signal.icon;

            return (
              <article
                className="grid gap-3 rounded-md border border-border bg-surface p-5 shadow-xs"
                key={signal.title}
              >
                <span className="grid h-10 w-10 place-items-center rounded-md bg-signal-soft text-signal">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {signal.title}
                </h3>
                <p className="text-sm leading-6 text-muted">{signal.text}</p>
              </article>
            );
          })}
        </div>
        <ReviewSnippet
          author="Marina, estudante de Eng. Civil"
          quote="Eu queria comparar preço, bairro e confiança sem abrir dez abas. O fluxo deixa o que importa bem na minha frente."
          rating={5}
        />
      </div>
    </section>
  );
}
