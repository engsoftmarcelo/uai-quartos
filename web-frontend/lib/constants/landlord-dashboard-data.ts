import type {
  LandlordApplicant,
  LandlordCalendarSlot,
  LandlordDashboardOverview,
  LandlordKPI,
  LandlordLead,
  LandlordListing,
  LandlordListingDraft,
  LandlordProfile,
  LandlordReview,
  LandlordTask,
} from "@/lib/types";

export const landlordProfile: LandlordProfile = {
  averageResponseMinutes: 38,
  documentsVerified: true,
  email: "marcos.andrade@uaiquartos.com",
  id: "landlord-marcos",
  name: "Marcos Andrade",
  phone: "+55 31 98888-2200",
  reputationScore: 4.8,
  verificationStatus: "verified",
};

export const landlordListings: LandlordListing[] = [
  {
    activeLeads: 12,
    addressLabel: "Coração Eucarístico, Belo Horizonte",
    availableFromLabel: "15 Jul 2026",
    completionScore: 92,
    id: "listing-puc-coracao",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    lastUpdatedLabel: "atualizado ha 2h",
    minimumStayMonths: 6,
    monthlyTotal: { amount: 860, currency: "BRL" },
    occupancyLabel: "2 de 3 quartos ocupados",
    qualityIssues: ["Adicionar vídeo curto do quarto"],
    responseRate: 96,
    roomsAvailable: 1,
    status: "active",
    title: "República verificada perto da PUC",
    viewsLast30Days: 1280,
  },
  {
    activeLeads: 7,
    addressLabel: "Ouro Preto, Belo Horizonte",
    availableFromLabel: "01 Ago 2026",
    completionScore: 84,
    id: "listing-ufmg-ouro",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    lastUpdatedLabel: "atualizado ontem",
    minimumStayMonths: 4,
    monthlyTotal: { amount: 690, currency: "BRL" },
    occupancyLabel: "1 vaga compartilhada livre",
    qualityIssues: ["Detalhar regras de visitas", "Confirmar contas inclusas"],
    responseRate: 88,
    roomsAvailable: 1,
    status: "active",
    title: "Vaga compartilhada perto da UFMG",
    viewsLast30Days: 910,
  },
  {
    activeLeads: 2,
    addressLabel: "Savassi, Belo Horizonte",
    availableFromLabel: "Pausado",
    completionScore: 68,
    id: "listing-savassi-suite",
    imageUrl:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    lastUpdatedLabel: "atualizado ha 12 dias",
    minimumStayMonths: 3,
    monthlyTotal: { amount: 1240, currency: "BRL" },
    occupancyLabel: "sem disponibilidade pública",
    qualityIssues: ["Completar documentação", "Atualizar disponibilidade"],
    responseRate: 72,
    roomsAvailable: 0,
    status: "paused",
    title: "Suíte compacta com contas inclusas",
    viewsLast30Days: 310,
  },
];

export const landlordKpis: LandlordKPI[] = [
  {
    description: "Inventário publicado com disponibilidade visível.",
    id: "active-listings",
    label: "Anúncios ativos",
    trendLabel: "+2 este mês",
    value: "2",
  },
  {
    description: "Leads ainda sem resposta ou aguardando próximo passo.",
    id: "new-leads",
    label: "Leads novos",
    trendLabel: "5 hoje",
    value: "19",
  },
  {
    description: "Média de conversas respondidas dentro do SLA operacional.",
    id: "response-rate",
    label: "Taxa de resposta",
    trendLabel: "38 min média",
    value: "93%",
  },
  {
    description: "Quartos ocupados ou com candidatura em etapa avancada.",
    id: "occupancy",
    label: "Ocupação",
    trendLabel: "1 vaga livre",
    value: "78%",
  },
];

export const landlordTasks: LandlordTask[] = [
  {
    description: "A vaga da UFMG precisa confirmar se contas estão inclusas.",
    href: "/landlord/anuncios/listing-ufmg-ouro/editar",
    id: "task-bills",
    label: "Revisar custos transparentes",
    severity: "critical",
  },
  {
    description: "Três leads novos aguardam resposta ha mais de 30 minutos.",
    href: "/landlord/leads",
    id: "task-leads",
    label: "Responder leads novos",
    severity: "warning",
  },
  {
    description: "Adicionar vídeo curto aumenta confiança acima da dobra.",
    href: "/landlord/anuncios/listing-puc-coracao/editar",
    id: "task-media",
    label: "Melhorar mídia do anúncio",
    severity: "info",
  },
];

