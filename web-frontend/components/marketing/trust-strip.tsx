import { HeartHandshake, ReceiptText, ShieldCheck, Star } from "lucide-react";

const differentials = [
  {
    icon: ReceiptText,
    title: "Preço total com contas",
    description: "Você vê aluguel + contas + taxas antes do contato. Sem surpresa.",
  },
  {
    icon: ShieldCheck,
    title: "Donos verificados",
    description: "Identidade e imóvel checados pela UAI para evitar golpe.",
  },
  {
    icon: Star,
    title: "Reviews reais de moradores",
    description: "Só quem morou avalia — com notas de limpeza, barulho e internet.",
  },
  {
    icon: HeartHandshake,
    title: "Match de convivência",
    description: "Rotina, festas, limpeza e pets: veja se a república combina com você.",
  },
] as const;

export function TrustStrip() {
  return (
    <section
      aria-label="Por que confiar no UAI QUARTOS"
      className="border-y border-border bg-surface"
    >
      <div className="uai-container grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {differentials.map((item) => (
          <div
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-3"
            key={item.title}
          >
            <span className="grid h-10 w-10 place-items-center rounded-md bg-brand-soft text-brand">
              <item.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-bold text-foreground">{item.title}</p>
              <p className="mt-0.5 text-sm leading-5 text-muted">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
