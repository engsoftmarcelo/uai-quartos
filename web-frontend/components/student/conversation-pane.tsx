"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  FileUp,
  LockKeyhole,
  Paperclip,
  Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineMessage } from "@/components/ui/inline-message";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import type { StudentConversation } from "@/lib/types";
import { cn } from "@/lib/utils";

const quickTemplates = [
  "Tenho interesse e posso visitar esta semana.",
  "Você confirma o custo total e o valor para entrar?",
  "A casa aceita minha rotina de estudos e silêncio a noite?",
];

export function ConversationPane({
  conversation,
}: {
  conversation: StudentConversation;
}) {
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  function submitMessage() {
    if (!draft.trim()) {
      setStatus("Escreva uma mensagem ou escolha um template rápido.");
      return;
    }

    setStatus("Mensagem pronta para envio quando a API de mensagens estiver conectada.");
    setDraft("");
  }

  return (
    <section className="grid min-h-[42rem] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden rounded-md border border-border bg-surface shadow-xs">
      <header className="grid gap-3 border-b border-border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-brand">
              {conversation.participantName}
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Conversa conectada ao anúncio
            </h2>
          </div>
          <Badge tone={conversation.readState === "unread" ? "accent" : "neutral"}>
            {conversation.readState === "unread" ? "não lida" : "lida"}
          </Badge>
        </div>

        <Link
          className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] gap-3 rounded-md border border-border bg-surface-raised p-2 transition hover:bg-surface-muted"
          href={`/anuncio/${conversation.connectedListing.slug}`}
        >
          <span className="relative block aspect-square overflow-hidden rounded-md bg-surface-muted">
            <Image
              alt={conversation.connectedListing.title}
              className="object-cover"
              fill
              sizes="72px"
              src={conversation.connectedListing.imageUrl}
            />
          </span>
          <span className="grid gap-1">
            <span className="line-clamp-1 text-sm font-bold text-muted-strong">
              {conversation.connectedListing.title}
            </span>
            <span className="text-sm text-muted">
              {formatCurrency(conversation.connectedListing.totalMonthly.amount)}
              /mês - {conversation.connectedListing.matchScore}% match
            </span>
          </span>
          <ArrowRight className="mt-2 h-4 w-4 text-muted" aria-hidden="true" />
        </Link>

        <InlineMessage
          icon={<LockKeyhole className="h-5 w-5" />}
          tone="warning"
          title="Pagamento seguro"
        >
          {conversation.trustNotice}
        </InlineMessage>
      </header>

      <div className="grid content-end gap-3 overflow-y-auto bg-surface-muted/40 p-4">
        {conversation.messages.map((message) => (
          <div
            className={cn(
              "grid max-w-[86%] gap-1 rounded-md px-3 py-2 text-sm shadow-xs",
              message.isMine
                ? "ml-auto bg-brand text-white"
                : "mr-auto bg-surface text-muted-strong",
            )}
            key={message.id}
          >
            <p className="leading-6">{message.body}</p>
            {message.attachmentLabel ? (
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-bold",
                  message.isMine
                    ? "bg-white/15 text-white"
                    : "bg-surface-muted text-muted-strong",
                )}
              >
                <Paperclip className="h-3.5 w-3.5" aria-hidden="true" />
                {message.attachmentLabel}
              </span>
            ) : null}
            <span
              className={cn(
                "text-[0.72rem] font-bold",
                message.isMine ? "text-white/75" : "text-muted",
              )}
            >
              {message.sentAtLabel}
            </span>
          </div>
        ))}
      </div>

      <footer className="grid gap-3 border-t border-border p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickTemplates.map((template) => (
            <button
              className="inline-flex h-9 shrink-0 items-center rounded-md border border-border bg-surface px-3 text-xs font-bold text-muted-strong transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[var(--focus-ring)]"
              key={template}
              onClick={() => {
                setDraft(template);
                setStatus(null);
              }}
              type="button"
            >
              {template}
            </button>
          ))}
        </div>
        <Textarea
          label="Mensagem"
          onChange={(event) => {
            setDraft(event.target.value);
            setStatus(null);
          }}
          placeholder="Escreva de forma objetiva e mantenha combinados na plataforma."
          rows={3}
          value={draft}
        />
        {status ? (
          <p className="text-sm font-medium text-muted-strong" role="status">
            {status}
          </p>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
          <Button
            leftIcon={<FileUp className="h-4 w-4" aria-hidden="true" />}
            variant="secondary"
          >
            Anexar
          </Button>
          <p className="text-xs leading-5 text-muted">
            Anexe documentos apenas quando fizer sentido para a candidatura.
          </p>
          <Button
            onClick={submitMessage}
            rightIcon={<Send className="h-4 w-4" aria-hidden="true" />}
          >
            Enviar
          </Button>
        </div>
      </footer>
    </section>
  );
}
