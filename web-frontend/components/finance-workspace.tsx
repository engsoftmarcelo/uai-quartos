"use client";

import {
  BadgeDollarSign,
  Banknote,
  CheckCircle2,
  Clipboard,
  FileSignature,
  Landmark,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Split,
  WalletCards,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/auth-provider";
import { api, type Role } from "@/lib/api";

interface PropertyRoom {
  id: string;
  title: string;
  basePrice: number;
  isAvailable: boolean;
  privateBathroom: boolean;
  capacity: number;
}

interface PropertyResponse {
  id: string;
  name: string;
  neighborhood?: string | null;
  city?: string | null;
  rooms: PropertyRoom[];
}

interface RecipientResponse {
  id: string;
  provider: string;
  providerAccountId: string;
  legalName: string;
  document: string;
  pixKey?: string | null;
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
}

interface ReservationDossier {
  id: string;
  roomId: string;
  propertyName: string;
  roomTitle: string;
  status: ReservationStatus;
  createdAt: string;
  paidAt?: string | null;
  paymentExpiresAt?: string | null;
  pricing: {
    grossValue: number;
    platformFee: number;
    netValue: number;
    platformFeePct: number;
  };
  payment: {
    provider: string;
    invoiceId?: string | null;
    pixCode?: string | null;
    splitPayload?: unknown;
  };
  split?: {
    calculationType: "PERCENTAGE" | "FIXED";
    platformAmount: number;
    landlordAmount: number;
    recipient: {
      providerAccountId: string;
      legalName: string;
      status: string;
    };
  } | null;
  contract?: {
    documentKey: string;
    providerDocumentId: string;
    status: "DRAFT" | "SENT" | "SIGNED" | "CANCELED";
    signatureRequestUrl?: string | null;
  } | null;
  ledger: Array<{
    id: string;
    account: string;
    direction: "DEBIT" | "CREDIT";
    amount: number;
    description: string;
    createdAt: string;
  }>;
  webhookEvents: Array<{
    id: string;
    provider: string;
    eventType: string;
    status: string;
    processedAt?: string | null;
  }>;
}

type ReservationStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "APPROVED"
  | "CONTRACT_PENDING"
  | "CONTRACT_SIGNED"
  | "SETTLED"
  | "FAILED"
  | "REFUNDED"
  | "CANCELED";

const canManageRecipient = (role?: Role) =>
  role === "LANDLORD" || role === "ADMIN";

const statusLabel: Record<ReservationStatus, string> = {
  APPROVED: "Aprovada",
  CANCELED: "Cancelada",
  CONTRACT_PENDING: "Contrato pendente",
  CONTRACT_SIGNED: "Contrato assinado",
  FAILED: "Falhou",
  PAID: "Pago",
  PENDING: "Pix pendente",
  PROCESSING: "Processando",
  REFUNDED: "Estornada",
  SETTLED: "Liquidada",
};

export function FinanceWorkspace() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [reservations, setReservations] = useState<ReservationDossier[]>([]);
  const [recipient, setRecipient] = useState<RecipientResponse | null>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);
  const [recipientForm, setRecipientForm] = useState({
    legalName: "",
    document: "",
    providerAccountId: "",
    pixKey: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingRecipient, setIsSavingRecipient] = useState(false);
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedReservation =
    reservations.find((reservation) => reservation.id === selectedReservationId) ??
    reservations[0];
  const availableRooms = useMemo(
    () =>
      properties.flatMap((property) =>
        property.rooms
          .filter((room) => room.isAvailable)
          .map((room) => ({ property, room })),
      ),
    [properties],
  );

  const loadFinance = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      const requests: Array<Promise<unknown>> = [
        api.get<ReservationDossier[]>("/finance/reservations").then(({ data }) => {
          setReservations(data);
          setSelectedReservationId((current) => current ?? data[0]?.id ?? null);
        }),
      ];

      if (user.role === "STUDENT") {
        requests.push(
          api
            .get<PropertyResponse[]>("/properties", {
              params: {
                lat: -19.9236,
                lng: -43.9928,
                radius: 5000,
                maxPrice: 2000,
                onlyAvailable: true,
                limit: 12,
              },
            })
            .then(({ data }) => setProperties(data)),
        );
      }

      if (canManageRecipient(user.role)) {
        requests.push(
          api
            .get<RecipientResponse | null>("/finance/recipient/me")
            .then(({ data }) => {
              setRecipient(data);
              setRecipientForm({
                legalName: data?.legalName ?? user.name,
                document: data?.document ?? "",
                providerAccountId: data?.providerAccountId ?? "",
                pixKey: data?.pixKey ?? user.email,
              });
            })
            .catch(() => {
              setRecipient(null);
              setRecipientForm((current) => ({
                ...current,
                legalName: current.legalName || user.name,
                pixKey: current.pixKey || user.email,
              }));
            }),
        );
      }

      await Promise.all(requests);
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadFinance();
  }, [loadFinance]);

  useEffect(() => {
    if (!user) return;

    const timer = window.setInterval(() => {
      void loadFinance();
    }, 10000);

    return () => window.clearInterval(timer);
  }, [loadFinance, user]);

  async function saveRecipient() {
    setIsSavingRecipient(true);
    setFeedback(null);

    try {
      const { data } = await api.put<RecipientResponse>(
        "/finance/recipient/me",
        {
          legalName: recipientForm.legalName,
          document: recipientForm.document,
          providerAccountId: recipientForm.providerAccountId || undefined,
          pixKey: recipientForm.pixKey || undefined,
        },
      );
      setRecipient(data);
      setFeedback("Recipient Iugu sandbox configurado.");
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setIsSavingRecipient(false);
    }
  }

  async function createReservation(room: PropertyRoom) {
    setIsCreatingReservation(true);
    setFeedback(null);

    try {
      const { data } = await api.post<ReservationDossier>("/reservations", {
        roomId: room.id,
        amount: room.basePrice,
        idempotencyKey: `checkout_${room.id}_${Date.now()}`,
      });
      setReservations((current) => [data, ...current]);
      setSelectedReservationId(data.id);
      await loadFinance();
      setFeedback("Intent Pix com split criado.");
    } catch (error) {
      setFeedback(getErrorMessage(error));
    } finally {
      setIsCreatingReservation(false);
    }
  }

  async function copyPix(code?: string | null) {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setFeedback("Pix copia e cola enviado para a área de transferência.");
    } catch {
      setFeedback(code);
    }
  }

  if (!user) {
    return (
      <section className="rounded-lg border border-[#dfe5d9] bg-white p-5 shadow-sm">
        <SprintHeader status="Iugu + Clicksign" />
        <p className="mt-4 rounded-md border border-dashed border-[#d0d8ca] bg-[#f8faf6] p-4 text-sm text-[#5b6258]">
          Entre para acessar checkout Pix, split de pagamento, ledger e contrato.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-5 rounded-lg border border-[#dfe5d9] bg-white p-4 shadow-sm sm:p-5">
      <SprintHeader status="Split + Compliance" />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="grid content-start gap-4">
          {canManageRecipient(user.role) ? (
            <RecipientPanel
              form={recipientForm}
              isSaving={isSavingRecipient}
              recipient={recipient}
              onChange={setRecipientForm}
              onSave={() => void saveRecipient()}
            />
          ) : null}

          {user.role === "STUDENT" ? (
            <CheckoutPanel
              isCreating={isCreatingReservation}
              rooms={availableRooms}
              onReserve={(room) => void createReservation(room)}
            />
          ) : null}
        </div>

        <div className="grid content-start gap-4">
          <div className="grid gap-3 rounded-md border border-[#dfe5d9] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <WalletCards className="h-5 w-5 text-[#27735d]" />
                <h3 className="text-lg font-semibold">Reservas financeiras</h3>
              </div>
              <button
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-[#dfe5d9] px-3 text-sm font-semibold text-[#343832] transition hover:bg-[#f4f6f2]"
                type="button"
                onClick={() => void loadFinance()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Atualizar
              </button>
            </div>

            {reservations.length ? (
              <div className="grid gap-2">
                {reservations.map((reservation) => (
                  <button
                    className={`grid gap-1 rounded-md border p-3 text-left transition ${
                      reservation.id === selectedReservation?.id
                        ? "border-[#27735d] bg-[#f4fbf7]"
                        : "border-[#dfe5d9] hover:bg-[#f8faf6]"
                    }`}
                    key={reservation.id}
                    type="button"
                    onClick={() => setSelectedReservationId(reservation.id)}
                  >
                    <span className="font-semibold text-[#191b18]">
                      {reservation.propertyName}
                    </span>
                    <span className="text-sm text-[#5b6258]">
                      {statusLabel[reservation.status]} /{" "}
                      {formatCurrency(reservation.pricing.grossValue)}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState text="Nenhuma reserva financeira encontrada." />
            )}
          </div>

          {selectedReservation ? (
            <ReservationDossierPanel
              reservation={selectedReservation}
              onCopyPix={() => void copyPix(selectedReservation.payment.pixCode)}
            />
          ) : null}
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

function SprintHeader({ status }: { status: string }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#edf1e9] pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5b6258]">
          Sprint 4
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-[#191b18]">
          Arquitetura financeira
        </h2>
      </div>
      <div className="inline-flex items-center gap-2 rounded-md bg-[#eef2ea] px-3 py-2 text-sm font-semibold text-[#174d3d]">
        <ShieldCheck className="h-4 w-4" />
        {status}
      </div>
    </div>
  );
}

function RecipientPanel({
  form,
  isSaving,
  onChange,
  onSave,
  recipient,
}: {
  form: {
    legalName: string;
    document: string;
    providerAccountId: string;
    pixKey: string;
  };
  isSaving: boolean;
  onChange: (form: {
    legalName: string;
    document: string;
    providerAccountId: string;
    pixKey: string;
  }) => void;
  onSave: () => void;
  recipient: RecipientResponse | null;
}) {
  return (
    <div className="grid gap-4 rounded-md border border-[#dfe5d9] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Landmark className="h-5 w-5 text-[#27735d]" />
          <h3 className="text-lg font-semibold">Recipient do locador</h3>
        </div>
        {recipient ? (
          <span className="rounded-md bg-[#e7f3ed] px-2 py-1 text-sm font-semibold text-[#174d3d]">
            {recipient.status}
          </span>
        ) : null}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Razao social"
          value={form.legalName}
          onChange={(value) => onChange({ ...form, legalName: value })}
        />
        <TextField
          label="CPF/CNPJ"
          value={form.document}
          onChange={(value) => onChange({ ...form, document: value })}
        />
        <TextField
          label="Recipient Iugu"
          value={form.providerAccountId}
          onChange={(value) => onChange({ ...form, providerAccountId: value })}
        />
        <TextField
          label="Chave Pix"
          value={form.pixKey}
          onChange={(value) => onChange({ ...form, pixKey: value })}
        />
      </div>
      <button
        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#27735d] px-4 text-sm font-semibold text-white transition hover:bg-[#1f604e] disabled:bg-[#9ab9ad]"
        disabled={isSaving || !form.legalName || !form.document}
        type="button"
        onClick={onSave}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Salvar recipient
      </button>
    </div>
  );
}

function CheckoutPanel({
  isCreating,
  onReserve,
  rooms,
}: {
  isCreating: boolean;
  onReserve: (room: PropertyRoom) => void;
  rooms: Array<{ property: PropertyResponse; room: PropertyRoom }>;
}) {
  return (
    <div className="grid gap-4 rounded-md border border-[#dfe5d9] p-4">
      <div className="flex items-center gap-2">
        <BadgeDollarSign className="h-5 w-5 text-[#27735d]" />
        <h3 className="text-lg font-semibold">Checkout Pix</h3>
      </div>
      {rooms.length ? (
        <div className="grid gap-3">
          {rooms.slice(0, 5).map(({ property, room }) => (
            <div
              className="grid gap-3 rounded-md border border-[#edf1e9] p-3"
              key={room.id}
            >
              <div>
                <p className="font-semibold text-[#191b18]">{property.name}</p>
                <p className="text-sm text-[#5b6258]">
                  {room.title} / {formatCurrency(room.basePrice)}
                </p>
              </div>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#dfe5d9] text-sm font-semibold text-[#343832] transition hover:bg-[#f4f6f2] disabled:text-[#8a9185]"
                disabled={isCreating}
                type="button"
                onClick={() => onReserve(room)}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Banknote className="h-4 w-4" />
                )}
                Gerar Pix
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState text="Nenhum quarto disponível para checkout." />
      )}
    </div>
  );
}

function ReservationDossierPanel({
  onCopyPix,
  reservation,
}: {
  onCopyPix: () => void;
  reservation: ReservationDossier;
}) {
  return (
    <div className="grid gap-4 rounded-md border border-[#dfe5d9] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5b6258]">
            Dossie financeiro
          </p>
          <h3 className="text-lg font-semibold text-[#191b18]">
            {reservation.propertyName}
          </h3>
        </div>
        <span className={`rounded-md px-2 py-1 text-sm font-semibold ${statusTone(reservation.status)}`}>
          {statusLabel[reservation.status]}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Metric label="Bruto" value={formatCurrency(reservation.pricing.grossValue)} />
        <Metric label="Taxa UAI" value={formatCurrency(reservation.pricing.platformFee)} />
        <Metric label="Locador" value={formatCurrency(reservation.pricing.netValue)} />
      </div>

      <div className="grid gap-2 rounded-md bg-[#f8faf6] p-3">
        <div className="flex items-center gap-2">
          <Split className="h-4 w-4 text-[#27735d]" />
          <p className="text-sm font-semibold text-[#343832]">Split Iugu</p>
        </div>
        <ProgressLine
          label={`Plataforma ${reservation.pricing.platformFeePct}%`}
          value={reservation.pricing.platformFee}
          max={reservation.pricing.grossValue}
        />
        <ProgressLine
          label="Repasse locador"
          value={reservation.pricing.netValue}
          max={reservation.pricing.grossValue}
        />
        <p className="text-xs font-medium text-[#5b6258]">
          Recipient:{" "}
          {reservation.split?.recipient.providerAccountId ?? "sandbox pendente"}
        </p>
      </div>

      {reservation.payment.pixCode ? (
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#dfe5d9] px-3 text-sm font-semibold text-[#343832] transition hover:bg-[#f4f6f2]"
          type="button"
          onClick={onCopyPix}
        >
          <Clipboard className="h-4 w-4" />
          Copiar Pix
        </button>
      ) : null}

      <div className="grid gap-2 rounded-md border border-[#edf1e9] p-3">
        <div className="flex items-center gap-2">
          <FileSignature className="h-4 w-4 text-[#27735d]" />
          <p className="text-sm font-semibold text-[#343832]">Clicksign</p>
        </div>
        {reservation.contract ? (
          <div className="grid gap-1 text-sm text-[#5b6258]">
            <p>Status: {reservation.contract.status}</p>
            <p className="break-all">Documento: {reservation.contract.documentKey}</p>
            {reservation.contract.signatureRequestUrl ? (
              <p className="break-all">
                {reservation.contract.signatureRequestUrl}
              </p>
            ) : null}
          </div>
        ) : (
          <EmptyState text="Contrato será gerado após liquidação Pix." />
        )}
      </div>

      <div className="grid gap-2">
        <p className="text-sm font-semibold text-[#343832]">Ledger</p>
        {reservation.ledger.length ? (
          reservation.ledger.map((entry) => (
            <div
              className="grid gap-1 rounded-md border border-[#edf1e9] p-3 text-sm"
              key={entry.id}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-[#191b18]">
                  {entry.account}
                </span>
                <span className="font-semibold text-[#174d3d]">
                  {entry.direction} {formatCurrency(entry.amount)}
                </span>
              </div>
              <span className="text-[#5b6258]">{entry.description}</span>
            </div>
          ))
        ) : (
          <EmptyState text="Sem lancamentos contabeis ainda." />
        )}
      </div>
    </div>
  );
}

function TextField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[#343832]">{label}</span>
      <input
        className="h-11 rounded-md border border-[#dfe5d9] px-3 text-sm outline-none transition focus:border-[#27735d] focus:ring-2 focus:ring-[#27735d]/15"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-[#dfe5d9] p-3">
      <p className="text-sm text-[#5b6258]">{label}</p>
      <p className="mt-1 text-base font-semibold text-[#191b18]">{value}</p>
    </div>
  );
}

function ProgressLine({
  label,
  max,
  value,
}: {
  label: string;
  max: number;
  value: number;
}) {
  const width = max ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between text-xs font-medium text-[#5b6258]">
        <span>{label}</span>
        <span>{formatCurrency(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#edf1e9]">
        <div
          className="h-full rounded-full bg-[#27735d]"
          style={{ width: `${width}%` }}
        />
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

function statusTone(status: ReservationStatus) {
  if (status === "CONTRACT_SIGNED" || status === "SETTLED") {
    return "bg-[#e7f3ed] text-[#174d3d]";
  }

  if (status === "FAILED" || status === "CANCELED" || status === "REFUNDED") {
    return "bg-[#fff4ef] text-[#8a3521]";
  }

  return "bg-[#fff8e8] text-[#72520d]";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
    maximumFractionDigits: 0,
  }).format(value);
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

  return "Não foi possível concluir a operação.";
}
