import { HelpCircle } from "lucide-react";
import { landingFaqs } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";

export function FAQAccordion() {
  return (
    <section className="uai-section bg-background">
      <div className="uai-container grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <SectionHeader
          eyebrow="FAQ"
          subtitle="Respostas curtas para tirar a dúvida principal antes do usuário buscar."
          title="Perguntas frequentes"
        />
        <div className="grid gap-3">
          {landingFaqs.map((faq) => (
            <details
              className="group rounded-md border border-border bg-surface p-4 shadow-xs"
              key={faq.question}
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-left font-display text-lg font-bold text-foreground [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-start gap-2">
                  <HelpCircle
                    className="mt-1 h-4 w-4 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                  {faq.question}
                </span>
                <span className="text-brand transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
