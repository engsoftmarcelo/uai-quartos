"use client";

import {
  Activity,
  CheckCircle2,
  Gauge,
  Loader2,
  MessageCircle,
  Radio,
  Send,
  Sparkles,
  Users,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "@/contexts/auth-provider";
import { API_BASE_URL, api } from "@/lib/api";

interface SocialProfile {
  noiseLevel: number;
  organization: number;
  visitorPolicy: number;
  sleepRoutine: number;
  isPetFriendly: boolean;
  isSmoker: boolean;
  preferenceVector?: number[];
}

interface MatchFactor {
  key: string;
  label: string;
  score: number;
}

interface MatchResult {
  propertyId: string;
  propertyName: string;
  score: number;
  compatibility: "Alta" | "Media" | "Baixa";
  vectorSimilarity: number;
  factors: MatchFactor[];
}

interface ConversationUser {
  id: string;
  name: string;
  email: string;
}

interface ConversationProperty {
  id: string;
  name: string;
  imageUrl?: string | null;
  neighborhood?: string | null;
}

interface MessageRecord {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  eventId?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
  createdAt: string;
}

interface ConversationRecord {
  id: string;
  property: ConversationProperty;
  student: ConversationUser;
  landlord: ConversationUser;
  messages: MessageRecord[];
  updatedAt: string;
}

interface MessageEvent {
  conversationId: string;
  message: MessageRecord;
}

type SocketStatus = "offline" | "connecting" | "online" | "rejected";

const socketBaseUrl = new URL(API_BASE_URL).origin;
const defaultProfile: SocialProfile = {
  noiseLevel: 3,
  organization: 4,
  visitorPolicy: 3,
  sleepRoutine: 4,
  isPetFriendly: false,
  isSmoker: false,
};

const sliderMeta = [
  {
    key: "noiseLevel",
    label: "Ruido",
    minLabel: "Silencio",
    maxLabel: "Movimento",
  },
  {
    key: "organization",
    label: "Organizacao",
    minLabel: "Flexivel",
    maxLabel: "Rigorosa",
  },
  {
    key: "visitorPolicy",
    label: "Visitas",
    minLabel: "Raras",
    maxLabel: "Frequentes",
  },
  {
    key: "sleepRoutine",
    label: "Sono",
    minLabel: "Noturno",
    maxLabel: "Madrugador",
  },
] as const;

export function SocialWorkspace() {
  const { accessToken, user } = useAuth();
  const [profile, setProfile] = useState<SocialProfile>(defaultProfile);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [draft, setDraft] = useState("");
  const [socketStatus, setSocketStatus] = useState<SocketStatus>("offline");
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );
  const bestMatch = matches[0];

  const loadProfile = useCallback(async () => {
    if (!user) return;

    setIsProfileLoading(true);

    try {
      const { data } = await api.get<SocialProfile>("/social/profile");
      setProfile(normalizeProfile(data));
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setIsProfileLoading(false);
    }
  }, [user]);

  const loadMatches = useCallback(async () => {
    if (!user) return;

    setIsMatching(true);

    try {
      const { data } = await api.get<MatchResult[]>("/matches");
      setMatches(data);
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setIsMatching(false);
    }
  }, [user]);

  const loadConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data } = await api.get<ConversationRecord[]>("/conversations");
      setConversations(data);
      setActiveConversationId((current) => current ?? data[0]?.id ?? null);
    } catch (error) {
      setFeedback(getErrorMessage(error));
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setMatches([]);
      setConversations([]);
      setMessages([]);
      setActiveConversationId(null);
      return;
    }

    void Promise.all([loadProfile(), loadMatches(), loadConversations()]);
  }, [loadConversations, loadMatches, loadProfile, user]);

  useEffect(() => {
    if (!accessToken) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setSocketStatus("offline");
      return;
    }

    setSocketStatus("connecting");
    const socket = io(`${socketBaseUrl}/chat`, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    socketRef.current = socket;
    socket.on("connect", () => setSocketStatus("connecting"));
    socket.on("connection:ready", () => setSocketStatus("online"));
    socket.on("connection:rejected", () => setSocketStatus("rejected"));
    socket.on("disconnect", () => setSocketStatus("offline"));
    socket.on("message:new", (event: MessageEvent) => {
      setMessages((current) =>
        event.conversationId === activeConversationId
          ? appendMessage(current, event.message)
          : current,
      );
      setConversations((current) =>
        bumpConversation(current, event.conversationId, event.message),
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, activeConversationId]);

  useEffect(() => {
    if (!activeConversationId || !user) {
      setMessages([]);
      return;
    }

    let isActive = true;

    api
      .get<MessageRecord[]>(`/conversations/${activeConversationId}/messages`)
      .then(({ data }) => {
        if (isActive) setMessages(data);
      })
      .catch((error) => setFeedback(getErrorMessage(error)));

    socketRef.current?.emit("conversation:join", {
      conversationId: activeConversationId,
    });

    return () => {
      isActive = false;
    };
  }, [activeConversationId, user]);

  const liveProfileVector = useMemo(() => profileToVector(profile), [profile]);

  async function saveProfile() {
    if (!user) return;

    setFeedback(null);
    setIsSaving(true);

    try {
      const { data } = await api.put<SocialProfile>("/social/profile", profile);
      setProfile(normalizeProfile(data));
      await loadMatches();
      setFeedback("Perfil sociocultural atualizado.");
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function startConversation(match: MatchResult) {
    setFeedback(null);
    setIsMessaging(true);

    try {
      const { data } = await api.post<ConversationRecord>("/conversations", {
        propertyId: match.propertyId,
      });
      setConversations((current) => upsertConversation(current, data));
      setActiveConversationId(data.id);
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setIsMessaging(false);
    }
  }

  async function sendMessage() {
    const body = draft.trim();
    const conversationId = activeConversationId;

    if (!body || !conversationId) return;

    const eventId = `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    setDraft("");

    if (socketRef.current?.connected && socketStatus === "online") {
      socketRef.current.emit("message:send", { conversationId, body, eventId });
      return;
    }

    setIsMessaging(true);

    try {
      const { data } = await api.post<MessageRecord>(
        `/conversations/${conversationId}/messages`,
        { body, eventId },
      );
      setMessages((current) => appendMessage(current, data));
      setConversations((current) => bumpConversation(current, conversationId, data));
    } catch (error) {
      setDraft(body);
      setFeedback(getErrorMessage(error));
    } finally {
      setIsMessaging(false);
    }
  }

  if (!user) {
    return (
      <section className="rounded-lg border border-[#dfe5d9] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-[#eef2ea] text-[#27735d]">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6258]">
              Sprint 3
            </p>
            <h2 className="text-2xl font-semibold text-[#191b18]">
              Heuristicas sociais
            </h2>
          </div>
        </div>
        <p className="mt-4 rounded-md border border-dashed border-[#d0d8ca] bg-[#f8faf6] p-4 text-sm text-[#5b6258]">
          Entre como estudante para calcular afinidade, abrir conversas e testar
          eventos de mensageria.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-5 rounded-lg border border-[#dfe5d9] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 border-b border-[#edf1e9] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6258]">
            Sprint 3
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-[#191b18]">
            Heuristicas sociais
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md bg-[#eef2ea] px-3 py-2 text-sm font-semibold text-[#174d3d]">
          {socketStatus === "online" ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          {socketLabel[socketStatus]}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="grid content-start gap-4 rounded-md border border-[#dfe5d9] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-[#27735d]" />
              <h3 className="text-lg font-semibold">Perfil de convivencia</h3>
            </div>
            {isProfileLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#27735d]" />
            ) : null}
          </div>

          <div className="grid gap-4">
            {sliderMeta.map((item) => (
              <PreferenceSlider
                key={item.key}
                label={item.label}
                maxLabel={item.maxLabel}
                minLabel={item.minLabel}
                value={profile[item.key]}
                onChange={(value) =>
                  setProfile((current) => ({
                    ...current,
                    [item.key]: value,
                  }))
                }
              />
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <ToggleButton
              active={profile.isPetFriendly}
              label="Aceita pets"
              onClick={() =>
                setProfile((current) => ({
                  ...current,
                  isPetFriendly: !current.isPetFriendly,
                }))
              }
            />
            <ToggleButton
              active={profile.isSmoker}
              label="Fumante"
              onClick={() =>
                setProfile((current) => ({
                  ...current,
                  isSmoker: !current.isSmoker,
                }))
              }
            />
          </div>

          <VectorPreview values={liveProfileVector} />

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#27735d] px-4 text-sm font-semibold text-white transition hover:bg-[#1f604e] disabled:bg-[#9ab9ad]"
              disabled={isSaving}
              type="button"
              onClick={() => void saveProfile()}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Salvar perfil
            </button>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-[#dfe5d9] px-4 text-sm font-semibold text-[#343832] transition hover:bg-[#f4f6f2] disabled:text-[#8a9185]"
              disabled={isMatching}
              type="button"
              onClick={() => void loadMatches()}
            >
              {isMatching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Recalcular
            </button>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <div className="grid gap-3 rounded-md border border-[#dfe5d9] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#27735d]" />
                <h3 className="text-lg font-semibold">Afinidade</h3>
              </div>
              {bestMatch ? (
                <span className="rounded-md bg-[#e7f3ed] px-2 py-1 text-sm font-semibold text-[#174d3d]">
                  {bestMatch.score}%
                </span>
              ) : null}
            </div>

            {matches.length ? (
              <div className="grid gap-3">
                {matches.slice(0, 4).map((match) => (
                  <MatchCard
                    key={match.propertyId}
                    match={match}
                    onStart={() => void startConversation(match)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhuma republica ativa retornou score ainda." />
            )}
          </div>

          <div className="grid gap-3 rounded-md border border-[#dfe5d9] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#27735d]" />
                <h3 className="text-lg font-semibold">Mensageria</h3>
              </div>
              {isMessaging ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#27735d]" />
              ) : null}
            </div>

            <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="grid content-start gap-2">
                {conversations.length ? (
                  conversations.map((conversation) => (
                    <button
                      className={`grid gap-1 rounded-md border p-3 text-left text-sm transition ${
                        conversation.id === activeConversationId
                          ? "border-[#27735d] bg-[#f4fbf7]"
                          : "border-[#dfe5d9] hover:bg-[#f8faf6]"
                      }`}
                      key={conversation.id}
                      type="button"
                      onClick={() => setActiveConversationId(conversation.id)}
                    >
                      <span className="font-semibold text-[#191b18]">
                        {conversation.property.name}
                      </span>
                      <span className="text-[#5b6258]">
                        {conversation.property.neighborhood ?? "Sem bairro"}
                      </span>
                    </button>
                  ))
                ) : (
                  <EmptyState text="Abra uma conversa a partir de um match." />
                )}
              </div>

              <div className="grid min-h-[320px] grid-rows-[1fr_auto] rounded-md border border-[#edf1e9] bg-[#f8faf6]">
                <div className="grid content-start gap-2 overflow-y-auto p-3">
                  {activeConversation ? (
                    <p className="mb-1 text-sm font-semibold text-[#343832]">
                      {activeConversation.property.name}
                    </p>
                  ) : null}
                  {messages.length ? (
                    messages.map((message) => (
                      <MessageBubble
                        isOwn={message.senderId === user.id}
                        key={message.id}
                        message={message}
                      />
                    ))
                  ) : (
                    <div className="grid min-h-40 place-items-center text-center text-sm text-[#5b6258]">
                      Sem mensagens nesta conversa.
                    </div>
                  )}
                </div>

                <div className="grid gap-2 border-t border-[#edf1e9] bg-white p-3 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <input
                    className="h-11 rounded-md border border-[#dfe5d9] px-3 text-sm outline-none transition focus:border-[#27735d] focus:ring-2 focus:ring-[#27735d]/15"
                    disabled={!activeConversationId}
                    placeholder="Mensagem"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                  />
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#27735d] px-4 text-sm font-semibold text-white transition hover:bg-[#1f604e] disabled:bg-[#9ab9ad]"
                    disabled={!activeConversationId || !draft.trim()}
                    type="button"
                    onClick={() => void sendMessage()}
                  >
                    <Send className="h-4 w-4" />
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {feedback ? (
        <p className="rounded-md border border-[#dfe5d9] bg-[#f8faf6] px-3 py-2 text-sm text-[#343832]">
          {feedback}
        </p>
      ) : null}
    </section>
  );
}

function PreferenceSlider({
  label,
  maxLabel,
  minLabel,
  onChange,
  value,
}: {
  label: string;
  maxLabel: string;
  minLabel: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-[#343832]">{label}</span>
        <span className="rounded-md bg-[#eef2ea] px-2 py-1 text-sm font-semibold text-[#174d3d]">
          {value}/5
        </span>
      </div>
      <input
        className="h-2 accent-[#27735d]"
        max={5}
        min={1}
        step={1}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="flex justify-between text-xs font-medium text-[#5b6258]">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </label>
  );
}

function ToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition ${
        active
          ? "border-[#27735d] bg-[#e7f3ed] text-[#174d3d]"
          : "border-[#dfe5d9] bg-white text-[#5b6258]"
      }`}
      type="button"
      onClick={onClick}
    >
      <Radio className="h-4 w-4" />
      {label}
    </button>
  );
}

function VectorPreview({ values }: { values: number[] }) {
  return (
    <div className="grid gap-2 rounded-md bg-[#f8faf6] p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#343832]">Vetor heuristico</p>
        <p className="text-xs font-medium text-[#5b6258]">pgvector-ready</p>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {values.map((value, index) => (
          <div
            className="grid h-16 content-end rounded-md border border-[#dfe5d9] bg-white p-1"
            key={`${value}-${index}`}
          >
            <div
              className="rounded-sm bg-[#27735d]"
              style={{ height: `${Math.max(value * 100, 8)}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MatchCard({
  match,
  onStart,
}: {
  match: MatchResult;
  onStart: () => void;
}) {
  return (
    <div className="grid gap-3 rounded-md border border-[#dfe5d9] p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-[#191b18]">{match.propertyName}</p>
          <p className="text-sm text-[#5b6258]">
            Compatibilidade {match.compatibility.toLowerCase()} / cosseno{" "}
            {match.vectorSimilarity.toFixed(2)}
          </p>
        </div>
        <span className={`rounded-md px-2 py-1 text-sm font-semibold ${scoreTone(match.score)}`}>
          {match.score}%
        </span>
      </div>
      <div className="grid gap-2">
        {match.factors.map((factor) => (
          <div className="grid gap-1" key={factor.key}>
            <div className="flex items-center justify-between text-xs font-medium text-[#5b6258]">
              <span>{factor.label}</span>
              <span>{factor.score}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#edf1e9]">
              <div
                className="h-full rounded-full bg-[#27735d]"
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#dfe5d9] text-sm font-semibold text-[#343832] transition hover:bg-[#f4f6f2]"
        type="button"
        onClick={onStart}
      >
        <MessageCircle className="h-4 w-4" />
        Conversar
      </button>
    </div>
  );
}

function MessageBubble({
  isOwn,
  message,
}: {
  isOwn: boolean;
  message: MessageRecord;
}) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-md px-3 py-2 text-sm shadow-sm ${
          isOwn ? "bg-[#27735d] text-white" : "bg-white text-[#343832]"
        }`}
      >
        <p>{message.body}</p>
        <p className={`mt-1 text-xs ${isOwn ? "text-white/75" : "text-[#8a9185]"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed border-[#d0d8ca] bg-[#f8faf6] p-4 text-sm text-[#5b6258]">
      {text}
    </div>
  );
}

function normalizeProfile(profile: SocialProfile): SocialProfile {
  return {
    ...defaultProfile,
    ...profile,
  };
}

function profileToVector(profile: SocialProfile) {
  return [
    (profile.noiseLevel - 1) / 4,
    (profile.organization - 1) / 4,
    (profile.visitorPolicy - 1) / 4,
    (profile.sleepRoutine - 1) / 4,
    profile.isPetFriendly ? 1 : 0,
    profile.isSmoker ? 1 : 0,
  ];
}

function appendMessage(current: MessageRecord[], next: MessageRecord) {
  if (current.some((message) => message.id === next.id)) {
    return current;
  }

  return [...current, next];
}

function upsertConversation(
  conversations: ConversationRecord[],
  next: ConversationRecord,
) {
  const withoutNext = conversations.filter(
    (conversation) => conversation.id !== next.id,
  );

  return [next, ...withoutNext];
}

function bumpConversation(
  conversations: ConversationRecord[],
  conversationId: string,
  message: MessageRecord,
) {
  return conversations.map((conversation) =>
    conversation.id === conversationId
      ? { ...conversation, messages: [message], updatedAt: message.createdAt }
      : conversation,
  );
}

function scoreTone(score: number) {
  if (score >= 80) return "bg-[#e7f3ed] text-[#174d3d]";
  if (score >= 60) return "bg-[#fff8e8] text-[#72520d]";
  return "bg-[#fff4ef] text-[#8a3521]";
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response
  ) {
    const data = error.response.data as { message?: unknown };

    if (Array.isArray(data.message)) {
      return data.message.join(" ");
    }

    if (typeof data.message === "string") {
      return data.message;
    }
  }

  return "Nao foi possivel concluir a operacao.";
}

const socketLabel: Record<SocketStatus, string> = {
  connecting: "Conectando",
  offline: "Socket offline",
  online: "Socket online",
  rejected: "Socket rejeitado",
};
