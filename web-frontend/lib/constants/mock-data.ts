import type {
  CampusPreview,
  FAQItem,
  FilterShortcut,
  ListingPreview,
  RecentSearch,
  SocialProofItem,
} from "@/lib/types";

export const featuredListings: ListingPreview[] = [
  {
    id: "listing-sagrada-familia",
    title: "Quarto individual em republica perto da PUC Minas",
    campusTags: ["puc-minas", "coracao-eucaristico", "bh"],
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    location: {
      neighborhood: "Coracao Eucaristico",
      city: "Belo Horizonte",
      state: "MG",
      distanceToCampusInMinutes: 8,
    },
    price: { amount: 860, currency: "BRL" },
    roomType: "private",
    capacity: 1,
    availableFrom: "2026-07-01",
    rating: 4.8,
    reviewCount: 31,
    amenities: [
      { id: "wifi", label: "Wi-Fi" },
      { id: "laundry", label: "Lavanderia" },
      { id: "study", label: "Mesa de estudos" },
    ],
    matchHighlights: ["8 min da PUC", "Dono validado", "Mesa de estudos"],
    trustBadges: ["verified_owner", "student_friendly", "contract_ready"],
  },
  {
    id: "listing-savassi",
    title: "Suite compacta em ap compartilhado na Savassi",
    campusTags: ["fumec", "faculdade-santa-casa", "savassi", "bh"],
    imageUrl:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    location: {
      neighborhood: "Savassi",
      city: "Belo Horizonte",
      state: "MG",
      distanceToCampusInMinutes: 14,
    },
    price: { amount: 1180, currency: "BRL" },
    roomType: "suite",
    capacity: 1,
    availableFrom: "2026-07-15",
    rating: 4.9,
    reviewCount: 18,
    amenities: [
      { id: "suite", label: "Suite" },
      { id: "coworking", label: "Coworking perto" },
      { id: "bills", label: "Contas inclusas" },
    ],
    matchHighlights: ["Contas inclusas", "Suite", "Perto de restaurantes"],
    trustBadges: ["verified_owner", "bill_split"],
  },
  {
    id: "listing-ouro-preto",
    title: "Vaga partilhada mobiliada perto da UFMG",
    campusTags: ["ufmg", "pampulha", "ouro-preto", "bh"],
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    location: {
      neighborhood: "Ouro Preto",
      city: "Belo Horizonte",
      state: "MG",
      distanceToCampusInMinutes: 6,
    },
    price: { amount: 620, currency: "BRL" },
    roomType: "shared",
    capacity: 2,
    availableFrom: "2026-08-01",
    rating: 4.7,
    reviewCount: 42,
    amenities: [
      { id: "bike", label: "Bicicletario" },
      { id: "kitchen", label: "Cozinha equipada" },
      { id: "quiet", label: "Ambiente tranquilo" },
    ],
    matchHighlights: ["6 min da UFMG", "Quarto partilhado", "Ambiente silencioso"],
    trustBadges: ["student_friendly", "contract_ready"],
  },
  {
    id: "listing-sao-pedro",
    title: "Quarto mobiliado em casa estudantil no Sao Pedro",
    campusTags: ["puc-praca-liberdade", "sao-pedro", "bh"],
    imageUrl:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    location: {
      neighborhood: "Sao Pedro",
      city: "Belo Horizonte",
      state: "MG",
      distanceToCampusInMinutes: 11,
    },
    price: { amount: 980, currency: "BRL" },
    roomType: "private",
    capacity: 1,
    availableFrom: "2026-07-10",
    rating: 4.8,
    reviewCount: 23,
    amenities: [
      { id: "wifi", label: "Wi-Fi" },
      { id: "bills", label: "Contas inclusas" },
      { id: "study", label: "Mesa de estudos" },
    ],
    matchHighlights: ["Contas inclusas", "Casa estudantil", "Visita rapida"],
    trustBadges: ["verified_owner", "contract_ready", "bill_split"],
  },
  {
    id: "listing-barro-preto",
    title: "Vaga economica em republica proxima ao UniBH",
    campusTags: ["unibh", "barro-preto", "bh"],
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    location: {
      neighborhood: "Barro Preto",
      city: "Belo Horizonte",
      state: "MG",
      distanceToCampusInMinutes: 9,
    },
    price: { amount: 690, currency: "BRL" },
    roomType: "shared",
    capacity: 2,
    availableFrom: "2026-07-20",
    rating: 4.6,
    reviewCount: 37,
    amenities: [
      { id: "wifi", label: "Wi-Fi" },
      { id: "kitchen", label: "Cozinha equipada" },
      { id: "bills", label: "Contas inclusas" },
    ],
    matchHighlights: ["Orcamento leve", "Contas inclusas", "Perto do UniBH"],
    trustBadges: ["student_friendly", "bill_split"],
  },
  {
    id: "listing-santa-efigenia",
    title: "Suite silenciosa para rotina de estudos na Santa Efigenia",
    campusTags: ["faculdade-santa-casa", "santa-efigenia", "bh"],
    imageUrl:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1200&q=80",
    location: {
      neighborhood: "Santa Efigenia",
      city: "Belo Horizonte",
      state: "MG",
      distanceToCampusInMinutes: 7,
    },
    price: { amount: 1120, currency: "BRL" },
    roomType: "suite",
    capacity: 1,
    availableFrom: "2026-08-05",
    rating: 4.9,
    reviewCount: 16,
    amenities: [
      { id: "suite", label: "Suite" },
      { id: "quiet", label: "Ambiente silencioso" },
      { id: "study", label: "Mesa de estudos" },
    ],
    matchHighlights: ["Ambiente silencioso", "Suite", "7 min do campus"],
    trustBadges: ["verified_owner", "student_friendly"],
  },
];

