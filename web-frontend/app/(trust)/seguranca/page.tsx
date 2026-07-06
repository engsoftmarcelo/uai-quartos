import type { Metadata } from "next";
import { Accessibility, Gauge, LockKeyhole, PackageCheck } from "lucide-react";
import { InlineMessage } from "@/components/ui/inline-message";
import { SectionHeader } from "@/components/ui/section-header";

export const metadata: Metadata = {
  title: "Segurança e confiança",
  description:
    "Convencoes de acessibilidade, performance e arquitetura para o frontend UAI QUARTOS.",
};

const conventions = [
  {
    icon: Accessibility,
    title: "Acessibilidade",
    items: [
      "Foco visível global com :focus-visible.",
      "IconButton exige label acessível.",
      "Campos exibem erro, dica e motivo de disabled por aria-describedby.",
      "Landmarks separados por layouts públicos e áreas logadas.",
    ],
  },
  {
    icon: Gauge,
    title: "Performance",
    items: [
      "next/font no root layout.",
      "next/image em hero e cards de anúncio.",
      "Imagens fora da dobra com lazy loading.",
      "Componentes pesados preparados para dynamic import em mapas, upload e carrossel.",
    ],
  },
  {
    icon: PackageCheck,
    title: "Arquitetura",
    items: [
      "Pages e layouts como Server Components por padrão.",
      "Client Components restritos a estado local, input e interação.",
      "Adapters tipados preservam APIs futuras.",
      "Mocks ficam isolados em lib/constants/mock-data.",
    ],
  },
  {
    icon: LockKeyhole,
    title: "Confiança",
    items: [
      "Tokens semanticamente nomeados para estados de risco.",
      "Mensagens inline para erro, aviso e sucesso.",
      "Estados disabled sempre aceitam explicacao textual.",
      "Contraste alto em CTA, texto e superficies.",
    ],
  },
];

export default function TrustPage() {
  return (
    <section className="uai-section bg-background">
      <div className="uai-container grid gap-8">
        <SectionHeader
          eyebrow="Base de produto confiável"
          subtitle="As convencoes abaixo estão refletidas em tokens, componentes e layouts para manter consistencia conforme o marketplace crescer."
          title="Segurança percebida com engenharia simples"
        />
        <InlineMessage tone="success" title="Sem regra de negocio nova">
          Esta fase entrega fundação visual e estrutural. Fluxos reais de
          identidade, pagamento, KYC e contrato continuam pertencendo aos
          serviços e adapters existentes.
        </InlineMessage>
        <div className="grid gap-4 md:grid-cols-2">
          {conventions.map((section) => {
            const Icon = section.icon;

            return (
              <article
                className="grid gap-4 rounded-md border border-border bg-surface p-5 shadow-xs"
                key={section.title}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-xl font-bold text-foreground">
                    {section.title}
                  </h2>
                </div>
                <ul className="grid gap-2 text-sm leading-6 text-muted">
                  {section.items.map((item) => (
                    <li className="rounded-md bg-surface-muted px-3 py-2" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
