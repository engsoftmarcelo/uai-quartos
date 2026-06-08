import type { Metadata } from "next";
import { CampusGrid } from "@/components/marketing/campus-grid";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { FeaturedListingCarousel } from "@/components/marketing/featured-listing-carousel";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { MobileSearchCta } from "@/components/marketing/mobile-search-cta";
import { SocialProof } from "@/components/marketing/social-proof";
import { TrustSection } from "@/components/marketing/trust-section";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { featuredListings, siteConfig } from "@/lib/constants";

export function generateMetadata(): Metadata {
  return {
    title: "Moradia universitaria perto da faculdade",
    description:
      "Encontre republicas e quartos partilhados por campus, bairro, orcamento e sinais de confianca no UAI QUARTOS.",
    alternates: {
      canonical: "/",
    },
    keywords: [
      "moradia universitaria",
      "republica estudantil",
      "quarto compartilhado",
      "quarto perto da faculdade",
      "aluguel para estudantes",
    ],
    openGraph: {
      title: "UAI QUARTOS | Moradia universitaria perto da faculdade",
      description:
        "Busque por campus, compare preco e veja sinais de confianca antes de chamar no contato.",
      url: "/",
      type: "website",
    },
  };
}

export default function MarketingHomePage() {
  return (
    <>
      <HomeStructuredData />
      <Hero />
      <SocialProof />
      <TrustStrip />
      <FeaturedListingCarousel listings={featuredListings.slice(0, 6)} />
      <HowItWorks />
      <TrustSection />
      <CampusGrid />
      <FAQAccordion />
      <MobileSearchCta />
    </>
  );
}

function HomeStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    potentialAction: {
      "@type": "SearchAction",
      query: "required name=search_term_string",
      target: "/buscar?location={search_term_string}",
    },
    url: "/",
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}