export const landlordLeads: LandlordLead[] = [
  {
    budgetLabel: "até R$ 1.100/mês",
    connectedListingId: "listing-puc-coracao",
    id: "lead-marina",
    interactions: [
      { id: "i1", label: "Mensagem recebida", timestampLabel: "ha 12 min" },
      { id: "i2", label: "Match acima de 90%", timestampLabel: "hoje" },
    ],
    lastInteractionLabel: "ha 12 min",
    matchScore: 94,
    messagePreview: "Tenho interesse e posso visitar esta semana.",
    name: "Marina Alves",
    stage: "new",
    unread: true,
    visitTimeLabel: "sugeriu amanha 18h30",
  },
  {
    budgetLabel: "até R$ 800/mês",
    connectedListingId: "listing-ufmg-ouro",
    id: "lead-lucas",
    interactions: [
      { id: "i3", label: "Resposta enviada", timestampLabel: "ontem" },
      { id: "i4", label: "Visita sugerida", timestampLabel: "hoje" },
    ],
    lastInteractionLabel: "ha 1h",
    matchScore: 88,
    messagePreview: "Pode confirmar a disponibilidade para agosto?",
    name: "Lucas Ferreira",
    stage: "contacted",
    unread: false,
  },
  {
    budgetLabel: "até R$ 1.300/mês",
    connectedListingId: "listing-savassi-suite",
    id: "lead-beatriz",
    interactions: [
      { id: "i5", label: "Documentos recebidos", timestampLabel: "06 Jun" },
      { id: "i6", label: "Proposta enviada", timestampLabel: "07 Jun" },
    ],
    lastInteractionLabel: "ontem",
    matchScore: 91,
    messagePreview: "Enviei os documentos para avaliação.",
    name: "Beatriz Costa",
    stage: "proposal",
    unread: false,
  },
];

export const landlordApplicants: LandlordApplicant[] = [
  {
    connectedListingId: "listing-puc-coracao",
    documentsPending: ["Comprovante estudantil"],
    id: "app-marina",
    lastActionLabel: "candidatura enviada ha 2 dias",
    matchScore: 94,
    name: "Marina Alves",
    nextAction: "Confirmar visita e solicitar documento pendente",
    stage: "documents",
  },
  {
    connectedListingId: "listing-ufmg-ouro",
    documentsPending: [],
    id: "app-lucas",
    lastActionLabel: "visita marcada para 10 Jun",
    matchScore: 88,
    name: "Lucas Ferreira",
    nextAction: "Confirmar presença na visita",
    stage: "visit",
  },
  {
    connectedListingId: "listing-savassi-suite",
    documentsPending: ["Contrato revisado"],
    id: "app-beatriz",
    lastActionLabel: "proposta em decisao",
    matchScore: 91,
    name: "Beatriz Costa",
    nextAction: "Aguardar aceite da proposta",
    stage: "decision",
  },
];

export const landlordCalendar: LandlordCalendarSlot[] = [
  {
    dateLabel: "09 Jun",
    id: "cal-1",
    listingId: "listing-puc-coracao",
    note: "Visita Marina 18h30",
    status: "visit",
  },
  {
    dateLabel: "10 Jun",
    id: "cal-2",
    listingId: "listing-ufmg-ouro",
    note: "Visita Lucas 16h",
    status: "visit",
  },
  {
    dateLabel: "12 Jun",
    id: "cal-3",
    listingId: "listing-savassi-suite",
    note: "Bloqueado para manutenção",
    status: "blocked",
  },
  {
    dateLabel: "15 Jul",
    id: "cal-4",
    listingId: "listing-puc-coracao",
    note: "Disponível para entrada",
    status: "available",
  },
  {
    dateLabel: "01 Ago",
    id: "cal-5",
    listingId: "listing-ufmg-ouro",
    note: "Disponibilidade prevista",
    status: "available",
  },
  {
    dateLabel: "03 Ago",
    id: "cal-6",
    listingId: "listing-ufmg-ouro",
    note: "Conflito com duração mínima",
    status: "conflict",
  },
];

export const landlordPerformance = [
  { applications: 12, contacts: 38, conversionRate: 0.31, label: "Mar", views: 980 },
  { applications: 14, contacts: 42, conversionRate: 0.33, label: "Abr", views: 1120 },
  { applications: 19, contacts: 55, conversionRate: 0.35, label: "Mai", views: 1360 },
  { applications: 16, contacts: 47, conversionRate: 0.34, label: "Jun", views: 1280 },
];

export const landlordReviews: LandlordReview[] = [
  {
    authorName: "Julia Martins",
    body: "Casa organizada, custos claros e resposta rápida antes da visita.",
    id: "review-1",
    listingTitle: "República verificada perto da PUC",
    rating: 5,
    receivedAtLabel: "ha 4 dias",
  },
  {
    authorName: "Rafael Souza",
    body: "Anúncio bem fiel as fotos. Poderia detalhar melhor regras de visita.",
    id: "review-2",
    listingTitle: "Vaga compartilhada perto da UFMG",
    rating: 4,
    receivedAtLabel: "ha 1 semana",
  },
];

export const landlordListingDraft: LandlordListingDraft = {
  availabilityLabel: "15 Jul 2026",
  billsIncluded: true,
  depositAmount: 600,
  description:
    "Quarto mobiliado em república estudantil com ambiente de estudos e custos transparentes.",
  houseRules: ["visitas combinadas", "sem fumantes", "silêncio depois das 22h"],
  imageUrl:
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  listingTitle: "Novo quarto perto do campus",
  monthlyRent: 860,
  neighborhood: "Coração Eucarístico",
  profileTags: ["perfil de estudos", "rotina tranquila", "mobiliado"],
  roomType: "private",
};

export const landlordDashboardOverview: LandlordDashboardOverview = {
  applicants: landlordApplicants,
  calendar: landlordCalendar,
  kpis: landlordKpis,
  leads: landlordLeads,
  listings: landlordListings,
  performance: landlordPerformance,
  profile: landlordProfile,
  reviews: landlordReviews,
  tasks: landlordTasks,
};
