import { Search, SlidersHorizontal } from "lucide-react";
import { ListingCard } from "@/components/listing/listing-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SectionHeader } from "@/components/ui/section-header";
import { featuredListings } from "@/lib/constants";

export function SearchShell() {
  return (
    <section className="uai-section bg-background">
      <div className="uai-container grid gap-6">
        <SectionHeader
          action={
            <Button
              leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              variant="secondary"
            >
              Filtros
            </Button>
          }
          eyebrow="Busca mobile-first"
          subtitle="Mocks tipados e isolados sustentam a UI enquanto os adapters conectam as APIs existentes."
          title="Compare quartos por preço, localização e sinais de confiança"
        />

        <form
          className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs lg:grid-cols-[1.5fr_1fr_1fr_auto]"
          role="search"
        >
          <Input
            label="Campus ou bairro"
            leadingIcon={<Search className="h-4 w-4" aria-hidden="true" />}
            name="campus"
            placeholder="PUC Minas, UFMG, Savassi"
          />
          <Select
            label="Tipo de quarto"
            name="roomType"
            options={[
              { label: "Individual", value: "private" },
              { label: "Partilhado", value: "shared" },
              { label: "Suíte", value: "suite" },
            ]}
            placeholder="Todos"
          />
          <Input
            inputMode="numeric"
            label="Preço máximo"
            name="maxPrice"
            placeholder="R$ 1.200"
          />
          <div className="grid content-end">
            <Button leftIcon={<Search className="h-4 w-4" />} type="submit">
              Buscar
            </Button>
          </div>
          <div className="lg:col-span-4">
            <Checkbox
              description="Mostra primeiro anúncios com dono validado e checklist de contrato."
              label="Priorizar anúncios verificados"
              name="onlyVerified"
            />
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
