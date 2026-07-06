import type {
  StudentApplication,
  StudentAvailabilityAlert,
  StudentChecklistItem,
  StudentConversation,
  StudentDashboardOverview,
  StudentHousingPreferences,
  StudentProfileSummary,
  StudentSavedListing,
} from "@/lib/types";

export const studentProfileSummary: StudentProfileSummary = {
  campus: "PUC Minas - Coração Eucarístico",
  course: "Engenharia de Software",
  email: "marina.alves@universidade.br",
  id: "student-marina",
  matchCompletion: 82,
  name: "Marina Alves",
  university: "PUC Minas",
  verificationStatus: "pending",
};

export const studentPreferences: StudentHousingPreferences = {
  budgetMax: { amount: 1100, currency: "BRL" },
  commuteMaxMinutes: 15,
  houseStyle: ["casa de estudos", "visitas combinadas", "mobiliado"],
  moveInWindow: "Julho de 2026",
  priorities: ["perto do campus", "baixo custo inicial", "ambiente silencioso"],
};

export const studentSavedListings: StudentSavedListing[] = [
  {
    campusLabel: "PUC Minas",
    changes: ["preço caiu R$ 40", "nova janela de visita"],
    dueToday: { amount: 600, currency: "BRL" },
    id: "saved-puc-coracao",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
    matchScore: 94,
    neighborhood: "Coração Eucarístico",
    savedAtLabel: "salvo ha 2 dias",
    slug: "quarto-individual-republica-puc-coracao-eucaristico",
    tags: ["8 min do campus", "mobiliado", "perfil de estudos"],
    title: "Quarto individual mobiliado em república verificada",
    totalMonthly: { amount: 860, currency: "BRL" },
  },
  {
    campusLabel: "UFMG Pampulha",
    changes: ["1 pessoa também favoritou"],
    dueToday: { amount: 400, currency: "BRL" },
    id: "saved-ufmg-ouro",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    matchScore: 91,
    neighborhood: "Ouro Preto",
    savedAtLabel: "salvo ontem",
    slug: "vaga-compartilhada-ufmg-ouro-preto",
    tags: ["contas inclusas", "quarto compartilhado", "silencioso"],
    title: "Vaga compartilhada perto da UFMG com ambiente silencioso",
    totalMonthly: { amount: 690, currency: "BRL" },
  },
  {
    campusLabel: "PUC Praca da Liberdade",
    changes: ["locador respondeu rápido esta semana"],
    dueToday: { amount: 500, currency: "BRL" },
    id: "saved-sao-pedro",
    imageUrl:
      "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?auto=format&fit=crop&w=1200&q=80",
    matchScore: 90,
    neighborhood: "São Pedro",
    savedAtLabel: "salvo ha 5 dias",
    slug: "quarto-casa-estudantil-sao-pedro-praca-liberdade",
    tags: ["casa feminina", "contas inclusas", "visitas combinadas"],
    title: "Quarto em casa estudantil perto da Praca da Liberdade",
    totalMonthly: { amount: 980, currency: "BRL" },
  },
];

export const studentChecklist: StudentChecklistItem[] = [
  {
    description: "Seu perfil de convivência esta quase pronto para gerar melhores recomendações.",
    href: "/match",
    id: "match",
    label: "Completar Roommate Matching",
    status: "warning",
  },
  {
    description: "Envie documento estudantil para aumentar confiança nas candidaturas.",
    href: "/perfil",
    id: "verification",
    label: "Verificação estudantil",
    status: "pending",
  },
  {
    description: "Você já salvou opções suficientes para comparar com calma.",
    href: "/favoritos",
    id: "shortlist",
    label: "Shortlist criada",
    status: "done",
  },
];

