import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { popularCampuses } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";

export function CampusGrid() {
  return (
    <section className="uai-section bg-surface">
      <div className="uai-container grid gap-6">
        <SectionHeader
          eyebrow="Busca por campus"
          subtitle="Comece por onde sua rotina acontece: faculdade, bairro e tempo de deslocamento."
          title="Universidades e regiões populares"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularCampuses.map((campus) => (
            <Link
              className="group overflow-hidden rounded-md border border-border bg-surface shadow-xs transition hover:-translate-y-0.5 hover:shadow-sm"
              href={campus.href}
              key={campus.id}
            >
              <div className="relative aspect-[4/3] bg-surface-muted">
                <Image
                  alt={`Moradias perto de ${campus.label}`}
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  src={campus.imageUrl}
                />
              </div>
              <div className="grid gap-3 p-4">
                <div>
                  <p className="inline-flex items-center gap-1 text-sm font-bold text-brand">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {campus.city}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                    {campus.label}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {campus.neighborhoodHint}
                  </p>
                </div>
                <p className="inline-flex items-center gap-2 text-sm font-bold text-muted-strong">
                  {campus.listingCount} opções
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
