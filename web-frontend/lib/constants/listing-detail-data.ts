import { listingSearchResults } from "./results-data";
import type { ListingDetail, ListingSearchResult } from "@/lib/types";

const extraImages = [
  "https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1560440021-33f9b867899d?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1400&q=82",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=82",
] as const;

const detailOverrides: Record<
  string,
  Pick<ListingDetail, "description" | "idealFor" | "summary">
> = {
  "quarto-individual-republica-puc-coracao-eucaristico": {
    description:
      "Quarto individual em república organizada no Coração Eucarístico, com rotina tranquila durante a semana e combinados claros para visitas. A casa fica em uma rua residencial com acesso rápido ao campus e mercados.",
    idealFor: [
      "Você quer privacidade sem morar sozinho.",
      "Você precisa estar perto da PUC Minas.",
      "Você prefere uma casa com rotina de estudos e regras claras.",
    ],
    summary:
      "Individual mobiliado, 8 min da PUC, casa mista e perfil forte para estudos.",
  },
  "vaga-compartilhada-ufmg-ouro-preto": {
    description:
      "Vaga compartilhada mobiliada no Ouro Preto, pensada para custo baixo e deslocamento rápido até a UFMG. A convivência e silenciosa, com combinados para limpeza, cozinha e horários de estudo.",
    idealFor: [
      "Você quer reduzir custo total mensal.",
      "Você estuda na UFMG Pampulha.",
      "Você aceita quarto compartilhado com rotina silenciosa.",
    ],
    summary:
      "Vaga compartilhada, contas inclusas e 6 min da UFMG Pampulha.",
  },
  "suite-compacta-contas-inclusas-savassi": {
    description:
      "Suíte compacta em apartamento compartilhado na Savassi, com contas inclusas e boa estrutura para quem quer praticidade urbana. A casa tem perfil social moderado e aceita pets combinados.",
    idealFor: [
      "Você valoriza localização central.",
      "Você quer suíte e custo mensal previsível.",
      "Você gosta de uma casa social, mas sem bagunca.",
    ],
    summary:
      "Suíte com contas inclusas na Savassi, ideal para rotina urbana.",
  },
  "quarto-casa-estudantil-sao-pedro-praca-liberdade": {
    description:
      "Quarto em casa estudantil feminina no São Pedro, perto da Praca da Liberdade. Ambiente organizado, visitas combinadas e foco em rotina de aulas, estágio e estudos.",
    idealFor: [
      "Você procura casa feminina.",
      "Você quer bairro central com clima residencial.",
      "Você prefere visitas combinadas e rotina previsível.",
    ],
    summary:
      "Casa feminina, quarto mobiliado e 11 min da PUC Praca da Liberdade.",
  },
  "vaga-economica-unibh-barro-preto": {
    description:
      "Vaga economica em república masculina no Barro Preto, indicada para quem prioriza custo baixo e acesso rápido ao UniBH. A casa e mais movimentada e tem regras diretas para visitas e fumantes.",
    idealFor: [
      "Você precisa economizar no primeiro mês.",
      "Você quer contas inclusas.",
      "Você se adapta bem a uma casa mais movimentada.",
    ],
    summary:
      "Vaga economica com contas inclusas e custo inicial baixo.",
  },
  "suite-silenciosa-santa-efigenia": {
    description:
      "Suíte silenciosa na Santa Efigenia para quem precisa de foco e privacidade. A casa tem reviews fortes, combinados de ruido e perfil de convivência voltado a estudos.",
    idealFor: [
      "Você precisa de silêncio para estudar.",
      "Você quer banheiro privativo.",
      "Você prefere convivência discreta e reviews fortes.",
    ],
    summary:
      "Suíte silenciosa, 7 min do campus e convivência focada em estudos.",
  },
};

export const listingDetails: ListingDetail[] = listingSearchResults.map(
  (result, index) => createDetail(result, index),
);

export function getListingDetailBySlug(slug: string) {
  return listingDetails.find((listing) => listing.slug === slug);
}