export const studentConversations: StudentConversation[] = [
  {
    connectedListing: studentSavedListings[0],
    id: "conv-marcos",
    lastMessage: "Posso te receber amanha as 18h30 para visita.",
    messages: [
      {
        body: "Oi, Marina. Vi sua candidatura e o perfil combina com a casa.",
        id: "msg-1",
        isMine: false,
        sentAtLabel: "Ontem 18:21",
      },
      {
        body: "Obrigada! Queria confirmar se a mesa de estudos fica no quarto.",
        id: "msg-2",
        isMine: true,
        sentAtLabel: "Ontem 18:25",
      },
      {
        attachmentLabel: "comprovante_fotos.pdf",
        body: "Fica sim. Posso te receber amanha as 18h30 para visita.",
        id: "msg-3",
        isMine: false,
        sentAtLabel: "Hoje 09:12",
      },
    ],
    participantName: "Marcos Andrade",
    readState: "unread",
    trustNotice:
      "Combine visitas e pagamentos dentro dos fluxos verificados. Não envie sinal fora da plataforma.",
    unreadCount: 1,
    updatedAtLabel: "ha 12 min",
  },
  {
    connectedListing: studentSavedListings[1],
    id: "conv-ana",
    lastMessage: "A vaga ainda esta disponível para agosto.",
    messages: [
      {
        body: "A vaga ainda esta disponível para agosto.",
        id: "msg-4",
        isMine: false,
        sentAtLabel: "Hoje 08:10",
      },
    ],
    participantName: "Ana Paula",
    readState: "read",
    trustNotice:
      "Confira custos totais e regras da casa antes de enviar documentos.",
    unreadCount: 0,
    updatedAtLabel: "ha 1h",
  },
];

export const studentApplications: StudentApplication[] = [
  {
    documentsPending: ["Documento estudantil", "Comprovante de renda/fiador"],
    history: [
      {
        description: "Você enviou interesse no quarto individual.",
        id: "timeline-1",
        label: "Candidatura enviada",
        status: "complete",
        timestampLabel: "06 Jun",
      },
      {
        description: "Locador analisando perfil, matching e disponibilidade.",
        id: "timeline-2",
        label: "Análise do locador",
        status: "current",
        timestampLabel: "agora",
      },
      {
        description: "Próximo passo recomendado antes de qualquer pagamento.",
        id: "timeline-3",
        label: "Agendar visita",
        status: "upcoming",
        timestampLabel: "pendente",
      },
    ],
    id: "app-puc-coracao",
    listing: studentSavedListings[0],
    nextAction: "Enviar documento estudantil e sugerir horário de visita",
    status: "under_review",
    submittedAtLabel: "enviada ha 2 dias",
  },
  {
    documentsPending: [],
    history: [
      {
        description: "Você salvou a vaga e iniciou contato.",
        id: "timeline-4",
        label: "Contato iniciado",
        status: "complete",
        timestampLabel: "05 Jun",
      },
      {
        description: "Visita marcada com a locadora.",
        id: "timeline-5",
        label: "Visita agendada",
        status: "current",
        timestampLabel: "10 Jun",
      },
    ],
    id: "app-ufmg-ouro",
    listing: studentSavedListings[1],
    nextAction: "Confirmar presença na visita",
    status: "visit_scheduled",
    submittedAtLabel: "visita marcada",
  },
];

export const studentAlerts: StudentAvailabilityAlert[] = [
  {
    href: "/buscar/resultados?location=PUC+Minas&totalMax=1000",
    id: "alert-puc-budget",
    label: "Novo quarto até R$ 1.000 perto da PUC",
    meta: "2 opções podem entrar hoje",
  },
  {
    href: "/favoritos",
    id: "alert-shortlist",
    label: "Favorito com mudança de preço",
    meta: "Quarto individual caiu R$ 40",
  },
];

export const studentRecommendations = studentSavedListings.map((listing) => ({
  ...listing,
  id: `${listing.id}-rec`,
  changes: ["recomendado pelo match"],
}));

export const studentDashboardOverview: StudentDashboardOverview = {
  alerts: studentAlerts,
  applications: studentApplications,
  checklist: studentChecklist,
  conversations: studentConversations,
  preferences: studentPreferences,
  profile: studentProfileSummary,
  recommendations: studentRecommendations,
  savedListings: studentSavedListings,
};
