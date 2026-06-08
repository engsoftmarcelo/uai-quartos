import { HelpCircle } from "lucide-react";
import type { ListingDetail } from "@/lib/types";

export function FAQSection({ faq }: { faq: ListingDetail["faq"] }) {
  return (
    <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
      <div className="grid gap-1">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-brand">
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          perguntas frequentes
        </p>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Antes de chamar no contato
        </h2>
      </div>

      <div className="grid gap-2">
        {faq.map((item) => (
          <details
            className="group rounded-md border border-border bg-surface-raised p-3"
            key={item.question}
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
              {item.question}
              <span className="text-brand transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-6 text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