function createDetail(result: ListingSearchResult, index: number): ListingDetail {
  const override = detailOverrides[result.slug];
  const isSuite = result.room.type === "suite";
  const isShared = result.room.type === "shared";

  return {
    amenities: [
      result.room.furnished ? "Quarto mobiliado" : "Espaço para mobília própria",
      result.pricing.billsIncluded ? "Contas inclusas" : "Contas detalhadas antes do contato",
      "Wi-Fi",
      "Cozinha compartilhada",
      "Lavanderia",
      result.rules.studyFriendly ? "Área de estudos" : "Sala compartilhada",
    ],
    availability: {
      availableFrom: result.availability.availableFrom,
      minStayMonths: result.availability.minStayMonths,
      visitWindows: ["Segunda a sexta, 18h-21h", "Sabado, 10h-14h"],
    },
    campus: {
      coordinates: {
        lat: result.location.coordinates.lat + 0.008,
        lng: result.location.coordinates.lng - 0.006,
      },
      distanceKm: Number((result.location.commuteMinutes * 0.35).toFixed(1)),
      label: result.location.campusLabel,
    },
    description: override.description,
    faq: [
      {
        question: "O valor mensal pode mudar?",
        answer:
          "Os valores exibidos são estimativas do anúncio. Antes de reservar, o fluxo deve confirmar contrato, contas e taxas pelo adapter oficial.",
      },
      {
        question: "Posso visitar antes de reservar?",
        answer:
          "Sim. O card de disponibilidade mostra janelas de visita e o contato permite combinar horário com o locador.",
      },
      {
        question: "Como funciona a verificação?",
        answer:
          "A página exibe sinais de verificação do locador e do anúncio. A validação real continua nos serviços existentes.",
      },
    ],
    host: {
      avatarUrl: undefined,
      bio:
        "Locador com histórico de atendimento a estudantes, comunicação objetiva e anúncios revisados pela plataforma.",
      id: `host-${result.id}`,
      name: index % 2 === 0 ? "Marcos Andrade" : "Ana Paula Martins",
      responseTimeLabel: result.responseTimeLabel,
      sinceLabel: "na plataforma desde 2024",
      verification: [
        "Documento validado",
        "Telefone confirmado",
        "Histórico de respostas acompanhado",
      ],
    },
    houseRules: {
      ...result.rules,
      policySummary: [
        result.rules.noise === "quiet"
          ? "Silêncio combinado depois das 22h"
          : "Ruido moderado com combinados",
        result.rules.guests === "not_allowed"
          ? "Hospedes não permitidos"
          : "Hospedes com aviso previo",
        result.rules.smoker === "not_allowed"
          ? "Não fumante"
          : "Fumante apenas em área combinada",
      ],
    },
    idealFor: override.idealFor,
    location: {
      addressHint: `${result.location.neighborhood}, ${result.location.city}`,
      city: result.location.city,
      commuteMinutes: result.location.commuteMinutes,
      coordinates: result.location.coordinates,
      neighborhood: result.location.neighborhood,
      state: result.location.state,
    },
    media: [
      {
        alt: result.title,
        category: "Fachada",
        id: `${result.id}-cover`,
        src: result.imageUrl,
        type: "image",
      },
      {
        alt: "Vista do quarto e área de estudos",
        category: "Quarto",
        id: `${result.id}-room`,
        src: extraImages[index % extraImages.length],
        type: "image",
      },
      {
        alt: "Área compartilhada da república",
        category: "Áreas comuns",
        id: `${result.id}-shared`,
        src: extraImages[(index + 1) % extraImages.length],
        type: "image",
      },
      {
        alt: "Tour virtual do anúncio",
        category: "Tour",
        id: `${result.id}-tour`,
        posterUrl: extraImages[(index + 2) % extraImages.length],
        src: `/anuncio/${result.slug}#tour`,
        type: "tour",
      },
    ],
    pricing: {
      dueToday: result.pricing.dueToday,
      included: result.pricing.billsIncluded
        ? ["Internet", "Água", "Energia estimada"]
        : ["Internet"],
      lines: [
        {
          amount: {
            amount: result.pricing.totalMonthly.amount - (result.pricing.billsIncluded ? 0 : 140),
            currency: "BRL",
          },
          description: "Valor base informado pelo locador.",
          id: "rent",
          label: "Aluguel",
        },
        {
          amount: {
            amount: result.pricing.billsIncluded ? 0 : 140,
            currency: "BRL",
          },
          description: result.pricing.billsIncluded
            ? "Contas inclusas no total mensal."
            : "Estimativa de contas recorrentes.",
          id: "bills",
          label: "Contas",
        },
        {
          amount: result.pricing.deposit,
          description: "Caução/depósito para entrada.",
          id: "deposit",
          label: "Caução",
        },
        {
          amount: { amount: 0, currency: "BRL" },
          description: "Taxas exibidas antes da candidatura.",
          id: "fees",
          label: "Taxas",
        },
      ],
      monthlyTotal: result.pricing.totalMonthly,
    },
    rating: result.rating,
    reviews: [
      {
        author: "Laura M.",
        dateLabel: "Mar 2026",
        id: `${result.id}-review-1`,
        quote:
          "O anúncio bateu com a visita. O ponto mais útil foi ver custo, regras e tempo até o campus antes de chamar.",
        rating: 5,
        stayContext: "visitou e comparou com outras repúblicas",
        tags: ["preço honesto", "perto do campus"],
      },
      {
        author: "Rafael S.",
        dateLabel: "Fev 2026",
        id: `${result.id}-review-2`,
        quote:
          "A casa tinha combinados claros e resposta rápida. Deu para decidir sem ficar perdido no chat.",
        rating: result.rating >= 4.8 ? 5 : 4,
        stayContext: "morou por 1 semestre",
        tags: ["dono presente", "regras claras"],
      },
      {
        author: "Bianca T.",
        dateLabel: "Nov 2025",
        id: `${result.id}-review-3`,
        quote:
          result.rules.noise === "quiet"
            ? "Consegui estudar para as provas sem estresse. Internet estável e casa silenciosa durante a semana."
            : "Casa com energia boa e gente parecida comigo. Internet estável e áreas comuns bem cuidadas.",
        rating: 5,
        stayContext: "morou por 12 meses",
        tags:
          result.rules.noise === "quiet"
            ? ["silenciosa", "internet boa"]
            : ["internet boa", "áreas comuns boas"],
      },
    ],
    reviewCount: result.reviewCount,
    room: {
      areaM2: isShared ? 14 : isSuite ? 12 : 10,
      bedLabel: isShared ? "bicama ou beliche" : "cama solteiro",
      furnished: result.room.furnished,
      privateBathroom: isSuite,
      type: result.room.type,
      windowLabel: "janela com luz natural",
    },
    roommateProfile: {
      ...result.roommateProfile,
      routine:
        result.rules.noise === "quiet"
          ? "rotina de estudos, horários previsíveis e pouco barulho a noite"
          : "rotina equilibrada entre aulas, estágio e social moderado",
    },
    slug: result.slug,
    summary: override.summary,
    title: result.title,
    trustBadges: result.trustBadges,
    verification: {
      landlord: ["Documento validado", "Telefone confirmado", "Conta monitorada"],
      listing: ["Fotos revisadas", "Custos declarados", "Endereço aproximado validado"],
    },
  };
}
