import type { MatchWizardStep } from "@/lib/types";

export const matchWizardSteps: MatchWizardStep[] = [
  {
    category: "Sono e rotina",
    id: "sleep-routine",
    mode: "single",
    options: [
      {
        description: "Acorda cedo e prefere casa mais calma a noite.",
        id: "early",
        label: "Pessoa da manha",
      },
      {
        description: "Funciona melhor a noite e precisa de flexibilidade.",
        id: "night",
        label: "Pessoa da noite",
      },
      {
        description: "Se adapta bem, desde que os combinados estejam claros.",
        id: "flexible",
        label: "Rotina flexível",
      },
    ],
    title: "Como e sua rotina de sono?",
    type: "multi-choice",
    why:
      "Sono desalinhado vira atrito rápido. A gente usa isso para sugerir casas com rotina parecida.",
  },
  {
    category: "Horários",
    fields: [
      {
        defaultValue: 7,
        highLabel: "mais tarde",
        id: "wakeHour",
        label: "Horário de acordar",
        lowLabel: "mais cedo",
        max: 12,
        min: 5,
        step: 1,
        unit: "h",
      },
      {
        defaultValue: 23,
        highLabel: "mais tarde",
        id: "sleepHour",
        label: "Horário de dormir",
        lowLabel: "mais cedo",
        max: 26,
        min: 20,
        step: 1,
        unit: "h",
      },
    ],
    id: "sleep-hours",
    title: "Quais horários costumam funcionar para você?",
    type: "range",
    why:
      "Horários ajudam a evitar choque de luz, barulho e uso de áreas compartilhadas.",
  },
  {
    category: "Limpeza",
    id: "cleanliness",
    mode: "single",
    options: [
      {
        description: "Gosta de tudo no lugar e combinados de limpeza bem claros.",
        id: "very-organized",
        label: "Muito organizada",
      },
      {
        description: "Mantem o básico e topa escala compartilhada.",
        id: "balanced",
        label: "Equilibrada",
      },
      {
        description: "Prefere uma casa mais relaxada, sem rigidez diária.",
        id: "relaxed",
        label: "Mais tranquila",
      },
    ],
    title: "Qual e seu nível de organização?",
    type: "multi-choice",
    why:
      "Limpeza e uma das maiores fontes de conflito em repúblicas. Melhor alinhar cedo.",
  },
  {
    category: "Estudos",
    fields: [
      {
        defaultValue: 70,
        highLabel: "silêncio total",
        id: "studyQuiet",
        label: "Silêncio para estudar",
        lowLabel: "ruido ok",
        max: 100,
        min: 0,
        step: 10,
        unit: "%",
      },
    ],
    id: "study-noise",
    title: "Quanto silêncio você precisa para estudar?",
    type: "range",
    why:
      "Isso ajuda a diferenciar casas focadas em estudo de casas mais sociais.",
  },
  {
    category: "Visitas",
    id: "guests",
    mode: "single",
    options: [
      {
        description: "Receber amigos e parceiros com combinados simples.",
        id: "allowed",
        label: "Gosto de receber",
      },
      {
        description: "Tudo bem, desde que seja avisado antes.",
        id: "limited",
        label: "Com aviso previo",
      },
      {
        description: "Prefere casa sem visitas frequentes.",
        id: "rare",
        label: "Quase nunca",
      },
    ],
    title: "Como você lida com visitas e hospedes?",
    type: "multi-choice",
    why:
      "Visitas mudam ruido, privacidade e segurança percebida na casa.",
  },
  {
    category: "Social",
    fields: [
      {
        defaultValue: 40,
        highLabel: "bem social",
        id: "socialEnergy",
        label: "Festas e socialização",
        lowLabel: "bem calma",
        max: 100,
        min: 0,
        step: 10,
        unit: "%",
      },
    ],
    id: "social-energy",
    title: "Que energia social combina com você?",
    type: "range",
    why:
      "Ajuda a sugerir casas com clima parecido: silenciosas, equilibradas ou mais movimentadas.",
  },
  {
    category: "Regras sensíveis",
    id: "sensitive-rules",
    mode: "multiple",
    optional: true,
    options: [
      {
        description: "Não quer morar com fumantes dentro de casa.",
        id: "no-smoking",
        label: "Não fumante",
      },
      {
        description: "Prefere ou precisa de casa que aceite pets.",
        id: "pets-ok",
        label: "Pets ok",
      },
      {
        description: "Tem alergia ou prefere casa sem animais.",
        id: "no-pets",
        label: "Sem pets",
      },
      {
        description: "Precisa de previsibilidade para dormir ou estudar.",
        id: "quiet-night",
        label: "Noites silenciosas",
      },
    ],
    title: "Alguma regra sensível para você?",
    type: "multi-choice",
    why:
      "Essas preferências costumam ser decisivas, mas você pode pular se ainda não souber.",
  },
  {
    category: "Conforto",
    fields: [
      {
        defaultValue: 22,
        highLabel: "mais quente",
        id: "temperature",
        label: "Temperatura do ambiente",
        lowLabel: "mais frio",
        max: 30,
        min: 16,
        step: 1,
        unit: "C",
      },
    ],
    id: "temperature",
    optional: true,
    title: "Qual temperatura de casa te deixa confortavel?",
    type: "range",
    why:
      "Parece pequeno, mas ventilador, janela e ar condicionado afetam convivência todos os dias.",
  },
  {
    category: "Orçamento",
    id: "budget",
    max: 2500,
    min: 400,
    suggestedMax: 1200,
    title: "Qual faixa de orçamento funciona agora?",
    type: "budget",
    why:
      "A gente separa custo mensal e valor de entrada para evitar surpresa na decisao.",
  },
  {
    category: "Contrato e casa",
    id: "house-style",
    mode: "multiple",
    options: [
      {
        description: "Menos troca de moradores e rotina mais previsível.",
        id: "long-term",
        label: "Longa duração",
      },
      {
        description: "Bom para intercambio, estágio ou semestre específico.",
        id: "short-term",
        label: "Curta duração",
      },
      {
        description: "Casa com combinados, estudos e menos barulho.",
        id: "study-house",
        label: "Casa de estudos",
      },
      {
        description: "Casa com convivência mais social.",
        id: "social-house",
        label: "Casa social",
      },
    ],
    title: "Que estilo de casa você esta buscando?",
    type: "multi-choice",
    why:
      "Estilo de casa ajuda a comparar expectativa, duração mínima e rotina de convivência.",
  },
  {
    category: "Limites",
    id: "deal-breakers",
    optional: true,
    options: [
      {
        description: "Evitar casas com festas frequentes.",
        id: "frequent-parties",
        label: "Festa frequente",
      },
      {
        description: "Evitar casas sem escala de limpeza.",
        id: "no-cleaning-plan",
        label: "Sem escala de limpeza",
      },
      {
        description: "Evitar casas com fumante dentro.",
        id: "indoor-smoking",
        label: "Fumante dentro",
      },
      {
        description: "Evitar custo inicial alto.",
        id: "high-deposit",
        label: "Caução alta",
      },
    ],
    title: "Tem algo que seria um não imediato?",
    type: "deal-breakers",
    why:
      "Deal breakers ajudam o matching futuro a esconder opções que so fariam você perder tempo.",
  },
  {
    category: "Prioridades",
    id: "optional-info",
    optional: true,
    placeholder:
      "Ex.: preciso de silêncio em semana de prova, gosto de cozinhar a noite, tenho alergia a gato...",
    priorityOptions: [
      { id: "near-campus", label: "perto do campus" },
      { id: "low-cost", label: "baixo custo" },
      { id: "quiet", label: "silêncio" },
      { id: "friendly-roommates", label: "pessoas parecidas" },
      { id: "private-room", label: "quarto individual" },
    ],
    title: "Quer deixar algum contexto extra?",
    type: "optional-info",
    why:
      "Contexto livre ajuda a equipe e o matching futuro a entender detalhes que escolhas fechadas não capturam.",
  },
];
