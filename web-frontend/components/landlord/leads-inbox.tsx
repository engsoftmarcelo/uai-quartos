"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  MessageCircle,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { LandlordLead, LandlordLeadStage, LandlordListing } from "@/lib/types";
import { cn } from "@/lib/utils";

const stageLabels: Record<LandlordLeadStage, string> = {
  contacted: "contatado",
  lost: "perdido",
  new: "novo",
  proposal: "proposta",
  visit_scheduled: "visita",
  won: "ocupado",
};

const stageOptions = [
  { label: "Todos", value: "all" },
  { label: "Novos", value: "new" },
  { label: "Contatados", value: "contacted" },
  { label: "Visitas", value: "visit_scheduled" },
  { label: "Propostas", value: "proposal" },
];

const quickReplies = [
  "Obrigado pelo interesse. Posso confirmar custos e disponibilidade agora.",
  "Voce pode sugerir dois horarios para visita?",
  "Antes de qualquer pagamento, vamos manter os combinados pela plataforma.",
];

export function LeadsInbox({
  leads,
  listings,
}: {
  leads: LandlordLead[];
  listings: LandlordListing[];
}) {
  const [stageFilter, setStageFilter] = useState<LandlordLeadStage | "all">("all");
  const [selectedId, setSelectedId] = useState(leads[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) =>
        stageFilter === "all" ? true : lead.stage === stageFilter,
      ),
    [leads, stageFilter],
  );
  const selectedLead =
    leads.find((lead) => lead.id === selectedId) ?? filteredLeads[0] ?? leads[0];
  const listing = selectedLead
    ? listings.find((item) => item.id === selectedLead.connectedListingId)
    : undefined;

  function sendReply() {
    if (!draft.trim()) {
      setFeedback("Escolha um template ou escreva uma resposta objetiva.");
      return;
    }

    setFeedback("Resposta pronta para sincronizar quando a API de mensagens entrar.");
    setDraft("");
  }

  if (!leads.length) {
    return (
      <section className="grid gap-3 rounded-md border border-dashed border-border bg-surface p-6 text-center">
        <MessageCircle className="mx-auto h-8 w-8 text-brand" aria-hidden="true" />
        <h2 className="font-display text-2xl font-bold text-foreground">
          Nenhum lead novo
        </h2>
        <p className="text-sm leading-6 text-muted">
          Quando estudantes entrarem em contato, eles aparecem agrupados por
          anuncio e estagio operacional.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-4">
      <div className="grid gap-3 rounded-md border border-border bg-surface p-4 shadow-xs md:grid-cols-[minmax(0,1fr)_14rem] md:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Inbox operacional
          </h2>
          <p className="mt-1 text-sm text-muted">
            Responda rapido, mantenha historico e conecte cada conversa ao
            anuncio certo.
          </p>
        </div>
        <Select
          label="Estagio"
          onChange={(event) =>
            setStageFilter(event.target.value as LandlordLeadStage | "all")
          }
          options={stageOptions}
          value={stageFilter}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <aside className="grid gap-2 rounded-md border border-border bg-surface p-3 shadow-xs">
          {filteredLeads.map((lead) => {
            const leadListing = listings.find(
              (item) => item.id === lead.connectedListingId,
            );
            const selected = lead.id === selectedLead?.id;

            return (
              <button
                className={cn(
                  "grid gap-2 rounded-md border p-3 text-left transition focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]",
                  selected
                    ? "border-brand bg-brand-soft"
                    : "border-border bg-surface-raised hover:bg-surface-muted",
                )}
                key={lead.id}
                onClick={() => {
                  setSelectedId(lead.id);
                  setFeedback(null);
                }}
                type="button"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="font-bold text-muted-strong">{lead.name}</span>
                  <Badge tone={lead.unread ? "accent" : "neutral"}>
                    {stageLabels[lead.stage]}
                  </Badge>
                </span>
                <span className="line-clamp-2 text-sm leading-5 text-muted">
                  {lead.messagePreview}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-muted">
                  {leadListing?.title ?? "Anuncio"} - {lead.lastInteractionLabel}
                </span>
              </button>
            );
          })}
        </aside>

        {selectedLead ? (
          <article className="grid gap-4 rounded-md border border-border bg-surface p-4 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-brand">
                  {listing?.title ?? "Anuncio conectado"}
                </p>
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {selectedLead.name}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {selectedLead.budgetLabel} - {selectedLead.matchScore}% match
                </p>
              </div>
              <Badge tone="brand">{stageLabels[selectedLead.stage]}</Badge>
            </div>

            <InlineMessage
              icon={<ShieldCheck className="h-5 w-5" />}
              tone="success"
              title="Fluxo seguro"
            >
              Confirme custo total, visita e documentos dentro da plataforma
              antes de qualquer pagamento.
            </InlineMessage>

            {selectedLead.visitTimeLabel ? (
              <p className="inline-flex items-center gap-2 rounded-md bg-accent-soft p-3 text-sm font-bold text-[#72520d]">
                <CalendarClock className="h-4 w-4" aria-hidden="true" />
                {selectedLead.visitTimeLabel}
              </p>
            ) : null}

            <div className="grid gap-2">
              <h4 className="text-sm font-bold text-muted-strong">
                Historico de interacoes
              </h4>
              {selectedLead.interactions.map((interaction) => (
                <p
                  className="grid grid-cols-[1rem_minmax(0,1fr)_auto] gap-2 text-sm text-muted"
                  key={interaction.id}
                >
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 text-success"
                    aria-hidden="true"
                  />
                  <span>{interaction.label}</span>
                  <span className="font-bold">{interaction.timestampLabel}</span>
                </p>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickReplies.map((reply) => (
                <button
                  className="inline-flex h-9 shrink-0 items-center rounded-md border border-border bg-surface px-3 text-xs font-bold text-muted-strong transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]"
                  key={reply}
                  onClick={() => {
                    setDraft(reply);
                    setFeedback(null);
                  }}
                  type="button"
                >
                  {reply}
                </button>
              ))}
            </div>
            <Textarea
              label="Resposta"
              onChange={(event) => {
                setDraft(event.target.value);
                setFeedback(null);
              }}
              rows={4}
              value={draft}
            />
            {feedback ? (
              <p className="text-sm font-medium text-muted-strong" role="status">
                {feedback}
              </p>
            ) : null}
            <Button
              className="w-full sm:w-fit"
              onClick={sendReply}
              rightIcon={<Send className="h-4 w-4" aria-hidden="true" />}
            >
              Responder lead
            </Button>
          </article>
        ) : null}
      </div>
    </section>
  );
}
