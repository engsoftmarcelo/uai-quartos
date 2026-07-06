import { Quote } from "lucide-react";
import { socialProofItems } from "@/lib/constants";

export function SocialProof() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="uai-container grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
        <dl className="grid gap-3 sm:grid-cols-3">
          {socialProofItems.map((item) => (
            <div className="rounded-md bg-surface-muted p-4" key={item.label}>
              <dt className="text-sm leading-5 text-muted">{item.label}</dt>
              <dd className="mt-2 font-display text-3xl font-bold text-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
        <figure className="grid gap-3 rounded-md border border-border bg-background p-4 shadow-xs">
          <Quote className="h-5 w-5 text-brand" aria-hidden="true" />
          <blockquote className="text-pretty text-sm leading-6 text-muted-strong">
            Achei um quarto perto da faculdade sem ficar perguntando mil coisas
            no WhatsApp. O preço, a distância e os sinais de confiança já
            estavam claros.
          </blockquote>
          <figcaption className="text-sm font-bold text-foreground">
            Bia, estudante de Arquitetura
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