export const trustMetrics = [
  { label: "anuncios com dono validado", value: "92%" },
  { label: "tempo medio ate visita", value: "18h" },
  { label: "contratos com checklist", value: "100%" },
] as const;

export const socialProofItems: SocialProofItem[] = [
  { label: "estudantes usando sinais de confianca", value: "18k+" },
  { label: "reviews revisados pela comunidade", value: "4.8/5" },
  { label: "buscas por campus todos os meses", value: "52k" },
];

export const popularCampuses: CampusPreview[] = [
  {
    city: "Belo Horizonte",
    href: "/buscar?location=PUC+Minas&nearCampus=true",
    id: "puc-minas",
    imageUrl:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80",
    label: "PUC Minas",
    listingCount: 128,
    neighborhoodHint: "Coracao Eucaristico, Padre Eustaquio",
  },
  {
    city: "Belo Horizonte",
    href: "/buscar?location=UFMG&nearCampus=true",
    id: "ufmg",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    label: "UFMG Pampulha",
    listingCount: 96,
    neighborhoodHint: "Ouro Preto, Pampulha, Castelo",
  },
  {
    city: "Belo Horizonte",
    href: "/buscar?location=Savassi&budget=1200",
    id: "savassi",
    imageUrl:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
    label: "Savassi e Centro-Sul",
    listingCount: 74,
    neighborhoodHint: "Savassi, Sao Pedro, Funcionarios",
  },
  {
    city: "Belo Horizonte",
    href: "/buscar?location=UniBH&roomType=shared",
    id: "unibh",
    imageUrl:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
    label: "UniBH",
    listingCount: 61,
    neighborhoodHint: "Barro Preto, Buritis, Estoril",
  },
];

export const filterShortcuts: FilterShortcut[] = [
  {
    description: "Resultados com distancia curta ate a faculdade.",
    href: "/buscar?nearCampus=true",
    id: "near-campus",
    label: "perto do campus",
  },
  {
    description: "Aluguel com previsao de agua, luz ou internet.",
    href: "/buscar?billsIncluded=true",
    id: "bills",
    label: "contas inclusas",
  },
  {
    description: "Vagas para dividir quarto e reduzir custo.",
    href: "/buscar?roomType=shared",
    id: "shared",
    label: "quarto compartilhado",
  },
  {
    description: "Ambientes indicados para foco e rotina de estudos.",
    href: "/buscar?quiet=true",
    id: "quiet",
    label: "ambiente silencioso",
  },
];

export const recentSearches: RecentSearch[] = [
  {
    href: "/buscar?location=PUC+Minas&budget=900",
    id: "recent-puc",
    label: "PUC Minas ate R$ 900",
    meta: "Coracao Eucaristico, individual ou partilhado",
  },
  {
    href: "/buscar?location=UFMG&roomType=shared",
    id: "recent-ufmg",
    label: "UFMG quarto compartilhado",
    meta: "Pampulha, Ouro Preto e Castelo",
  },
  {
    href: "/buscar?location=Savassi&billsIncluded=true",
    id: "recent-savassi",
    label: "Savassi com contas inclusas",
    meta: "Suite ou quarto individual",
  },
];

export const landingFaqs: FAQItem[] = [
  {
    question: "A UAI QUARTOS aluga diretamente os quartos?",
    answer:
      "Nao. A plataforma organiza busca, sinais de confianca e contato. Contratos e pagamentos seguem os fluxos oficiais conectados por adapters.",
  },
  {
    question: "Como sei se um anuncio e confiavel?",
    answer:
      "A interface destaca dono validado, reviews reais, custos transparentes e status de contrato para reduzir duvida antes do contato.",
  },
  {
    question: "Posso buscar por campus ou bairro?",
    answer:
      "Sim. A busca foi desenhada para universidade, campus, cidade e bairro, com filtros de preco, tipo de quarto e data de entrada.",
  },
  {
    question: "Locadores podem anunciar quartos?",
    answer:
      "Sim. O CTA de locadores leva para a area preparada para inventario, verificacao e futuro financeiro B2B.",
  },
];
