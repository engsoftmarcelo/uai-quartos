import Image from "next/image";
import Link from "next/link";
import { Building2, ShieldCheck } from "lucide-react";
import { HeroSearchForm } from "./hero-search-form";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-foreground text-white">
      <Image
        alt="Quarto universitário autentico com cama, mesa de estudos e luz natural"
        className="absolute inset-0 -z-20 object-cover"
        fill
        priority
        sizes="100vw"
        src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1800&q=85"
      />
      <div className="absolute inset-0 -z-10 bg-foreground/64" />
      <div className="uai-container grid min-h-[86svh] content-end gap-6 pb-8 pt-24 sm:pb-12">
        <div className="grid max-w-3xl gap-4">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-accent">
            Repúblicas e quartos partilhados
          </p>
          <h1 className="font-display text-4xl font-bold text-balance sm:text-6xl lg:text-7xl">
            Ache moradia perto da faculdade.
          </h1>
          <p className="max-w-2xl text-pretty text-lg leading-8 text-white/88">
            Busque por campus, bairro ou cidade e compare preço, distância,
            tipo de quarto e sinais de confiança antes de chamar no contato.
          </p>
        </div>

        <div className="grid gap-3" id="busca-principal">
          <HeroSearchForm />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/35 bg-white/12 px-4 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              href="/landlord"
            >
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Anunciar um quarto
            </Link>
            <p className="inline-flex items-center gap-2 text-sm font-bold text-white/82">
              <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
              Anúncios verificados, custos claros e reviews reais.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {["PUC Minas", "UFMG", "Savassi", "contas inclusas"].map((chip) => (
            <Link
              className="inline-flex h-9 items-center rounded-md border border-white/20 bg-white/10 px-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              href={`/buscar?location=${encodeURIComponent(chip)}`}
              key={chip}
            >
              {chip}
            </Link>
          ))}
        </div>

        <dl className="grid gap-3 pb-2 sm:grid-cols-3">
          {[
            ["Orçamento", "filtro claro antes do contato"],
            ["Campus", "bairro e tempo de deslocamento"],
            ["Compatibilidade", "rotina, casa e reviews"],
          ].map(([label, value]) => (
            <div
              className="rounded-md border border-white/20 bg-white/12 p-3 backdrop-blur"
              key={label}
            >
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">
                {label}
              </dt>
              <dd className="mt-1 text-sm font-bold text-white">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
