import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AvailabilityCard } from "@/components/listing-detail/availability-card";
import { CompatibilityProfileCard } from "@/components/listing-detail/compatibility-profile-card";
import { FAQSection } from "@/components/listing-detail/faq-section";
import { HostTrustCard } from "@/components/listing-detail/host-trust-card";
import { HouseRulesCard } from "@/components/listing-detail/house-rules-card";
import { ListingGallery } from "@/components/listing-detail/listing-gallery";
import { ListingQuickFacts } from "@/components/listing-detail/listing-quick-facts";
import { NeighborhoodAndCampusCard } from "@/components/listing-detail/neighborhood-and-campus-card";
import { ReviewsSection } from "@/components/listing-detail/reviews-section";
import { StickyDecisionBar } from "@/components/listing-detail/sticky-decision-bar";
import { TransparentPricingCard } from "@/components/listing-detail/transparent-pricing-card";
import { Badge } from "@/components/ui/badge";
import { createListingDetailAdapter } from "@/lib/adapters";
import { formatCurrency } from "@/lib/formatters";
import type { ListingDetail } from "@/lib/types";

interface ListingPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const adapter = createListingDetailAdapter();
  const slugs = await adapter.listSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ListingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const adapter = createListingDetailAdapter();
  const listing = await adapter.getBySlug(slug);

  if (!listing) {
    return {
      title: "Anúncio não encontrado",
    };
  }

  return {
    title: `${listing.title} em ${listing.location.neighborhood}`,
    description: `${listing.summary} Custo mensal estimado de ${formatCurrency(
      listing.pricing.monthlyTotal.amount,
    )}, ${listing.location.commuteMinutes} min até ${listing.campus.label}.`,
    alternates: {
      canonical: `/anuncio/${listing.slug}`,
    },
    openGraph: {
      title: `${listing.title} | UAI QUARTOS`,
      description: listing.summary,
      images: [
        {
          alt: listing.title,
          url: listing.media[0]?.src ?? "",
        },
      ],
      type: "website",
      url: `/anuncio/${listing.slug}`,
    },
  };
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const { slug } = await params;
  const adapter = createListingDetailAdapter();
  const listing = await adapter.getBySlug(slug);

  if (!listing) {
    notFound();
  }

  return (
    <div className="bg-background pb-28 pt-5 lg:pb-8">
      <ListingStructuredData listing={listing} />
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
          <div className="grid gap-5">
            <section className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] lg:items-start">
              <ListingGallery media={listing.media} />
              <ListingQuickFacts listing={listing} />
            </section>

            <section className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
              <div className="grid gap-2">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand">
                  descrição
                </p>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  O que você precisa saber
                </h2>
                <p className="text-pretty text-sm leading-6 text-muted">
                  {listing.description}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailBlock
                  label="Caracteristicas do quarto"
                  values={[
                    `${listing.room.areaM2} m2`,
                    listing.room.bedLabel,
                    listing.room.furnished ? "mobiliado" : "sem mobília",
                    listing.room.privateBathroom
                      ? "banheiro privativo"
                      : "banheiro compartilhado",
                    listing.room.windowLabel,
                  ]}
                />
                <DetailBlock label="Amenidades" values={listing.amenities} />
              </div>
            </section>

            <TransparentPricingCard pricing={listing.pricing} />
            <CompatibilityProfileCard listing={listing} />
            <HouseRulesCard rules={listing.houseRules} />
            <NeighborhoodAndCampusCard listing={listing} />
            <AvailabilityCard availability={listing.availability} />
            <HostTrustCard listing={listing} />
            <ReviewsSection listing={listing} />
            <FAQSection faq={listing.faq} />
          </div>

          <StickyDecisionBar listing={listing} variant="sidebar" />
        </div>
      </div>
      <StickyDecisionBar listing={listing} variant="mobile" />
    </div>
  );
}

function DetailBlock({
  label,
  values,
}: {
  label: string;
  values: string[];
}) {
  return (
    <div className="grid gap-3 rounded-md bg-surface-muted p-3">
      <h3 className="text-sm font-bold text-muted-strong">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <Badge key={value}>{value}</Badge>
        ))}
      </div>
    </div>
  );
}

function ListingStructuredData({ listing }: { listing: ListingDetail }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    itemOffered: {
      "@type": "Accommodation",
      address: `${listing.location.neighborhood}, ${listing.location.city}`,
      name: listing.title,
    },
    price: listing.pricing.monthlyTotal.amount,
    priceCurrency: "BRL",
    url: `/anuncio/${listing.slug}`,
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}
